import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, ChevronLeft, Clock, Car, CalendarDays, MapPin, UserCheck } from 'lucide-react';
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
    <section id="inicio" className="relative flex min-h-[92vh] select-none flex-col justify-between overflow-hidden bg-[#0C2E60] pb-0 pt-28 text-white lg:pt-32">
      {/* Cinematic Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2400&q=85"
          alt="PEPEK Frota Executiva Luanda"
          className="h-full w-full scale-105 object-cover object-center brightness-[.58] contrast-[1.08] saturate-[.8]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,23,44,.97)_0%,rgba(12,46,96,.88)_47%,rgba(12,46,96,.6)_100%)]" />
      </div>

      <div className="container-pepek relative z-10 flex flex-1 flex-col justify-center pb-8">
        {/* Top Tag */}
        <div className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-white/90">
          <ShieldCheck className="h-4 w-4 text-[#FEC228]" />
          <span>{t('hero.tag')} · Luanda, Angola</span>
        </div>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,500px)] xl:gap-12 2xl:grid-cols-[minmax(0,1.35fr)_520px]">
          <div>
        {/* Main Headline */}
        <div className="max-w-4xl mb-6">
          <h1 className="max-w-3xl text-4xl font-extrabold uppercase leading-[1.04] tracking-[-.035em] text-white sm:text-6xl lg:text-7xl">
            {t('hero.visualLead')} <span className="text-[#FEC228]">{t('hero.visualAccent')}</span> {t('hero.visualTail')}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/75 sm:text-lg">
            {t('hero.description')}
          </p>
        </div>

        {/* 3 Key Pillars of Trust (Frameless with soft futuristic aura) */}
        {/* Action Buttons with Futuristic Hover Glow */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button
            type="button"
            onClick={scrollToBooking}
            className="btn-primary group relative flex cursor-pointer items-center gap-2.5 overflow-hidden px-7 py-4 text-xs font-extrabold uppercase"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <Car className="w-5 h-5" />
            <span>{t('hero.ctaBooking')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={scrollToFleet}
            className="btn-outline flex cursor-pointer items-center gap-2 px-7 py-4 text-xs font-extrabold uppercase"
          >
            <span>{t('hero.ctaFleet')}</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-300 pl-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>{t('hero.trustFastSub')}</span>
          </div>
        </div>
          </div>

          <aside
            className="overflow-hidden rounded-2xl border border-white/15 bg-white text-[#09172C] shadow-[0_24px_60px_rgba(0,0,0,.28)]"
            onMouseEnter={() => setIsLuxuryPaused(true)}
            onMouseLeave={() => setIsLuxuryPaused(false)}
            onFocusCapture={() => setIsLuxuryPaused(true)}
            onBlurCapture={() => setIsLuxuryPaused(false)}
          >
            <div className="relative min-h-[300px] overflow-hidden bg-[#0C2E60] bg-cover bg-center px-6 pt-5 sm:min-h-[340px] sm:px-7 sm:pt-6" style={{ backgroundImage: `url('${FLEET_STUDIO_BACKGROUNDS.luxury}')` }}>
              <div className="relative z-20 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FEC228]">{t('fleet.tag')}</span>
                  <h2 className="mt-1 max-w-[280px] text-xl font-black text-white drop-shadow-md">{luxuryVehicles[currentLuxury].name}</h2>
                  <p className="mt-1 text-sm font-extrabold text-[#FEC228]">{luxuryVehicles[currentLuxury].price}<span className="ml-1 text-[10px] font-bold text-white/70">/ {t('fleet.perDay', { defaultValue: 'dia' })}</span></p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setCurrentLuxury((current) => (current - 1 + luxuryVehicles.length) % luxuryVehicles.length)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 bg-white text-[#09172C] hover:border-[#FEC228]" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setCurrentLuxury((current) => (current + 1) % luxuryVehicles.length)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 bg-white text-[#09172C] hover:border-[#FEC228]" aria-label="Seguinte"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
              {luxuryVehicles.map((vehicle, index) => (
                <img
                  key={vehicle.name}
                  src={vehicle.image}
                  alt={vehicle.name}
                  className={`absolute bottom-[-18px] left-1/2 h-[280px] w-[112%] -translate-x-1/2 object-contain drop-shadow-[0_24px_24px_rgba(7,19,63,.38)] transition-all duration-700 sm:bottom-[-22px] sm:h-[325px] ${currentLuxury === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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
                  <input required autoComplete="off" value={pickup} onFocus={() => { setIsLuxuryPaused(true); setActiveLocationField('pickup'); }} onBlur={() => window.setTimeout(() => setActiveLocationField(null), 120)} onChange={(event) => { setPickup(event.target.value); setActiveLocationField('pickup'); }} placeholder={t('hero.quickPickupPlaceholder')} className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#D2A820]" />
                </span>
                {activeLocationField === 'pickup' && (
                  <span className="absolute left-0 right-0 top-full z-40 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl">
                    {filteredLocations(pickup).map((location) => <button key={location} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setPickup(location); setActiveLocationField(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F3F5F8]"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#B68D13]" />{location}</button>)}
                  </span>
                )}
              </label>
              <label className="relative mt-3 block text-xs font-extrabold text-slate-700">
                <span className="mb-1.5 block">{t('hero.quickReturn')}</span>
                <span className="relative block">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input autoComplete="off" value={destination} onFocus={() => { setIsLuxuryPaused(true); setActiveLocationField('destination'); }} onBlur={() => window.setTimeout(() => setActiveLocationField(null), 120)} onChange={(event) => { setDestination(event.target.value); setActiveLocationField('destination'); }} placeholder={t('hero.quickReturnPlaceholder')} className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#D2A820]" />
                </span>
                {activeLocationField === 'destination' && (
                  <span className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl">
                    {filteredLocations(destination).map((location) => <button key={location} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setDestination(location); setActiveLocationField(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F3F5F8]"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#B68D13]" />{location}</button>)}
                  </span>
                )}
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block text-xs font-extrabold text-slate-700"><span className="mb-1.5 block">{t('hero.quickPickupDate')}</span><span className="relative block"><input required min={today} type="date" value={startDate} onFocus={() => setIsLuxuryPaused(true)} onChange={(event) => { setStartDate(event.target.value); if (endDate && endDate < event.target.value) setEndDate(''); }} className="h-11 w-full rounded-lg border border-slate-300 px-2 pr-8 text-xs outline-none focus:border-[#D2A820]" /><CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B68D13]" /></span></label>
                <label className="block text-xs font-extrabold text-slate-700"><span className="mb-1.5 block">{t('hero.quickReturnDate')}</span><span className="relative block"><input required min={startDate || today} type="date" value={endDate} onFocus={() => setIsLuxuryPaused(true)} onChange={(event) => setEndDate(event.target.value)} className="h-11 w-full rounded-lg border border-slate-300 px-2 pr-8 text-xs outline-none focus:border-[#D2A820]" /><CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B68D13]" /></span></label>
              </div>
              {availabilityStatus === 'unavailable' && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-2 text-[11px] font-bold text-red-700">Esta viatura já tem uma operação sobreposta nas datas indicadas. Escolha outro modelo ou fale com a equipa.</p>}
              <button type="submit" disabled={availabilityStatus === 'checking'} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FEC228] px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#09172C] transition hover:bg-[#FFD45F] disabled:opacity-60">
                {availabilityStatus === 'checking' ? 'A verificar…' : t('hero.quickSubmit')} <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </div>

      </div>
      <div className="relative z-10 mt-4 border-t border-white/10 bg-[#09172C]/92">
        <div className="container-pepek grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Clock, t('nav.support247'), t('hero.statAssistanceSub')],
            [Car, t('hero.trustPremium'), t('hero.trustPremiumSub')],
            [UserCheck, t('hero.visualDrivers'), t('hero.visualDriversSub')],
            [MapPin, t('hero.statCoverage'), t('hero.statCoverageSub')],
          ].map(([Icon, title, description], index) => {
            const TrustIcon = Icon as typeof Clock;
            return <div key={index} className="flex min-h-24 items-center gap-4 border-white/10 px-5 py-5 sm:border-r"><TrustIcon className="h-8 w-8 shrink-0 text-[#FEC228]" /><div><strong className="block text-xs font-extrabold uppercase text-white">{title as string}</strong><span className="mt-1 block text-[11px] leading-4 text-white/60">{description as string}</span></div></div>;
          })}
        </div>
      </div>
    </section>
  );
};
