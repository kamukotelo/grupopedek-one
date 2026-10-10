import { applyApiSecurity, takeRateLimit } from './_security.js';
import { getDatabase, isUniqueViolation } from './_neon.js';
import {
  POST_COLUMNS, getMuxUploadState, isMuxConfigured, parseImageDataUrl, parsePostFields,
  requireBlogEditor, slugify, toPublicPost,
} from './_blog.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Vídeos acabados de enviar ficam alguns minutos em processamento no Mux.
// Sempre que a lista é pedida, tenta-se obter o playback ID dos que ainda não o têm.
const resolvePendingVideos = async (sql, rows) => {
  if (!isMuxConfigured()) return rows;
  const pending = rows.filter((row) => row.media_type === 'video' && !row.mux_playback_id && row.mux_upload_id).slice(0, 5);
  await Promise.all(pending.map(async (row) => {
    try {
      const state = await getMuxUploadState(row.mux_upload_id);
      if (state.status !== 'ready') return;
      await sql.query('UPDATE private.blog_posts SET mux_playback_id = $2, updated_at = now() WHERE id = $1', [row.id, state.playbackId]);
      row.mux_playback_id = state.playbackId;
    } catch { /* Tenta-se de novo no próximo pedido. */ }
  }));
  return rows;
};

/** Valida o bloco `media` do pedido e devolve as colunas correspondentes. */
const parseMedia = (media) => {
  const type = media?.type;
  if (type === 'none' || !type) {
    return { columns: { media_type: 'none', mux_upload_id: null, mux_playback_id: null, image_data: null, image_mime: null } };
  }
  if (type === 'video') {
    const uploadId = typeof media.uploadId === 'string' ? media.uploadId.trim() : '';
    if (!/^[A-Za-z0-9]{10,100}$/.test(uploadId)) return { error: 'Vídeo inválido. Volte a enviar o ficheiro.' };
    return { columns: { media_type: 'video', mux_upload_id: uploadId, mux_playback_id: null, image_data: null, image_mime: null } };
  }
  if (type === 'image') {
    const image = parseImageDataUrl(media.dataUrl);
    if (image.error) return { error: image.error };
    // Vai como texto base64 e é convertido no SQL (decode): o driver HTTP do Neon envia
    // os parâmetros como texto e não garante a conversão de Buffer para bytea.
    return { columns: { media_type: 'image', mux_upload_id: null, mux_playback_id: null, image_data: image.bytes.toString('base64'), image_mime: image.mime } };
  }
  return { error: 'Tipo de media inválido.' };
};

const listPosts = async (req, res, sql) => {
  if (req.query?.manage === '1') {
    if (!await requireBlogEditor(req, res)) return;
    const rows = await sql.query(`SELECT ${POST_COLUMNS} FROM private.blog_posts ORDER BY created_at DESC LIMIT 200`);
    await resolvePendingVideos(sql, rows);
    return res.status(200).json({ posts: rows.map(toPublicPost) });
  }

  if (takeRateLimit(req, 'blog-list', 60)) return res.status(429).json({ error: 'Muitos pedidos. Aguarde um minuto.' });
  const rows = await sql.query(
    `SELECT ${POST_COLUMNS} FROM private.blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC NULLS LAST LIMIT 60`,
  );
  await resolvePendingVideos(sql, rows);
  // Notícias com vídeo só aparecem ao público quando o vídeo já está pronto.
  const visible = rows.filter((row) => row.media_type !== 'video' || row.mux_playback_id);
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  return res.status(200).json({ posts: visible.map(toPublicPost) });
};

const createPost = async (req, res, sql) => {
  const user = await requireBlogEditor(req, res);
  if (!user) return;
  const body = req.body || {};
  const parsed = parsePostFields(body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const media = parseMedia(body.media);
  if (media.error) return res.status(400).json({ error: media.error });

  const { title, summary, category, audience, status } = parsed.fields;
  const base = slugify(title);
  const authorName = user.profile?.full_name || user.email || '';
  for (let attempt = 0; attempt < 4; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${crypto.randomUUID().slice(0, 4)}`;
    try {
      const [row] = await sql.query(
        `INSERT INTO private.blog_posts
          (slug, title, summary, category, audience, media_type, mux_upload_id, mux_playback_id,
           image_data, image_mime, status, published_at, created_by, created_by_name)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,decode($9, 'base64'),$10,$11, CASE WHEN $11 = 'published' THEN now() END, $12, $13)
         RETURNING ${POST_COLUMNS}`,
        [slug, title, summary, category, audience, media.columns.media_type, media.columns.mux_upload_id,
          media.columns.mux_playback_id, media.columns.image_data, media.columns.image_mime, status,
          user.id, authorName],
      );
      await resolvePendingVideos(sql, [row]);
      return res.status(201).json({ post: toPublicPost(row) });
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }
  return res.status(409).json({ error: 'Já existe uma notícia com este título.' });
};

const updatePost = async (req, res, sql, id) => {
  if (!await requireBlogEditor(req, res)) return;
  const body = req.body || {};
  const parsed = parsePostFields(body, { partial: true });
  if (parsed.error) return res.status(400).json({ error: parsed.error });

  const columns = { ...parsed.fields };
  if (body.media !== undefined) {
    const media = parseMedia(body.media);
    if (media.error) return res.status(400).json({ error: media.error });
    Object.assign(columns, media.columns);
  }
  const keys = Object.keys(columns);
  if (keys.length === 0) return res.status(400).json({ error: 'Nada para actualizar.' });

  const assignments = keys.map((key, index) => (key === 'image_data' ? `${key} = decode($${index + 2}, 'base64')` : `${key} = $${index + 2}`));
  // Primeira publicação: regista a data. Voltar a rascunho mantém a data original.
  if (columns.status === 'published') assignments.push('published_at = COALESCE(published_at, now())');
  const [row] = await sql.query(
    `UPDATE private.blog_posts SET ${assignments.join(', ')}, updated_at = now()
      WHERE id = $1 RETURNING ${POST_COLUMNS}`,
    [id, ...keys.map((key) => columns[key])],
  );
  if (!row) return res.status(404).json({ error: 'Notícia não encontrada.' });
  await resolvePendingVideos(sql, [row]);
  return res.status(200).json({ post: toPublicPost(row) });
};

const deletePost = async (req, res, sql, id) => {
  if (!await requireBlogEditor(req, res)) return;
  const rows = await sql.query('DELETE FROM private.blog_posts WHERE id = $1 RETURNING id', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Notícia não encontrada.' });
  return res.status(204).end();
};

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET', 'POST', 'PATCH', 'DELETE'] })) return;

  const id = typeof req.query?.id === 'string' ? req.query.id : '';
  if ((req.method === 'PATCH' || req.method === 'DELETE') && !UUID.test(id)) {
    return res.status(400).json({ error: 'Identificador inválido.' });
  }

  let sql;
  try {
    sql = getDatabase();
  } catch {
    return res.status(503).json({ error: 'Base de dados não configurada.' });
  }

  try {
    if (req.method === 'GET') return await listPosts(req, res, sql);
    if (req.method === 'POST') return await createPost(req, res, sql);
    if (req.method === 'PATCH') return await updatePost(req, res, sql, id);
    return await deletePost(req, res, sql, id);
  } catch (error) {
    console.error('blog', error);
    if (!res.headersSent) return res.status(500).json({ error: 'Não foi possível concluir o pedido.' });
  }
}
