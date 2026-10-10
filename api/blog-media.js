import { applyApiSecurity, takeRateLimit } from './_security.js';
import { getDatabase } from './_neon.js';
import { getMuxUploadState, isMuxConfigured, mux, requireBlogEditor } from './_blog.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET  ?image=<id>   → fotografia de uma notícia (público, com cache)
// GET  ?upload=<id>  → estado de um vídeo enviado para o Mux (editores)
// POST               → cria um upload directo no Mux; o browser envia o vídeo
//                      directamente para o Mux, sem passar pela Vercel (editores)
export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET', 'POST'] })) return;

  try {
    if (req.method === 'POST') return await createVideoUpload(req, res);
    if (typeof req.query?.upload === 'string') return await videoUploadStatus(req, res, req.query.upload);
    return await serveImage(req, res, String(req.query?.image || ''));
  } catch (error) {
    console.error('blog-media', error);
    if (!res.headersSent) return res.status(500).json({ error: 'Não foi possível concluir o pedido.' });
  }
}

const createVideoUpload = async (req, res) => {
  if (!await requireBlogEditor(req, res)) return;
  if (!isMuxConfigured()) return res.status(503).json({ error: 'O envio de vídeos não está configurado (Mux).' });
  if (takeRateLimit(req, 'blog-video-upload', 10)) return res.status(429).json({ error: 'Muitos envios. Aguarde um minuto.' });

  const origin = req.headers.origin || process.env.SITE_URL || 'https://pepekgrupo.com';
  const upload = await mux('/video/v1/uploads', {
    method: 'POST',
    body: JSON.stringify({
      cors_origin: origin,
      new_asset_settings: { playback_policy: ['public'], video_quality: 'basic', passthrough: 'blogue' },
    }),
  });
  return res.status(201).json({ uploadId: upload.id, url: upload.url });
};

const videoUploadStatus = async (req, res, uploadId) => {
  if (!await requireBlogEditor(req, res)) return;
  if (!/^[A-Za-z0-9]{10,100}$/.test(uploadId)) return res.status(400).json({ error: 'Upload inválido.' });
  if (!isMuxConfigured()) return res.status(503).json({ error: 'O envio de vídeos não está configurado (Mux).' });
  return res.status(200).json(await getMuxUploadState(uploadId));
};

const serveImage = async (req, res, id) => {
  if (!UUID.test(id)) return res.status(400).json({ error: 'Imagem inválida.' });
  if (takeRateLimit(req, 'blog-image', 240)) return res.status(429).json({ error: 'Muitos pedidos.' });

  let sql;
  try {
    sql = getDatabase();
  } catch {
    return res.status(503).json({ error: 'Base de dados não configurada.' });
  }
  const [row] = await sql.query(
    "SELECT image_data, image_mime FROM private.blog_posts WHERE id = $1 AND media_type = 'image' LIMIT 1",
    [id],
  );
  if (!row?.image_data) return res.status(404).json({ error: 'Imagem não encontrada.' });

  // Consoante o driver, o bytea chega como Buffer/Uint8Array ou como texto hexadecimal "\\x…".
  const raw = row.image_data;
  const bytes = typeof raw === 'string'
    ? Buffer.from(raw.startsWith('\\x') ? raw.slice(2) : raw, 'hex')
    : Buffer.from(raw);
  res.setHeader('Content-Type', row.image_mime);
  res.setHeader('Content-Length', String(bytes.length));
  // O URL leva ?v=<data de actualização>, por isso pode ficar em cache por muito tempo.
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  return res.status(200).end(bytes);
};
