import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PageNotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
  <section className="flex min-h-[75vh] items-center bg-[#06142F] px-6 pb-20 pt-40 text-white">
    <Helmet>
      <title>{t('notFound.metaTitle')} | PEPEK GRUPO</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-black uppercase tracking-[0.3em] text-[#D2A820]">{t('notFound.error')}</span>
      <h1 className="mt-5 text-4xl font-black text-white sm:text-6xl">{t('notFound.title')}</h1>
      <p className="mx-auto mt-5 max-w-xl text-slate-300">{t('notFound.description')}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-primary justify-center"><Home className="h-4 w-4" /> {t('notFound.home')}</Link>
        <Link to="/frota" className="btn-outline justify-center"><Search className="h-4 w-4" /> {t('notFound.fleet')}</Link>
      </div>
    </div>
  </section>
  );
};
