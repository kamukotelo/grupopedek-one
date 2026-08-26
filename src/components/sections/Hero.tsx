import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, ChevronLeft, Award, Building2, Clock, Car, CalendarDays, MapPin } from 'lucide-react';
import { checkVehicleAvailability } from '../../lib/reservations';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { FLEET_STUDIO_BACKGROUNDS } from '../../data/fleetPresentation';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const luxuryVehicles = PUBLIC_FLEET
    .filter((vehicle) => ['rangerover-blindado-2025', 'mercedes-class-s-2025', 'lexus-600', 'toyota-lc300-2023'].includes(vehicle.id))
    .map((vehicle) => ({ name: vehicle.name, image: vehicle.primaryImage, price: vehicle.pricePerDayFormatted }));

  const [currentLuxury, setCurrentLuxury] = useState(0);
  const [isLuxuryPaused, setIsLuxuryPaused] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'unknown'>('idle');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'destination' | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const today = new Date().toISOString().split('T')[0];
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
    if (isLuxuryPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setCurrentLuxury((current) => (current + 1) % luxuryVehicles.length);
    }, 7500);
    return () => window.clearInterval(timer);
  }, [luxuryVehicles.length, isLuxuryPaused]);

  const handleQuickAvailability = async (event: React.FormEvent) => {
    event.preventDefault();
    const vehicle = luxuryVehicles[currentLuxury];
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
    <section id="inicio" className="relative bg-[#09172C] text-white pt-32 lg:pt-40 pb-16 overflow-hidden min-h-[92vh] flex flex-col justify-between select-none">
      {/* Cinematic Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2400&q=85"
          alt="PEPEK Frota Executiva Luanda"
          className="w-full h-full object-cover object-center filter brightness-[0.24] contrast-[1.25] scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09172C] via-[#09172C]/75 to-[#09172C]/90" />
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#236199]/20 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="container-pepek relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-[#8899BB] uppercase tracking-[0.2em] mb-6 w-fit animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-[#236199]" />
          <span>{t('hero.tag')} · Luanda, Angola</span>
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

        {/* 3 Key Pillars of Trust (Frameless with soft futuristic aura) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mb-10 text-xs sm:text-sm font-semibold text-gray-200">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] backdrop-blur-xs hover:bg-white/[0.08] transition-all duration-300">
            <Building2 className="w-5 h-5 text-[#236199] shrink-0" />
            <span>{t('hero.trustPremium')}</span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] backdrop-blur-xs hover:bg-white/[0.08] transition-all duration-300">
            <Award className="w-5 h-5 text-[#236199] shrink-0" />
            <span>{t('hero.trustService')}</span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] backdrop-blur-xs hover:bg-white/[0.08] transition-all duration-300">
            <Clock className="w-5 h-5 text-[#236199] shrink-0" />
            <span>{t('nav.support247')} · {t('hero.statCoverageSub')}</span>
          </div>
        </div>

        {/* Action Buttons with Futuristic Hover Glow */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
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

          <div className="flex items-center gap-3 text-xs text-gray-300 pl-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#236199] animate-pulse"></div>
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
            <div className="relative min-h-[310px] overflow-hidden bg-[#09172C] bg-cover bg-center px-6 pt-5 sm:min-h-[350px] sm:px-7 sm:pt-6" style={{ backgroundImage: `url('${FLEET_STUDIO_BACKGROUNDS.luxury}')` }}>
              <div className="relative z-20 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E4AD28]">{t('fleet.tag')}</span>
                  <h2 className="mt-1 max-w-[280px] text-xl font-extrabold text-white drop-shadow-md">{luxuryVehicles[currentLuxury].name}</h2>
                  <p className="mt-1 text-sm font-extrabold text-[#FEC228]">{luxuryVehicles[currentLuxury].price}<span className="ml-1 text-[10px] font-bold text-white/70">/ {t('fleet.perDay', { defaultValue: 'dia' })}</span></p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setCurrentLuxury((current) => (current - 1 + luxuryVehicles.length) % luxuryVehicles.length)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-[#09172C] hover:border-[#FEC228]" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setCurrentLuxury((current) => (current + 1) % luxuryVehicles.length)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-[#09172C] hover:border-[#FEC228]" aria-label="Seguinte"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
              {luxuryVehicles.map((vehicle, index) => (
                <img
                  key={vehicle.name}
                  src={vehicle.image}
                  alt={vehicle.name}
                  className={`absolute bottom-[-18px] left-1/2 h-[280px] w-[112%] -translate-x-1/2 object-contain drop-shadow-[0_24px_24px_rgba(9,23,44,.38)] transition-all duration-700 sm:bottom-[-22px] sm:h-[325px] ${currentLuxury === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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
              {availabilityStatus === 'unavailable' && <p role="alert" className="mt-3 rounded-lg bg-[#FEC228] p-2 text-[11px] font-bold text-[#E4AD28]">Esta viatura já tem uma operação sobreposta nas datas indicadas. Escolha outro modelo ou fale com a equipa.</p>}
              <button type="submit" disabled={availabilityStatus === 'checking'} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FEC228] px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#09172C] transition hover:bg-[#FFD45F] disabled:opacity-60">
                {availabilityStatus === 'checking' ? 'A verificar…' : t('hero.quickSubmit')} <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </div>

        {/* ═══════════════════════════════════════════════════════
            TOP CLIENT LOGOS — Frameless, Prominent, 5 by 5
            No Heavy Box Outlines · Pure White Glow & Scale Hover
           ═══════════════════════════════════════════════════════ */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <img
              src="/clients-original/client-strip-original.png"
              alt={t('clients.title')}
              className="h-auto min-w-[920px] object-contain sm:min-w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
