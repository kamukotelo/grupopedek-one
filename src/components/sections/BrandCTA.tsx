import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const BrandCTA: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <section className="bg-[#09172C] py-12 text-white sm:py-16">
      <div className="container-pepek flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-[#FEC228]">{t('hero.tag')}</span>
          <h2 className="mt-3 max-w-3xl text-2xl font-extrabold uppercase leading-tight text-white sm:text-4xl">{t('brandCta.title')}</h2>
          <p className="mt-3 text-sm text-white/65">{t('brandCta.subtitle')}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href="tel:+244923000072" className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 text-xs font-bold"><Phone className="h-4 w-4 text-[#FEC228]" />+244 923 000 072</a>
          <button type="button" onClick={() => navigate('/reservar')} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FEC228] px-6 text-xs font-extrabold uppercase text-[#09172C]">{t('hero.ctaBooking')}<ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
};
