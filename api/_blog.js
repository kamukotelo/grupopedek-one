import { authenticateNeonRequest } from './_neon.js';
import { cleanText } from './_security.js';

// Perfis que podem publicar no blogue e ver os subscritores da newsletter.
export const BLOG_EDITOR_ROLES = new Set(['direcao', 'gestor_portugal', 'marketing']);
export const BLOG_CATEGORIES = new Set(['partnerships', 'protocol', 'experience']);

// Fotografias: o painel já as reduz antes do envio; isto é só o limite de segurança,
// abaixo do limite de 4,5 MB do corpo dos pedidos na Vercel (com base64).
export const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

/** Devolve o utilizador se for editor do blogue; caso contrário responde 401/403 e devolve null. */
export const requireBlogEditor = async (req, res) => {
  let user;
  try {
    user = await authenticateNeonRequest(req);
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : 'Autenticação necessária' });
    return null;
  }
  if (!BLOG_EDITOR_ROLES.has(user.app_metadata?.role)) {
    res.status(403).json({ error: 'Sem permissão para gerir o blogue.' });
    return null;
  }
  return user;
};

export const slugify = (value) => String(value || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 70)
  .replace(/-+$/g, '') || 'noticia';

/** Valida os campos de texto de uma notícia. `partial` aceita só os campos enviados (edição). */
export const parsePostFields = (body, { partial = false } = {}) => {
  const fields = {};
  const has = (key) => !partial || Object.prototype.hasOwnProperty.call(body, key);

  if (has('title')) {
    fields.title = cleanText(body.title, 160);
    if (fields.title.length < 3) return { error: 'O título precisa de pelo menos 3 caracteres.' };
  }
  if (has('summary')) {
    // Mantém as quebras de linha do texto (cleanText removeria \n).
    fields.summary = typeof body.summary === 'string'
      ? body.summary.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim().slice(0, 1200)
      : '';
    if (fields.summary.length < 3) return { error: 'O texto da notícia é obrigatório.' };
  }
  if (has('category')) {
    fields.category = cleanText(body.category, 30);
    if (!BLOG_CATEGORIES.has(fields.category)) return { error: 'Categoria inválida.' };
  }
  if (has('audience')) fields.audience = cleanText(body.audience, 120) || null;
  if (has('status')) {
    fields.status = body.status === 'published' ? 'published' : 'draft';
  }
  return { fields };
};

const IMAGE_SIGNATURES = [
  { mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { mime: 'image/webp', test: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP' },
];

/** Converte um data URL de imagem em bytes, confirmando o tipo pelo conteúdo e não pelo nome. */
export const parseImageDataUrl = (value) => {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(value || ''));
  if (!match) return { error: 'Formato de imagem inválido (use JPG, PNG ou WebP).' };
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length === 0) return { error: 'Imagem vazia.' };
  if (bytes.length > MAX_IMAGE_BYTES) return { error: 'Imagem demasiado grande.' };
  const detected = IMAGE_SIGNATURES.find((signature) => signature.test(bytes));
  if (!detected) return { error: 'O ficheiro não é uma imagem válida.' };
  return { bytes, mime: detected.mime };
};

// ── Mux ──────────────────────────────────────────────────────────────────────

export const isMuxConfigured = () => Boolean(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET);

export const mux = async (path, init = {}) => {
  if (!isMuxConfigured()) throw new Error('Mux não configurado');
  const auth = 'Basic ' + Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64');
  const response = await fetch(`https://api.mux.com${path}`, {
    ...init,
    headers: { Authorization: auth, 'Content-Type': 'application/json', ...init.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Mux ${response.status}`);
  return body.data;
};

/**
 * Estado de um upload directo do Mux: 'waiting' (ainda a enviar), 'processing',
 * 'ready' (com playbackId) ou 'errored'.
 */
export const getMuxUploadState = async (uploadId) => {
  const upload = await mux(`/video/v1/uploads/${encodeURIComponent(uploadId)}`);
  if (upload.status === 'errored' || upload.status === 'cancelled' || upload.status === 'timed_out') return { status: 'errored' };
  if (!upload.asset_id) return { status: 'waiting' };
  const asset = await mux(`/video/v1/assets/${encodeURIComponent(upload.asset_id)}`);
  if (asset.status === 'errored') return { status: 'errored' };
  const playbackId = asset.playback_ids?.find((playback) => playback.policy === 'public')?.id;
  if (asset.status === 'ready' && playbackId) return { status: 'ready', playbackId };
  return { status: 'processing' };
};

// ── Saída ────────────────────────────────────────────────────────────────────

export const POST_COLUMNS = `id, slug, title, summary, category, audience, media_type, mux_upload_id,
  mux_playback_id, image_mime, status, published_at, created_by_name, created_at, updated_at`;

export const toPublicPost = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  summary: row.summary,
  category: row.category,
  audience: row.audience || '',
  mediaType: row.media_type,
  muxPlaybackId: row.mux_playback_id || null,
  imageUrl: row.media_type === 'image'
    ? `/api/blog-media?image=${row.id}&v=${new Date(row.updated_at).getTime()}`
    : null,
  status: row.status,
  publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
  createdByName: row.created_by_name || '',
  updatedAt: new Date(row.updated_at).toISOString(),
  // Vídeo enviado mas ainda em processamento no Mux.
  videoPending: row.media_type === 'video' && !row.mux_playback_id,
});
