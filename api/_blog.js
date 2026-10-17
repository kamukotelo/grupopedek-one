import { authenticateNeonRequest, getDatabase } from './_neon.js';
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

// ── Tabelas ──────────────────────────────────────────────────────────────────

// Mesmo esquema que neon/migrations/20261010_blog_newsletter.sql. Corre uma vez por
// arranque da função (CREATE … IF NOT EXISTS), para o blogue e a newsletter funcionarem
// sem ser preciso aplicar a migração à mão no Neon.
const BLOG_SCHEMA = [
  `CREATE SCHEMA IF NOT EXISTS private`,
  `CREATE TABLE IF NOT EXISTS private.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
    summary TEXT NOT NULL CHECK (char_length(summary) BETWEEN 3 AND 1200),
    category TEXT NOT NULL CHECK (category IN ('partnerships', 'protocol', 'experience')),
    audience TEXT CHECK (audience IS NULL OR char_length(audience) <= 120),
    media_type TEXT NOT NULL DEFAULT 'none' CHECK (media_type IN ('video', 'image', 'none')),
    mux_upload_id TEXT,
    mux_playback_id TEXT,
    image_data BYTEA,
    image_mime TEXT CHECK (image_mime IS NULL OR image_mime IN ('image/jpeg', 'image/png', 'image/webp')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_by UUID,
    created_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (media_type <> 'image' OR (image_data IS NOT NULL AND image_mime IS NOT NULL)),
    CHECK (media_type <> 'video' OR mux_upload_id IS NOT NULL OR mux_playback_id IS NOT NULL)
)`,
  `CREATE INDEX IF NOT EXISTS blog_posts_published_idx
    ON private.blog_posts (published_at DESC) WHERE status = 'published'`,
  `CREATE TABLE IF NOT EXISTS private.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE CHECK (email = lower(email) AND email ~ '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
    language TEXT NOT NULL DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'fr')),
    source TEXT NOT NULL DEFAULT 'blogue',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
)`,
];

let schemaReady;

/** Ligação à base de dados com as tabelas do blogue e da newsletter garantidas. */
export const getBlogDatabase = async () => {
  const sql = getDatabase();
  schemaReady ??= (async () => {
    for (const statement of BLOG_SCHEMA) await sql.query(statement);
  })().catch((error) => {
    console.error('blog schema', error);
    schemaReady = undefined; // tenta de novo no próximo pedido
    throw error;
  });
  await schemaReady;
  return sql;
};
