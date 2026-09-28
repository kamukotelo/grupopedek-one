import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { SiteVideo } from '../../data/siteVideos';

type StreamVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> & {
  video: SiteVideo;
  // Chamado quando uma reprodução iniciada pelo componente (autoplay após ligar o
  // stream, ou retoma após fallback) é recusada pelo browser, p.ex. autoplay bloqueado.
  onPlayRejected?: (error: unknown) => void;
};

const muxStreamUrl = (playbackId: string) => `https://stream.mux.com/${playbackId}.m3u8`;
// Segundos de vídeo descarregados à frente: o mínimo antes do play (chega para a primeira
// imagem) e 30 s a tocar. Limita-se também o máximo, porque por omissão o hls.js
// enche até 60 MB, o que nestes vídeos leves é o vídeo inteiro.
const PLAYING_BUFFER_SECONDS = 30;
const IDLE_BUFFER_SECONDS = 1;
const bufferConfig = (seconds: number) => ({ maxBufferLength: seconds, maxMaxBufferLength: seconds });

// <video> que usa o HLS adaptativo do Mux quando o vídeo tem playback ID, e o MP4
// local caso contrário ou se o stream falhar. O aspeto é o de um <video> normal.
// O hls.js carrega-se só quando há um vídeo do Mux (import dinâmico).
export const StreamVideo = forwardRef<HTMLVideoElement, StreamVideoProps>(({ video, preload, onPlayRejected, children, ...props }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);
  const { src, muxPlaybackId } = video;
  // Lidos por ref: mudar o preload (p.ex. o vídeo passar a ser o 1.º da lista ao filtrar)
  // ou o callback não deve destruir e recriar um stream que já está a tocar.
  const preloadRef = useRef(preload);
  preloadRef.current = preload;
  const onPlayRejectedRef = useRef(onPlayRejected);
  onPlayRejectedRef.current = onPlayRejected;

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !muxPlaybackId) return;

    const play = () => {
      void element.play().catch((error: unknown) => {
        if ((error as DOMException)?.name !== 'AbortError') onPlayRejectedRef.current?.(error);
      });
    };

    // Retoma no MP4 a partir do ponto onde o stream ia, e só toca se já estava a tocar.
    const fallbackToMp4 = (resumeAt = 0, resume = element.autoplay) => {
      if (element.getAttribute('src') === src) return;
      element.src = src;
      if (resumeAt > 0) {
        element.addEventListener('loadedmetadata', () => { element.currentTime = resumeAt; }, { once: true });
      }
      if (resume) play();
    };

    // Só se usa o HLS nativo onde não há MediaSource (iPhones antigos): alguns Chromium
    // respondem "maybe" ao canPlayType de HLS e depois falham a reprodução.
    const hasMediaSource = 'MediaSource' in window || 'ManagedMediaSource' in window;
    if (!hasMediaSource && element.canPlayType('application/vnd.apple.mpegurl')) {
      const onNativeError = () => fallbackToMp4(element.currentTime, !element.paused || element.autoplay);
      element.addEventListener('error', onNativeError, { once: true });
      element.src = muxStreamUrl(muxPlaybackId);
      return () => element.removeEventListener('error', onNativeError);
    }

    let destroyed = false;
    let hls: import('hls.js').default | undefined;
    let loading = false;
    const onPlay = () => {
      if (!hls) return;
      Object.assign(hls.config, bufferConfig(PLAYING_BUFFER_SECONDS));
      if (!loading) { loading = true; hls.startLoad(); }
    };

    void import('hls.js/light').then(({ default: Hls }) => {
      if (destroyed) return;
      if (!Hls.isSupported()) { fallbackToMp4(); return; }
      const mode = preloadRef.current;
      loading = mode !== 'none';
      const instance = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: loading,
        ...bufferConfig(mode === 'auto' || element.autoplay ? PLAYING_BUFFER_SECONDS : IDLE_BUFFER_SECONDS),
      });
      hls = instance;
      instance.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (import.meta.env.DEV) console.warn('[StreamVideo] Mux falhou, a usar o MP4:', data.details, data.error);
        // Guardar o estado antes do destroy(), que esvazia o <video>.
        const resumeAt = element.currentTime;
        const resume = !element.paused || element.autoplay;
        instance.destroy();
        hls = undefined;
        fallbackToMp4(resumeAt, resume);
      });
      instance.on(Hls.Events.MANIFEST_PARSED, () => {
        if (element.autoplay) play();
      });
      instance.loadSource(muxStreamUrl(muxPlaybackId));
      instance.attachMedia(element);
      element.addEventListener('play', onPlay);
    }).catch(() => fallbackToMp4());

    return () => {
      destroyed = true;
      element.removeEventListener('play', onPlay);
      hls?.destroy();
    };
  }, [muxPlaybackId, src]);

  // Com Mux, a fonte é definida no cliente: o HTML pré-renderizado não traz o MP4,
  // para não se descarregar o mesmo vídeo duas vezes.
  return <video ref={videoRef} src={muxPlaybackId ? undefined : src} preload={preload} {...props}>{children}</video>;
});

StreamVideo.displayName = 'StreamVideo';
