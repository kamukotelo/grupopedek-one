import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { checkVehicleAvailability } from '../../lib/reservations';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { FLEET_STUDIO_BACKGROUNDS } from '../../data/fleetPresentation';

export const QuickReservation: React.FC = () => {
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

  const [currentLuxury, setCurrentLuxury] = useState(0);
  const [isLuxuryPaused, setIsLuxuryPaused] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'on_request' | 'unavailable' | 'unknown'>('idle');
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

  const filteredLocations = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return locationSuggestions;
    return locationSuggestions.filter((location) => location.toLowerCase().includes(q));
  };

  // Ciclo automático da viatura em destaque a cada 5 segundos
  useEffect(() => {
    if (isLuxuryPaused || luxuryHeroVehicles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentLuxury((prev) => (prev + 1) % luxuryHeroVehicles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isLuxuryPaused, luxuryHeroVehicles.length]);

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

  return (
    <section id="reserva" className="relative select-none overflow-hidden bg-[#00193F] py-16 text-white sm:py-20 border-t border-white/10">
      {/* Background glow visual */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#236199]/15 blur-[160px]" />

      <div className="container-pepek relative z-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FEC228]/30 bg-white/5 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FEC228] backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FEC228]" />
            {t('hero.quickTitle', { defaultValue: 'Reserva Rápida' })}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            Simulador de Reserva Imediata
          </h2>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">
            Consulte a disponibilidade da frota oficial e assegure a sua viatura protocolar em poucos minutos.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl items-stretch gap-0 overflow-hidden rounded-[26px] border border-white/15 bg-white text-[#09172C] shadow-[0_28px_70px_rgba(9,23,44,.36)] lg:grid-cols-[1.1fr_1fr]">
          {/* Lado Esquerdo: Mostra da Viatura Oficial em Destaque */}
          <div
            className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-[#20558D] bg-cover bg-center p-6 sm:min-h-[400px] sm:p-8"
            style={{ backgroundColor: '#20558D', backgroundImage: `url('${FLEET_STUDIO_BACKGROUNDS.luxury}')` }}
            onMouseEnter={() => setIsLuxuryPaused(true)}
            onMouseLeave={() => setIsLuxuryPaused(false)}
          >
            <div className="relative z-20 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E4AD28]">
                  {luxuryHeroVehicles[currentLuxury]?.segment}
                </span>
                <h3 className="mt-1 max-w-[280px] text-xl font-extrabold text-white drop-shadow-md sm:text-2xl">
                  {luxuryHeroVehicles[currentLuxury]?.name}
                </h3>
                <p className="mt-1 text-sm font-extrabold text-[#FEC228] sm:text-base">
                  {luxuryHeroVehicles[currentLuxury]?.price}
                  <span className="ml-1 text-[11px] font-bold text-white/70">
                    / {t('fleet.perDay', { defaultValue: 'dia' })}
                  </span>
                </p>
              </div>

              {/* Botões de navegação das viaturas */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentLuxury((current) => (current - 1 + luxuryHeroVehicles.length) % luxuryHeroVehicles.length)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 bg-white/95 text-[#09172C] shadow transition hover:border-[#FEC228] hover:bg-[#FEC228]"
                  aria-label="Viatura anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLuxury((current) => (current + 1) % luxuryHeroVehicles.length)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 bg-white/95 text-[#09172C] shadow transition hover:border-[#FEC228] hover:bg-[#FEC228]"
                  aria-label="Viatura seguinte"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Imagem da Viatura com Transição Suave */}
            <div className="relative z-10 flex flex-1 items-end justify-center py-4">
              {luxuryHeroVehicles.map((vehicle, index) => (
                <img
                  key={vehicle.name}
                  src={vehicle.image}
                  alt={vehicle.name}
                  style={{ '--fleet-image-scale': vehicle.id === 'rangerover-blindado-2025' ? '1.16' : '0.96' } as React.CSSProperties}
                  className={`fleet-vehicle-image absolute bottom-0 left-1/2 h-[260px] w-full max-w-[420px] -translate-x-1/2 object-contain drop-shadow-[0_24px_24px_rgba(9,23,44,.45)] transition-all duration-700 sm:h-[300px] ${
                    currentLuxury === index ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
                  }`}
                />
              ))}
            </div>

            <div className="relative z-20 flex items-center justify-between text-[11px] font-semibold text-white/80">
              <span>{currentLuxury + 1} de {luxuryHeroVehicles.length} viaturas VIP</span>
              <span className="flex items-center gap-1.5 text-[#FEC228]">
                <ShieldCheck className="h-3.5 w-3.5" /> Frota Oficial PEPEK
              </span>
            </div>
          </div>

          {/* Lado Direito: Formulário de Reserva Rápida */}
          <form onSubmit={handleQuickAvailability} className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5 text-[#E4AD28]" />
                <h3 className="text-lg font-extrabold text-[#09172C]">
                  {t('hero.quickTitle', { defaultValue: 'Reserva Rápida' })}
                </h3>
              </div>

              {/* Local de Recolha */}
              <label className="relative block text-xs font-extrabold text-slate-700">
                <span className="mb-1.5 block">{t('hero.quickPickup')}</span>
                <span className="relative block">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    autoComplete="off"
                    value={pickup}
                    onFocus={() => { setIsLuxuryPaused(true); setActiveLocationField('pickup'); }}
                    onBlur={() => window.setTimeout(() => setActiveLocationField(null), 150)}
                    onChange={(event) => { setPickup(event.target.value); setActiveLocationField('pickup'); }}
                    placeholder={t('hero.quickPickupPlaceholder')}
                    className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none transition focus:border-[#FEC228]"
                  />
                </span>
                {activeLocationField === 'pickup' && (
                  <span className="absolute left-0 right-0 top-full z-40 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl">
                    {filteredLocations(pickup).map((location) => (
                      <button
                        key={location}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => { setPickup(location); setActiveLocationField(null); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F5F6F6]"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E4AD28]" />
                        {location}
                      </button>
                    ))}
                  </span>
                )}
              </label>

              {/* Local de Retorno */}
              <label className="relative mt-3 block text-xs font-extrabold text-slate-700">
                <span className="mb-1.5 block">{t('hero.quickReturn')}</span>
                <span className="relative block">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    autoComplete="off"
                    value={destination}
                    onFocus={() => { setIsLuxuryPaused(true); setActiveLocationField('destination'); }}
                    onBlur={() => window.setTimeout(() => setActiveLocationField(null), 150)}
                    onChange={(event) => { setDestination(event.target.value); setActiveLocationField('destination'); }}
                    placeholder={t('hero.quickReturnPlaceholder')}
                    className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none transition focus:border-[#FEC228]"
                  />
                </span>
                {activeLocationField === 'destination' && (
                  <span className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl">
                    {filteredLocations(destination).map((location) => (
                      <button
                        key={location}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => { setDestination(location); setActiveLocationField(null); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F5F6F6]"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E4AD28]" />
                        {location}
                      </button>
                    ))}
                  </span>
                )}
              </label>

              {/* Datas de Início e Fim */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block text-xs font-extrabold text-slate-700">
                  <span className="mb-1.5 block">{t('hero.quickPickupDate')}</span>
                  <span className="relative block">
                    <input
                      required
                      min={today}
                      type="date"
                      value={startDate}
                      onFocus={() => setIsLuxuryPaused(true)}
                      onChange={(event) => {
                        setStartDate(event.target.value);
                        if (endDate && endDate < event.target.value) setEndDate('');
                      }}
                      className="h-11 w-full rounded-lg border border-slate-300 px-2 pr-8 text-xs outline-none transition focus:border-[#FEC228]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E4AD28]" />
                  </span>
                </label>
                <label className="block text-xs font-extrabold text-slate-700">
                  <span className="mb-1.5 block">{t('hero.quickReturnDate')}</span>
                  <span className="relative block">
                    <input
                      required
                      min={startDate || today}
                      type="date"
                      value={endDate}
                      onFocus={() => setIsLuxuryPaused(true)}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-300 px-2 pr-8 text-xs outline-none transition focus:border-[#FEC228]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E4AD28]" />
                  </span>
                </label>
              </div>

              {availabilityStatus === 'unavailable' && (
                <p role="alert" className="mt-3 rounded-lg bg-[#FEC228] p-2.5 text-[11px] font-bold text-[#09172C]">
                  Esta viatura já tem uma operação sobreposta nas datas indicadas. Escolha outro modelo ou fale com a equipa.
                </p>
              )}
              {availabilityStatus === 'on_request' && (
                <p role="status" className="mt-3 rounded-lg border border-[#236199]/20 bg-[#236199]/5 p-2.5 text-[11px] font-semibold text-[#09172C]">
                  Pedido elegível para confirmação. A equipa valida a viatura física, motorista e condições operacionais antes de confirmar.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={availabilityStatus === 'checking'}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FEC228] px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#09172C] shadow transition hover:bg-[#FFD45F] disabled:opacity-60"
            >
              {availabilityStatus === 'checking' ? 'A verificar…' : t('hero.quickSubmit')} <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
