import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Car } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Fleet } from '../components/sections/Fleet';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageFrota: React.FC<{ onSelectVehicle: (v: string) => void }> = ({ onSelectVehicle }) => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.frota.metaTitle')}</title>
        <meta name="description" content={t('pages.frota.metaDescription')} />
        <meta property="og:title" content={t('pages.frota.ogTitle')} />
        <meta property="og:description" content={t('pages.frota.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/frota" />
        <link rel="canonical" href="https://pepekgrupo.com/frota" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoRental",
          "name": t('pages.frota.schemaName'),
          "url": "https://pepekgrupo.com/frota",
          "description": t('pages.frota.schemaDescription')
        })}</script>
      </Helmet>

      <PageHero
        icon={Car}
        eyebrow={t('pages.frota.eyebrow')}
        title={t('pages.frota.title')}
        description={t('pages.frota.description')}
        breadcrumb={[{ label: t('nav.fleet') }]}
      />

      <Fleet onSelectVehicle={onSelectVehicle} />
      <BrandCTA />
    </>
  );
};
