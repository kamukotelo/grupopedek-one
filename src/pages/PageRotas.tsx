import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Compass } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { RouteEstimator } from '../components/sections/RouteEstimator';
import { CoverageMap } from '../components/sections/CoverageMap';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageRotas: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.rotas.metaTitle')}</title>
        <meta name="description" content={t('pages.rotas.metaDescription')} />
        <meta property="og:title" content={t('pages.rotas.ogTitle')} />
        <meta property="og:description" content={t('pages.rotas.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/rotas" />
        <link rel="canonical" href="https://pepekgrupo.com/rotas" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: t('pages.rotas.schemaName'),
          provider: { '@type': 'LocalBusiness', name: 'PEPEK GRUPO RENT-A-CAR' },
          areaServed: { '@type': 'Country', name: 'Angola' },
          url: 'https://pepekgrupo.com/rotas',
        })}</script>
      </Helmet>

      <PageHero
        icon={Compass}
        eyebrow={t('pages.rotas.eyebrow')}
        title={t('pages.rotas.title')}
        description={t('pages.rotas.description')}
        breadcrumb={[{ label: t('nav.routes') }]}
      />

      <RouteEstimator />
      <CoverageMap />
      <BrandCTA />
    </>
  );
};
