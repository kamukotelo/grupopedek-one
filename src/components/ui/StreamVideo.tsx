import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { SiteVideo } from '../../data/siteVideos';

type StreamVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> & { video: SiteVideo };

const muxStreamUrl = (playbackId: string) => `https://stream.mux.com/${playbackId}.m3u8`;

// <video> que usa o HLS adaptativo do Mux quando o vídeo tem playback ID, e o MP4
// local caso contrário ou se o stream falhar. O aspeto é o de um <video> normal.
// O hls.js carrega-se só quando há um vídeo do Mux (import dinâmico).
export const StreamVideo = forwardRef<HTMLVideoElement, StreamVideoProps>(({ video, preload, children, ...props }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);
  const { src, muxPlaybackId } = video;

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !muxPlaybackId) return;

    const fallbackToMp4 = () => {
      if (element.getAttribute('src') === src) return;
      element.src = src;
      if (element.autoplay) void element.play().catch(() => undefined);
    };

    // Só se usa o HLS nativo onde não há MediaSource (iPhones antigos): alguns Chromium
    // respondem "maybe" ao canPlayType de HLS e depois falham a reprodução.
    const hasMediaSource = 'MediaSource' in window || 'ManagedMediaSource' in window;
    if (!hasMediaSource && element.canPlayType('application/vnd.apple.mpegurl')) {
      element.addEventListener('error', fallbackToMp4, { once: true });
      element.src = muxStreamUrl(muxPlaybackId);
      return () => element.removeEventListener('error', fallbackToMp4);
    }

    let destroyed = false;
    let hls: import('hls.js').default | undefined;
    const startOnPlay = () => hls?.startLoad();

    void import('hls.js/light').then(({ default: Hls }) => {
      if (destroyed) return;
      if (!Hls.isSupported()) { fallbackToMp4(); return; }
      const lazy = preload === 'none';
      const instance = new Hls({ capLevelToPlayerSize: true, autoStartLoad: !lazy });
      hls = instance;
      instance.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (import.meta.env.DEV) console.warn('[StreamVideo] Mux falhou, a usar o MP4:', data.details, data.error);
        instance.destroy();
        hls = undefined;
        fallbackToMp4();
      });
      instance.on(Hls.Events.MANIFEST_PARSED, () => {
        if (element.autoplay) void element.play().catch(() => undefined);
      });
      instance.loadSource(muxStreamUrl(muxPlaybackId));
      instance.attachMedia(element);
      if (lazy) element.addEventListener('play', startOnPlay, { once: true });
    }).catch(fallbackToMp4);

    return () => {
      destroyed = true;
      element.removeEventListener('play', startOnPlay);
      hls?.destroy();
    };
  }, [muxPlaybackId, src, preload]);

  // Com Mux, a fonte é definida no cliente: o HTML pré-renderizado não traz o MP4,
  // para não se descarregar o mesmo vídeo duas vezes.
  return <video ref={videoRef} src={muxPlaybackId ? undefined : src} preload={preload} {...props}>{children}</video>;
});

StreamVideo.displayName = 'StreamVideo';
