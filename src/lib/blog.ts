import { getAccessToken } from './neon';

export type BlogCategory = 'partnerships' | 'protocol' | 'experience';
export type BlogMediaType = 'video' | 'image' | 'none';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: BlogCategory;
  audience: string;
  mediaType: BlogMediaType;
  muxPlaybackId: string | null;
  imageUrl: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdByName: string;
  updatedAt: string;
  videoPending: boolean;
}

export type BlogMediaInput =
  | { type: 'none' }
  | { type: 'video'; uploadId: string }
  | { type: 'image'; dataUrl: string };

export interface BlogPostInput {
  title: string;
  summary: string;
  category: BlogCategory;
  audience: string;
  status: 'draft' | 'published';
  media?: BlogMediaInput;
}

export interface NewsletterSubscriber {
  email: string;
  language: string;
  source: string;
  createdAt: string;
}

const readError = async (response: Response, fallback: string) => {
  const body = await response.json().catch(() => null) as { error?: string } | null;
  return new Error(body?.error || fallback);
};

const authorizedFetch = async (input: string, init: RequestInit = {}) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Sessão expirada. Entre novamente na Área de Cliente.');
  return fetch(input, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
};

// ── Público ─────────────────────────────────────────────────────────────────

export const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog');
  if (!response.ok) throw await readError(response, 'Não foi possível carregar as notícias.');
  const body = await response.json() as { posts?: BlogPost[] };
  return Array.isArray(body.posts) ? body.posts : [];
};

export const subscribeNewsletter = async (email: string, language: string) => {
  const response = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, language: language.slice(0, 2), source: 'blogue' }),
  });
  if (!response.ok) throw await readError(response, 'Não foi possível registar a subscrição.');
};

// ── Gestão (editores) ───────────────────────────────────────────────────────

export const fetchManagedPosts = async (): Promise<BlogPost[]> => {
  const response = await authorizedFetch('/api/blog?manage=1');
  if (!response.ok) throw await readError(response, 'Não foi possível carregar as notícias.');
  return ((await response.json()) as { posts: BlogPost[] }).posts;
};

export const createPost = async (input: BlogPostInput): Promise<BlogPost> => {
  const response = await authorizedFetch('/api/blog', { method: 'POST', body: JSON.stringify(input) });
  if (!response.ok) throw await readError(response, 'Não foi possível guardar a notícia.');
  return ((await response.json()) as { post: BlogPost }).post;
};

export const updatePost = async (id: string, input: Partial<BlogPostInput>): Promise<BlogPost> => {
  const response = await authorizedFetch(`/api/blog?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(input) });
  if (!response.ok) throw await readError(response, 'Não foi possível actualizar a notícia.');
  return ((await response.json()) as { post: BlogPost }).post;
};

export const deletePost = async (id: string) => {
  const response = await authorizedFetch(`/api/blog?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) throw await readError(response, 'Não foi possível apagar a notícia.');
};

/**
 * Envia um vídeo directamente para o Mux (sem passar pelo servidor do site) e
 * devolve o uploadId a gravar na notícia. O Mux processa o vídeo a seguir.
 */
export const uploadVideo = async (file: File, onProgress: (percent: number) => void): Promise<string> => {
  const response = await authorizedFetch('/api/blog-media', { method: 'POST' });
  if (!response.ok) throw await readError(response, 'Não foi possível preparar o envio do vídeo.');
  const { uploadId, url } = await response.json() as { uploadId: string; url: string };

  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => (request.status >= 200 && request.status < 300 ? resolve() : reject(new Error('O envio do vídeo falhou.')));
    request.onerror = () => reject(new Error('O envio do vídeo falhou. Verifique a ligação à internet.'));
    request.send(file);
  });
  return uploadId;
};

export const fetchVideoState = async (uploadId: string): Promise<{ status: 'waiting' | 'processing' | 'ready' | 'errored'; playbackId?: string }> => {
  const response = await authorizedFetch(`/api/blog-media?upload=${encodeURIComponent(uploadId)}`);
  if (!response.ok) throw await readError(response, 'Não foi possível verificar o vídeo.');
  return response.json();
};

export const fetchSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  const response = await authorizedFetch('/api/newsletter');
  if (!response.ok) throw await readError(response, 'Não foi possível carregar os subscritores.');
  return ((await response.json()) as { subscribers: NewsletterSubscriber[] }).subscribers;
};

export const downloadSubscribersCsv = async () => {
  const response = await authorizedFetch('/api/newsletter?format=csv');
  if (!response.ok) throw await readError(response, 'Não foi possível exportar os subscritores.');
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = `subscritores-newsletter-pepek-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Reduz uma fotografia para no máximo 1600 px de lado e converte-a em JPEG,
 * para o envio ser rápido em rede móvel e caber no limite do servidor.
 */
export const prepareImage = async (file: File, maxSide = 1600): Promise<string> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('O navegador não conseguiu processar a imagem.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.85);
};

export const muxPosterUrl = (playbackId: string) => `https://image.mux.com/${playbackId}/thumbnail.webp?width=960&time=1`;
export const muxStreamUrl = (playbackId: string) => `https://stream.mux.com/${playbackId}.m3u8`;

// Perfis com acesso a /painel/blogue (o servidor aplica a mesma regra em api/_blog.js).
const BLOG_EDITOR_ROLES = new Set(['direcao', 'gestor_portugal', 'marketing']);
export const canManageBlog = (role?: string | null) => Boolean(role && BLOG_EDITOR_ROLES.has(role));
