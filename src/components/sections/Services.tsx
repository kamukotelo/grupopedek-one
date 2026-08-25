import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight, Gauge, Luggage, ShieldCheck, Users } from 'lucide-react';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { getVehicleStudioBackground } from '../../data/fleetPresentation';

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeVehicle = PUBLIC_FLEET[activeIndex];

  const selectVehicle = (index: number) => {
    const normalized = (index + PUBLIC_FLEET.length) % PUBLIC_FLEET.length;
    setActiveIndex(normalized);
    const rail = railRef.current;
    const card = rail?.children[normalized] as HTMLElement | undefined;
    if (rail && card) {
      rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => selectVehicle(activeIndex + 1), 7500);
    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused]);

  return (
    <section id="servicos" className="relative overflow-hidden bg-[#F5F6F6] py-20 sm:py-24">
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(11,69,216,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(11,69,216,.8) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute left-1/2 top-0 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-[#236199]/8 blur-[140px]" />

      <div className="container-pepek relative z-10">
        <div className="mb-12 max-w-4xl text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#236199]">{t('servicesCarousel.eyebrow')}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#09172C] sm:text-5xl">{t('servicesCarousel.title')}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555B64] sm:text-base">{t('servicesCarousel.description')}</p>
        </div>

        <div
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(9,23,44,.06)] sm:p-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E4AD28]">{t('servicesCarousel.officialFleet')}</span>
              <p className="mt-1 text-xs text-slate-500">{t('servicesCarousel.autoHint')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => selectVehicle(activeIndex - 1)} aria-label={t('servicesCarousel.previous')} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-[#09172C] transition hover:border-[#FEC228]"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => selectVehicle(activeIndex + 1)} aria-label={t('servicesCarousel.next')} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-[#09172C] transition hover:border-[#FEC228]"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>

          <div ref={railRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PUBLIC_FLEET.map((vehicle, index) => {
              const selected = index === activeIndex;
              return (
                <button key={vehicle.id} type="button" onClick={() => selectVehicle(index)} className={`group min-w-[190px] snap-center overflow-hidden rounded-xl border text-left transition-all sm:min-w-[230px] ${selected ? 'border-[#FEC228] bg-white shadow-[0_10px_28px_rgba(9,23,44,.12)]' : 'border-slate-200 bg-[#F5F6F6] hover:border-[#236199]/40'}`}>
                  <div className="h-36 bg-cover bg-center p-4" style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}>
                    <img src={vehicle.primaryImage} alt={vehicle.name} loading="lazy" decoding="async" className="h-full w-full object-contain drop-shadow-[0_18px_16px_rgba(7,19,63,.22)] transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="px-4 py-3 text-[#09172C]">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${selected ? 'text-[#E4AD28]' : 'text-[#236199]'}`}>{vehicle.categoryLabel}</span>
                    <strong className="mt-1 block truncate text-sm">{vehicle.name}</strong>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid overflow-hidden rounded-2xl border border-white/10 bg-[#0C2E60] lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[300px] bg-cover bg-center p-8 sm:p-10" style={{ backgroundImage: `url('${getVehicleStudioBackground(activeVehicle)}')` }}>
              <img key={activeVehicle.id} src={activeVehicle.primaryImage} alt={activeVehicle.name} decoding="async" className="h-full max-h-[380px] w-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,.45)] animate-fadeIn" />
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 p-7 lg:border-l lg:border-t-0 lg:p-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FEC228]">{activeVehicle.categoryLabel}</span>
              <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{activeVehicle.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{activeVehicle.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-200">
                <span className="flex items-center gap-2 rounded-xl bg-white/5 p-3"><Users className="h-4 w-4 text-[#FEC228]" />{activeVehicle.specs.passengers} {t('servicesCarousel.passengers')}</span>
                <span className="flex items-center gap-2 rounded-xl bg-white/5 p-3"><Luggage className="h-4 w-4 text-[#FEC228]" />{activeVehicle.specs.luggage} {t('servicesCarousel.luggage')}</span>
                <span className="flex items-center gap-2 rounded-xl bg-white/5 p-3"><Gauge className="h-4 w-4 text-[#FEC228]" />{activeVehicle.specs.transmission}</span>
                <span className="flex items-center gap-2 rounded-xl bg-white/5 p-3"><ShieldCheck className="h-4 w-4 text-[#FEC228]" />{activeVehicle.availabilityTag || t('servicesCarousel.onRequest')}</span>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate(`/frota?categoria=${activeVehicle.category}`)} className="btn-primary justify-center text-xs">{t('servicesCarousel.viewCategory')} <ArrowRight className="h-4 w-4" /></button>
                <button type="button" onClick={() => navigate(`/reservar?viatura=${activeVehicle.slug}`)} className="btn-outline justify-center text-xs">{t('servicesCarousel.requestVehicle')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
