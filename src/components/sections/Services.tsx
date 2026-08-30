import React from 'react';
import { useTranslation } from 'react-i18next';
import { BriefcaseBusiness, Building2, CalendarCheck, CircleGauge, Plane, ShieldCheck } from 'lucide-react';

export const Services: React.FC = () => {
  const { t } = useTranslation();
  const serviceItems = [
    ['services.transferTitle', 'services.transferDesc', Plane, 'group-hover:-translate-y-2 group-hover:translate-x-2'],
    ['services.executiveTitle', 'services.executiveDesc', BriefcaseBusiness, 'group-hover:-translate-y-2'],
    ['services.corporateTitle', 'services.corporateDesc', Building2, 'group-hover:scale-110'],
    ['services.eventsTitle', 'services.eventsDesc', CalendarCheck, 'group-hover:-translate-y-1 group-hover:rotate-6'],
    ['services.chauffeurTitle', 'services.chauffeurDesc', CircleGauge, 'group-hover:rotate-12'],
    ['services.securityTitle', 'services.securityDesc', ShieldCheck, 'group-hover:scale-110'],
  ] as const;

  return (
    <section id="servicos" className="relative overflow-hidden bg-[#F5F6F6] py-20 sm:py-24">
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(35,97,153,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(35,97,153,.8) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute left-1/2 top-0 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-[#236199]/8 blur-[140px]" />

      <div className="container-pepek relative z-10">
        <div className="mb-12 max-w-4xl text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#236199]">{t('servicesCarousel.eyebrow')}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#09172C] sm:text-5xl">{t('servicesCarousel.title')}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555B64] sm:text-base">{t('servicesCarousel.description')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {serviceItems.map(([title, description, Icon, motion], index) => (
            <article key={title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-7 text-center shadow-[0_10px_28px_rgba(9,23,44,.05)] transition duration-300 hover:-translate-y-2 hover:border-[#FEC228] hover:shadow-[0_20px_38px_rgba(9,23,44,.12)]">
              <span className="absolute right-3 top-2 text-[10px] font-extrabold text-[#236199]/25">0{index + 1}</span>
              <div className="mx-auto flex h-20 items-center justify-center text-[#FEC228]">
                <Icon className={`h-14 w-14 stroke-[1.7] transition-transform duration-500 ${motion}`} />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-[#09172C]">{t(title)}</h3>
              <p className="mt-3 text-xs leading-5 text-[#555B64]">{t(description)}</p>
              <span className="mx-auto mt-5 block h-0.5 w-0 bg-[#FEC228] transition-all duration-500 group-hover:w-12" />
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
