import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Car, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Imagem de fundo — usa a primeira viatura VIP da frota
  const bgVehicle = PUBLIC_FLEET.find((v) => v.id === 'rangerover-blindado-2025');
  const bgImage = bgVehicle?.primaryImage ?? '';

  const [currentStory, setCurrentStory] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(true);
  const [isStoryMuted, setIsStoryMuted] = useState(true);
  const storyVideoRef = useRef<HTMLVideoElement>(null);
  const storyPointerStartX = useRef<number | null>(null);

  const homepageStories: { id: string; video: string; title: string; tagline?: string }[] = [
    { id: 'african-sezs-mobilidade', video: '/videos/pepek-african-sezs-2-web.mp4', title: t('hero.videoStoryPartnership') },
    { id: 'mobilidade-internacional', video: '/videos/pepek-argentina-4-web.mp4', title: t('hero.videoStoryInternational'), tagline: t('hero.videoStoryInternationalTagline') },
    { id: 'operacao-pepek', video: '/videos/operacao-pepek-web.m4v', title: t('hero.videoStoryOperation'), tagline: t('hero.videoStoryOperationTagline') },
    { id: 'viaturas-preparadas', video: '/videos/img-1872-web.mp4', title: t('hero.videoStoryFleet'), tagline: t('hero.videoStoryFleetTagline') },
    { id: 'hyundai-staria-vip', video: '/videos/img-8510-web.mp4', title: t('hero.videoStoryStaria'), tagline: t('hero.videoStoryStariaTagline') },
  ];

  // Rotação automática das histórias (máx. 12 s por história, mas respeita prefers-reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setCurrentStory((s) => (s + 1) % homepageStories.length);
      setIsStoryPlaying(true);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [homepageStories.length]);

  useEffect(() => {
    const video = storyVideoRef.current;
    if (!video) return;
    video.muted = isStoryMuted;
    if (isStoryPlaying) {
      void video.play().catch(() => setIsStoryPlaying(false));
    } else {
      video.pause();
    }
  }, [currentStory, isStoryMuted, isStoryPlaying]);

  const toggleStoryPlayback = () => {
    const video = storyVideoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setIsStoryPlaying(true)).catch(() => setIsStoryPlaying(false));
    } else {
      video.pause();
      setIsStoryPlaying(false);
    }
  };

  const selectStory = (index: number) => {
    setCurrentStory(index);
    setIsStoryPlaying(true);
  };

  const changeStory = (direction: -1 | 1) => {
    setCurrentStory((story) => (story + direction + homepageStories.length) % homepageStories.length);
    setIsStoryPlaying(true);
  };

  const visibleStories = [-1, 0, 1].map((offset) => ({
    position: offset,
    index: (currentStory + offset + homepageStories.length) % homepageStories.length,
  }));

  const goToSection = (id: string, route: string) => () => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    navigate(route);
  };

  const scrollToBooking = goToSection('reserva', '/reservar');
  const scrollToFleet = goToSection('frota', '/frota');

  return (
    <section id="inicio" className="relative bg-[#001E4A] text-white pt-24 lg:pt-40 pb-16 overflow-hidden min-h-[92vh] flex flex-col justify-between select-none">
      {/* Fundo cinemático */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src={bgImage}
          alt=""
          className="h-full w-full scale-[1.02] object-cover object-center brightness-[0.58] contrast-[1.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001E4A]/95 via-[#001E4A]/76 to-[#174B86]/44" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001E4A] via-transparent to-[#001E4A]/65" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#236199]/20 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="container-pepek relative z-10 flex-1 flex flex-col justify-center">

        {/* ── VÍDEOS (Stories) ── */}
        <div
          data-home-video-showcase
          className="group relative order-1 mb-8 w-full overflow-hidden rounded-[26px] border border-white/15 bg-[#07182F]/95 p-3 shadow-[0_20px_55px_rgba(0,0,0,.28)] animate-fadeIn sm:p-5 lg:mb-12"
        >
          <div className="grid items-center gap-3">
            <div
              className="relative flex min-w-0 touch-pan-y select-none items-center justify-center py-1 sm:h-[440px] lg:h-[500px] xl:h-[540px]"
              onPointerDown={(event) => { storyPointerStartX.current = event.clientX; }}
              onPointerUp={(event) => {
                if (storyPointerStartX.current === null) return;
                const distance = event.clientX - storyPointerStartX.current;
                storyPointerStartX.current = null;
                if (Math.abs(distance) > 42) changeStory(distance > 0 ? -1 : 1);
              }}
              onPointerCancel={() => { storyPointerStartX.current = null; }}
            >
              <div className="flex h-full w-full items-center justify-center gap-3 sm:gap-5 lg:gap-6">
                {visibleStories.map(({ position, index }) => {
                  const story = homepageStories[index];
                  const isActive = position === 0;
                  return (
                    <button
                      key={`${position}-${story.id}`}
                      type="button"
                      onClick={() => isActive ? toggleStoryPlayback() : selectStory(index)}
                      className={`relative shrink-0 overflow-hidden text-left transition-all duration-500 ${
                        isActive
                          ? 'z-10 w-full max-w-[360px] aspect-[3/4] rounded-[22px] border-2 border-[#FEC228] shadow-[0_18px_40px_rgba(0,0,0,0.6),0_0_26px_rgba(254,194,40,0.24)] sm:h-full sm:w-auto sm:max-w-none'
                          : 'hidden h-[52%] aspect-[406/720] rounded-[14px] border border-white/15 opacity-40 hover:opacity-75 sm:block'
                      }`}
                      aria-label={isActive ? (isStoryPlaying ? t('hero.videoPause') : t('hero.videoPlay')) : `${t('hero.videoSelect')} ${index + 1}: ${story.title}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <video
                        key={story.video}
                        ref={isActive ? storyVideoRef : undefined}
                        className={`absolute inset-0 h-full w-full object-center ${isActive ? 'object-cover' : 'object-contain'}`}
                        src={story.video}
                        autoPlay={isActive}
                        muted={isActive ? isStoryMuted : true}
                        playsInline
                        preload={isActive ? 'auto' : 'metadata'}
                        onPlay={isActive ? () => setIsStoryPlaying(true) : undefined}
                        onPause={isActive ? () => setIsStoryPlaying(false) : undefined}
                        onTimeUpdate={isActive ? (event) => {
                          if (event.currentTarget.currentTime >= 12 && !event.currentTarget.dataset.previewComplete) {
                            event.currentTarget.dataset.previewComplete = 'true';
                            changeStory(1);
                          }
                        } : undefined}
                        onEnded={isActive ? () => changeStory(1) : undefined}
                        aria-hidden={!isActive}
                      />
                      <span className={`pointer-events-none absolute inset-0 ${isActive ? 'bg-gradient-to-t from-[#001E4A]/85 via-transparent to-black/15' : 'bg-[#001E4A]/25'}`} />
                      {isActive && (
                        <>
                          <span className="pointer-events-none absolute inset-x-2.5 bottom-12 line-clamp-2 text-[10px] font-extrabold leading-tight text-white drop-shadow sm:inset-x-3.5 sm:bottom-14 sm:text-xs">
                            {story.title}
                          </span>
                          <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 sm:bottom-3 sm:right-3">
                            <span
                              onClick={(e) => { e.stopPropagation(); toggleStoryPlayback(); }}
                              role="button"
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228] sm:h-8 sm:w-8"
                              aria-label={isStoryPlaying ? t('hero.videoPause') : t('hero.videoPlay')}
                            >
                              {isStoryPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            </span>
                            <span
                              onClick={(e) => { e.stopPropagation(); setIsStoryMuted((muted) => !muted); }}
                              role="button"
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228] sm:h-8 sm:w-8"
                              aria-label={isStoryMuted ? t('hero.videoUnmute') : t('hero.videoMute')}
                            >
                              {isStoryMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Setas de navegação */}
              <button
                type="button"
                onClick={() => changeStory(-1)}
                className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#001E4A]/90 text-white shadow-lg backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228]"
                aria-label={t('hero.videoPrevious')}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => changeStory(1)}
                className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#001E4A]/90 text-white shadow-lg backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228]"
                aria-label={t('hero.videoNext')}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/blogue#${homepageStories[currentStory].id}`)}
              className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white/80 transition hover:text-[#FEC228]"
            >
              {t('hero.videoViewBlog')} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── HEADLINE + CTAs ── */}
        <div className="order-2 max-w-4xl mb-6">
          <h1 className="text-[2rem] sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.12] tracking-tight">
            {t('hero.title')}
            {t('hero.titleAccent') ? (
              <span className="mt-1 block text-[#FEC228]">{t('hero.titleAccent')}</span>
            ) : null}
          </h1>
          <p className="text-sm sm:text-base text-gray-200/90 font-normal mt-4 leading-relaxed max-w-2xl">
            {t('hero.description')}
          </p>
        </div>

        <div className="order-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={scrollToBooking}
            className="btn-primary text-sm font-bold py-4 px-8 shadow-xl flex items-center gap-2.5 cursor-pointer relative overflow-hidden group hover:shadow-[0_0_30px_rgba(254,194,40,0.45)] hover:scale-[1.03] transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <Car className="w-5 h-5" />
            <span>{t('hero.ctaBooking')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={scrollToFleet}
            className="btn-outline text-sm font-bold py-4 px-8 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all duration-300"
          >
            <span>{t('hero.ctaFleet')}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
