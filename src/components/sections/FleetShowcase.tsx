import React, { useEffect, useMemo, useState } from 'react';
import { Armchair, ArrowRight, ChevronLeft, ChevronRight, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { getFleetImageOffsetY, getFleetImageScale, getVehicleStudioBackground } from '../../data/fleetPresentation';

const FEATURED_IDS = ['range-rover', 'toyota-fortuner-2023', 'hyundai-staria-atual', 'toyota-hilux'];
const FEATURED_LABELS: Record<string, string> = {
  'range-rover': 'Premium',
  'toyota-fortuner-2023': 'SUV',
  'hyundai-staria-atual': 'Van',
  'toyota-hilux': 'Pickup',
};

const formatPrice = (value: number) => new Intl.NumberFormat('pt-PT', {
  maximumFractionDigits: 0,
}).format(value);

export const FleetShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);

  const vehicles = useMemo(() => FEATURED_IDS
    .map((id) => PUBLIC_FLEET.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is NonNullable<typeof vehicle> => Boolean(vehicle)), []);

  const orderedVehicles = useMemo(() => vehicles.map((_, index) => (
    vehicles[(index + offset) % vehicles.length]
  )), [vehicles, offset]);

  useEffect(() => {
    if (paused || vehicles.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setOffset((current) => (current + 1) % vehicles.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, vehicles.length]);

  const move = (direction: number) => setOffset((current) => (
    current + direction + vehicles.length
  ) % vehicles.length);

  return (
    <section
      id="frota-destaque"
      className="relative overflow-hidden bg-[#001E4A] py-16 text-white sm:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(35,97,153,.85) 1px, transparent 1.4px)', backgroundSize: '22px 22px' }} />
      <div className="container-pepek relative">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#FEC228]">{t('fleet.showcaseTag')}</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('fleet.showcaseTitle')}</h2>
          </div>
          <Link to="/frota" className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#FEC228] transition hover:text-white sm:flex">
            {t('fleet.showcaseAll')} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="relative px-0 lg:px-12">
          <button type="button" onClick={() => move(-1)} aria-label={t('fleet.previous')} className="absolute -left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-[#236199] bg-[#09172C] text-white transition hover:border-[#FEC228] hover:text-[#FEC228] lg:grid">
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderedVehicles.map((vehicle) => (
              <Link key={vehicle.id} to="/frota" className="group flex min-h-[410px] flex-col overflow-hidden rounded-[24px] border border-[#3A72A8] bg-[#20558D] transition duration-300 hover:-translate-y-1 hover:border-[#FEC228] hover:shadow-[0_20px_38px_rgba(9,23,44,.28)]">
                <div className="flex h-52 items-center justify-center border-b border-white/10 bg-cover bg-center p-5" style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}>
                  <img src={vehicle.primaryImage} alt={vehicle.name} loading="lazy" style={{ '--fleet-image-scale': getFleetImageScale(vehicle.id), '--fleet-image-offset-y': getFleetImageOffsetY(vehicle.id) } as React.CSSProperties} className="fleet-vehicle-image h-full w-full object-contain drop-shadow-[0_18px_20px_rgba(9,23,44,.45)]" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-extrabold text-white">{vehicle.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded bg-[#FEC228] px-3 py-1 text-[9px] font-bold uppercase text-[#09172C]">{FEATURED_LABELS[vehicle.id]}</span>
                  <span className="rounded border border-white px-3 py-1 text-[9px] font-bold uppercase text-white">{t('fleet.automatic')}</span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-white/85">
                  <span className="flex items-center gap-2"><Armchair className="h-4 w-4 text-[#FEC228]" />{vehicle.specs.passengers} {t('fleet.seats')}</span>
                  <span className="flex items-center gap-2"><Gauge className="h-4 w-4 text-[#FEC228]" />{vehicle.specs.fuelType}</span>
                </div>
                <div className="mt-auto border-t border-white/45 pt-4">
                  <span className="block text-[11px] text-white/75">{t('fleet.from')}</span>
                  <strong className="mt-1 block text-xl font-extrabold text-[#FEC228]">{formatPrice(vehicle.pricePerDayAOA)} Kz / {t('fleet.day')}</strong>
                </div>
                </div>
              </Link>
            ))}
          </div>

          <button type="button" onClick={() => move(1)} aria-label={t('fleet.next')} className="absolute -right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-[#236199] bg-[#09172C] text-white transition hover:border-[#FEC228] hover:text-[#FEC228] lg:grid">
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between lg:hidden">
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} aria-label={t('fleet.previous')} className="grid h-11 w-11 place-items-center rounded-full border border-[#236199] bg-[#09172C]"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => move(1)} aria-label={t('fleet.next')} className="grid h-11 w-11 place-items-center rounded-full border border-[#236199] bg-[#09172C]"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <Link to="/frota" className="flex items-center gap-2 text-xs font-bold uppercase text-[#FEC228]">{t('fleet.showcaseAll')} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
};
