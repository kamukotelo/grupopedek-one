import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, ChevronLeft, Car, Sparkles, CalendarDays, MapPin, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { checkVehicleAvailability } from '../../lib/reservations';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { FLEET_STUDIO_BACKGROUNDS } from '../../data/fleetPresentation';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const luxuryVehicles = [
    ['rangerover-blindado-2025', 'hero.luxuryArmored'],
    ['mercedes-class-s-2025', 'hero.luxuryProtocol'],
    ['range-rover-novo-modelo', 'hero.luxurySuv'],
    ['lexus-600', 'hero.luxuryVip'],
    ['mercedes-g63-2023', 'hero.luxuryPerformance'],
    ['mercedes-benz-v300-class', 'hero.luxuryDelegations'],
  ] as const;
  const luxuryHeroVehicles = luxuryVehicles.flatMap(([id, segmentKey]) => {
    const vehicle = PUBLIC_FLEET.find((item) => item.id === id);
    return vehicle ? [{ id: vehicle.id, name: vehicle.name, image: vehicle.primaryImage, price: vehicle.pricePerDayFormatted, segment: t(segmentKey) }] : [];
  });

  const clientLogos = [
    { name: 'Sonangol', src: '/clients-color/sonangol.png' },
    { name: 'TotalEnergies', src: '/clients-color/totalenergies.webp' },
    { name: 'Unitel', src: '/clients-color/unitel.svg' },
    { name: 'BAI', src: '/clients-color/bai.svg' },
    { name: 'Governo de Angola', src: '/clients-color/governo-angola.png' },
    { name: 'Fundo de Garantia de Crédito', src: '/clients-color/fgc.png' },
    { name: 'Embaixada Americana', src: '/clients-color/embassy.png' },
    { name: 'Assembleia Nacional', src: '/clients-color/assembleia.png' },
    { name: 'ANPG Petróleos', src: '/clients-color/anpg.png' },
    { name: 'TAAG Linhas Aéreas', src: '/clients-color/taag.png' },
    { name: 'Banco BFA', src: '/clients-color/bai.svg' },
    { name: 'Banco Atlântico', src: '/clients-color/atlantico-oficial.png' },
    { name: 'Standard Bank', src: '/clients-color/standard.png' },
    { name: 'UNICEF Angola', src: '/clients-color/unicef.png' },
    { name: 'Fidelidade Seguros', src: '/clients-color/fidelidade.png' },
    { name: 'DSTV MultiChoice', src: '/clients-color/dstv.png' },
    { name: 'ZAP Angola', src: '/clients-color/zap.png' },
    { name: 'Catoca Diamantes', src: '/clients-color/catoca.png' },
    { name: 'Rede Globo', src: '/clients-color/globo.png' },
    { name: 'CNN Brasil', src: '/clients-color/cnn.png' },
  ];
  const slides = Array.from({ length: Math.ceil(clientLogos.length / 5) }, (_, index) => clientLogos.slice(index * 5, index * 5 + 5));
  const [currentSlide, setCurrentSlide] = useState(0);

  const [currentLuxury, setCurrentLuxury] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(true);
  const [isStoryMuted, setIsStoryMuted] = useState(true);
  const storyVideoRef = useRef<HTMLVideoElement>(null);
  const storyPointerStartX = useRef<number | null>(null);
  const [isLuxuryPaused, setIsLuxuryPaused] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'on_request' | 'unavailable' | 'unknown'>('idle');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'destination' | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const homepageStories = [
    { id: 'african-sezs-mobilidade', video: '/videos/pepek-african-sezs-2-web.mp4', title: t('hero.videoStoryPartnership') },
    { id: 'mobilidade-internacional', video: '/videos/pepek-argentina-4-web.mp4', title: t('hero.videoStoryInternational') },
    { id: 'operacao-pepek', video: '/videos/pepek-african-sezs-1-web.mp4', title: t('hero.videoStoryOperation') },
    { id: 'viaturas-preparadas', video: '/videos/img-1872-web.mp4', title: t('hero.videoStoryFleet') },
  ];
  const locationSuggestions = [
    'Aeroporto Internacional Dr. António Agostinho Neto (AIAAN)',
    'Aeroporto 4 de Fevereiro, Luanda',
    'Sede PEPEK — Talatona',
    'Talatona — Hotéis e Centros Empresariais',
    'Miramar — Zona Diplomática',
    'Ilha de Luanda',
    'Maianga — Centro de Luanda',
    'Viana — Pólo Industrial',
    'Cacuaco',
    'Caxito — Bengo',
    'Huambo — Centro',
  ];

  const filteredLocations = (value: string) => locationSuggestions.filter((location) =>
    !value.trim() || location.toLocaleLowerCase('pt').includes(value.toLocaleLowerCase('pt'))
  ).slice(0, 6);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setCurrentSlide((current) => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (isLuxuryPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setCurrentLuxury((current) => (current + 1) % luxuryHeroVehicles.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [luxuryHeroVehicles.length, isLuxuryPaused]);

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

  const handleQuickAvailability = async (event: React.FormEvent) => {
    event.preventDefault();
    const vehicle = luxuryHeroVehicles[currentLuxury];
    setIsLuxuryPaused(true);
    setAvailabilityStatus('checking');
    const availability = await checkVehicleAvailability({ vehicle: vehicle.name, startDate, endDate });
    setAvailabilityStatus(availability.status);
    if (availability.status === 'unavailable') return;
    const params = new URLSearchParams({
      pickup,
      destination,
      startDate,
      endDate,
      viatura: vehicle.name,
    });
    navigate(`/reservar?${params.toString()}`);
  };

  const scrollToBooking = () => {
    const el = document.getElementById('reserva');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFleet = () => {
    const el = document.getElementById('frota');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative bg-[#001E4A] text-white pt-32 lg:pt-40 pb-16 overflow-hidden min-h-[92vh] flex flex-col justify-between select-none">
      {/* Cinematic Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0" data-future-video-stage aria-label="Área visual preparada para o futuro vídeo institucional">
        <img
          src={luxuryHeroVehicles[0]?.image}
          alt="Viatura oficial da frota executiva PEPEK"
          className="h-full w-full scale-[1.02] object-cover object-center brightness-[0.58] contrast-[1.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001E4A]/95 via-[#001E4A]/76 to-[#174B86]/44" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001E4A] via-transparent to-[#001E4A]/65" />
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#236199]/20 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="container-pepek relative z-10 flex-1 flex flex-col justify-center">
        {/* Vertical stories carousel: portrait videos remain visible in their native format. */}
        <div data-home-video-showcase className="group relative mb-7 w-full max-w-4xl overflow-hidden rounded-[26px] border border-white/15 bg-[#07182F]/95 p-4 shadow-[0_20px_55px_rgba(0,0,0,.28)] animate-fadeIn sm:p-5">
          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(220px,.72fr)_minmax(430px,1.28fr)] lg:gap-5">
            <div className="relative z-10 order-2 flex min-w-0 flex-col justify-between px-1 py-1 sm:px-2 sm:py-2 lg:order-1">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FEC228] sm:text-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{t('hero.videoStoriesLabel')} · {currentStory + 1}/{homepageStories.length}</span>
                </p>
                <h2 className="mt-3 max-w-lg text-lg font-extrabold leading-tight !text-white sm:text-2xl">
                  {homepageStories[currentStory].title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">{t('hero.tag')} · Luanda, Angola</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {homepageStories.map((story, index) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => selectStory(index)}
                    aria-label={`${t('hero.videoSelect')} ${index + 1}: ${story.title}`}
                    aria-current={currentStory === index ? 'true' : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentStory === index ? 'w-8 bg-[#FEC228]' : 'w-3 bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
                <button type="button" onClick={() => navigate(`/blogue#${homepageStories[currentStory].id}`)} className="ml-1 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-white/75 transition hover:text-[#FEC228]">
                  {t('hero.videoViewBlog')} <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              className="relative order-1 h-[300px] touch-pan-y select-none overflow-hidden rounded-[22px] border border-white/10 bg-[#001E4A]/70 p-2 sm:h-[360px] sm:p-3 lg:order-2 lg:h-[330px]"
              onPointerDown={(event) => { storyPointerStartX.current = event.clientX; }}
              onPointerUp={(event) => {
                if (storyPointerStartX.current === null) return;
                const distance = event.clientX - storyPointerStartX.current;
                storyPointerStartX.current = null;
                if (Math.abs(distance) > 42) changeStory(distance > 0 ? -1 : 1);
              }}
              onPointerCancel={() => { storyPointerStartX.current = null; }}
            >
              <div className="grid h-full grid-cols-[.32fr_1.68fr_.32fr] gap-2 sm:grid-cols-[.45fr_1.75fr_.45fr] sm:gap-3">
                {visibleStories.map(({ position, index }) => {
                  const story = homepageStories[index];
                  const isActive = position === 0;
                  return (
                    <button
                      key={`${position}-${story.id}`}
                      type="button"
                      onClick={() => isActive ? toggleStoryPlayback() : selectStory(index)}
                      className={`relative h-full min-w-0 overflow-hidden rounded-[16px] border text-left transition-all duration-500 ${isActive ? 'z-10 border-[#FEC228]/75 shadow-[0_14px_32px_rgba(0,0,0,.38)]' : 'scale-[.92] border-white/15 opacity-60 hover:scale-[.95] hover:opacity-90'}`}
                      aria-label={isActive ? (isStoryPlaying ? t('hero.videoPause') : t('hero.videoPlay')) : `${t('hero.videoSelect')} ${index + 1}: ${story.title}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <video
                        key={story.video}
                        ref={isActive ? storyVideoRef : undefined}
                        className="absolute inset-0 h-full w-full object-cover object-center"
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
                      <span className={`pointer-events-none absolute inset-0 ${isActive ? 'bg-gradient-to-t from-[#001E4A]/75 via-transparent to-black/10' : 'bg-[#001E4A]/20'}`} />
                      {isActive && (
                        <span className="pointer-events-none absolute inset-x-2 bottom-2 line-clamp-2 text-[10px] font-extrabold leading-tight text-white drop-shadow sm:inset-x-3 sm:bottom-3 sm:text-xs">
                          {story.title}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button type="button" onClick={() => changeStory(-1)} className="absolute left-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#001E4A]/90 text-white shadow-lg backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228] sm:left-4" aria-label={t('hero.videoPrevious')}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => changeStory(1)} className="absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#001E4A]/90 text-white shadow-lg backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228] sm:right-4" aria-label={t('hero.videoNext')}>
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-4 right-[calc(15%+10px)] z-20 flex gap-2 sm:right-[calc(18%+14px)]">
                <button type="button" onClick={toggleStoryPlayback} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#001E4A]/90 text-white shadow-lg backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228]" aria-label={isStoryPlaying ? t('hero.videoPause') : t('hero.videoPlay')}>
                  {isStoryPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => setIsStoryMuted((muted) => !muted)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#001E4A]/90 text-white shadow-lg backdrop-blur-md transition hover:border-[#FEC228] hover:text-[#FEC228]" aria-label={isStoryMuted ? t('hero.videoUnmute') : t('hero.videoMute')}>
                  {isStoryMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,500px)] xl:gap-12 2xl:grid-cols-[minmax(0,1.35fr)_520px]">
          <div>
        {/* Main Headline */}
        <div className="max-w-4xl mb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight font-inter">
            “{t('hero.title')}”
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 font-light mt-5 leading-relaxed max-w-4xl">
            {t('hero.description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
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

          <div className="flex items-center gap-3 pl-2 text-xs text-gray-300">
            <div className="h-2.5 w-2.5 rounded-full bg-[#236199] animate-pulse"></div>
            <span>{t('hero.trustFastSub')}</span>
          </div>
        </div>

          </div>

          <aside
            className="overflow-hidden rounded-[26px] border border-white/15 bg-white text-[#09172C] shadow-[0_28px_70px_rgba(9,23,44,.36)]"
            onMouseEnter={() => setIsLuxuryPaused(true)}
            onMouseLeave={() => setIsLuxuryPaused(false)}
            onFocusCapture={() => setIsLuxuryPaused(true)}
            onBlurCapture={() => setIsLuxuryPaused(false)}
          >
            <div className="relative min-h-[310px] overflow-hidden bg-[#20558D] bg-cover bg-center px-6 pt-5 sm:min-h-[350px] sm:px-7 sm:pt-6" style={{ backgroundColor: '#20558D', backgroundImage: `url('${FLEET_STUDIO_BACKGROUNDS.luxury}')` }}>
              <div className="relative z-20 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E4AD28]">{luxuryHeroVehicles[currentLuxury].segment}</span>
                  <h2 className="mt-1 max-w-[280px] text-xl font-extrabold text-white drop-shadow-md">{luxuryHeroVehicles[currentLuxury].name}</h2>
                  <p className="mt-1 text-sm font-extrabold text-[#FEC228]">{luxuryHeroVehicles[currentLuxury].price}<span className="ml-1 text-[10px] font-bold text-white/70">/ {t('fleet.perDay', { defaultValue: 'dia' })}</span></p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setCurrentLuxury((current) => (current - 1 + luxuryHeroVehicles.length) % luxuryHeroVehicles.length)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-[#09172C] hover:border-[#FEC228]" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setCurrentLuxury((current) => (current + 1) % luxuryHeroVehicles.length)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-[#09172C] hover:border-[#FEC228]" aria-label="Seguinte"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
              {luxuryHeroVehicles.map((vehicle, index) => (
                <img
                  key={vehicle.name}
                  src={vehicle.image}
                  alt={vehicle.name}
                  style={{ '--fleet-image-scale': vehicle.id === 'rangerover-blindado-2025' ? '1.16' : '0.96' } as React.CSSProperties}
                  className={`fleet-vehicle-image absolute bottom-[-8px] left-1/2 h-[260px] w-[100%] -translate-x-1/2 object-contain drop-shadow-[0_24px_24px_rgba(9,23,44,.38)] transition-all duration-700 sm:bottom-[-12px] sm:h-[300px] ${currentLuxury === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                />
              ))}
            </div>

            <form onSubmit={handleQuickAvailability} className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5 text-[#E4AD28]" />
                <h3 className="text-lg font-extrabold text-[#09172C]">{t('hero.quickTitle')}</h3>
              </div>
              <label className="relative block text-xs font-extrabold text-slate-700">
                <span className="mb-1.5 block">{t('hero.quickPickup')}</span>
                <span className="relative block">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input required autoComplete="off" value={pickup} onFocus={() => { setIsLuxuryPaused(true); setActiveLocationField('pickup'); }} onBlur={() => window.setTimeout(() => setActiveLocationField(null), 120)} onChange={(event) => { setPickup(event.target.value); setActiveLocationField('pickup'); }} placeholder={t('hero.quickPickupPlaceholder')} className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#FEC228]" />
                </span>
                {activeLocationField === 'pickup' && (
                  <span className="absolute left-0 right-0 top-full z-40 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl">
                    {filteredLocations(pickup).map((location) => <button key={location} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setPickup(location); setActiveLocationField(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F5F6F6]"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#E4AD28]" />{location}</button>)}
                  </span>
                )}
              </label>
              <label className="relative mt-3 block text-xs font-extrabold text-slate-700">
                <span className="mb-1.5 block">{t('hero.quickReturn')}</span>
                <span className="relative block">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input autoComplete="off" value={destination} onFocus={() => { setIsLuxuryPaused(true); setActiveLocationField('destination'); }} onBlur={() => window.setTimeout(() => setActiveLocationField(null), 120)} onChange={(event) => { setDestination(event.target.value); setActiveLocationField('destination'); }} placeholder={t('hero.quickReturnPlaceholder')} className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#FEC228]" />
                </span>
                {activeLocationField === 'destination' && (
                  <span className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl">
                    {filteredLocations(destination).map((location) => <button key={location} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setDestination(location); setActiveLocationField(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F5F6F6]"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#E4AD28]" />{location}</button>)}
                  </span>
                )}
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block text-xs font-extrabold text-slate-700"><span className="mb-1.5 block">{t('hero.quickPickupDate')}</span><span className="relative block"><input required min={today} type="date" value={startDate} onFocus={() => setIsLuxuryPaused(true)} onChange={(event) => { setStartDate(event.target.value); if (endDate && endDate < event.target.value) setEndDate(''); }} className="h-11 w-full rounded-lg border border-slate-300 px-2 pr-8 text-xs outline-none focus:border-[#FEC228]" /><CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E4AD28]" /></span></label>
                <label className="block text-xs font-extrabold text-slate-700"><span className="mb-1.5 block">{t('hero.quickReturnDate')}</span><span className="relative block"><input required min={startDate || today} type="date" value={endDate} onFocus={() => setIsLuxuryPaused(true)} onChange={(event) => setEndDate(event.target.value)} className="h-11 w-full rounded-lg border border-slate-300 px-2 pr-8 text-xs outline-none focus:border-[#FEC228]" /><CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E4AD28]" /></span></label>
              </div>
              {availabilityStatus === 'unavailable' && <p role="alert" className="mt-3 rounded-lg bg-[#FEC228] p-2 text-[11px] font-bold text-[#09172C]">Esta viatura já tem uma operação sobreposta nas datas indicadas. Escolha outro modelo ou fale com a equipa.</p>}
              {availabilityStatus === 'on_request' && <p role="status" className="mt-3 rounded-lg border border-[#236199]/20 bg-[#236199]/5 p-2 text-[11px] font-semibold text-[#09172C]">Pedido elegível para confirmação. A equipa valida a viatura física, motorista e condições operacionais antes de confirmar.</p>}
              <button type="submit" disabled={availabilityStatus === 'checking'} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FEC228] px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#09172C] transition hover:bg-[#FFD45F] disabled:opacity-60">
                {availabilityStatus === 'checking' ? 'A verificar…' : t('hero.quickSubmit')} <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </div>

        {/* Client logos use one continuous light stage so every official colourway
            remains legible without introducing individual logo cards. */}
        <div className="mt-6 rounded-2xl bg-white px-5 py-5 shadow-[0_18px_45px_rgba(4,16,38,0.24)] sm:px-8">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#236199]">
              <Sparkles className="h-3.5 w-3.5 text-[#E4AD28]" />
              <span>{t('clients.title')}</span>
            </p>
          </div>
          <div className="relative min-h-[120px] overflow-hidden">
            {slides.map((group, slideIndex) => (
              <div key={slideIndex} className={`grid grid-cols-2 items-center justify-items-center gap-6 transition-all duration-700 ease-out sm:grid-cols-3 sm:gap-10 md:grid-cols-5 ${currentSlide === slideIndex ? 'relative translate-x-0 opacity-100' : 'pointer-events-none absolute inset-0 translate-x-16 opacity-0'}`}>
                {group.map((client) => (
                  <div key={client.name} className="group flex h-24 w-full items-center justify-center p-3 sm:h-28">
                    <img src={client.src} alt={client.name} className="h-16 w-full max-w-[170px] object-contain drop-shadow-[0_4px_9px_rgba(9,23,44,.16)] transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:max-w-[200px]" loading="lazy" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
