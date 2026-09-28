import muxPlaybackIds from './muxPlaybackIds.json';

// Catálogo único dos vídeos do site (Hero e Blogue).
// `src` é o MP4 local, servido enquanto o vídeo não estiver no Mux ou se o Mux falhar.
// Os playback IDs do Mux vêm de muxPlaybackIds.json, gerado por scripts/upload-videos-mux.mjs.
export type SiteVideoId =
  | 'african-sezs-mobilidade'
  | 'mobilidade-internacional'
  | 'operacao-pepek'
  | 'viaturas-preparadas'
  | 'hyundai-staria-vip';

export type SiteVideo = { src: string; muxPlaybackId?: string };

const LOCAL_SOURCES: Record<SiteVideoId, string> = {
  'african-sezs-mobilidade': '/videos/pepek-african-sezs-2-web.mp4',
  'mobilidade-internacional': '/videos/pepek-argentina-4-web.mp4',
  'operacao-pepek': '/videos/operacao-pepek-web.m4v',
  'viaturas-preparadas': '/videos/img-1872-web.mp4',
  'hyundai-staria-vip': '/videos/img-8510-web.mp4',
};

const playbackIds = muxPlaybackIds as Partial<Record<SiteVideoId, string>>;

export const SITE_VIDEOS = Object.fromEntries(
  Object.entries(LOCAL_SOURCES).map(([id, src]) => [id, { src, muxPlaybackId: playbackIds[id as SiteVideoId] || undefined }]),
) as Record<SiteVideoId, SiteVideo>;

export const SITE_VIDEO_LOCAL_SOURCES = LOCAL_SOURCES;
