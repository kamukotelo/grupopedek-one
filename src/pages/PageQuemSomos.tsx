import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { About } from '../components/sections/About';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageQuemSomos: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.quemSomos.metaTitle')}</title>
        <meta name="description" content={t('pages.quemSomos.metaDescription')} />
        <meta property="og:title" content={t('pages.quemSomos.ogTitle')} />
        <meta property="og:description" content={t('pages.quemSomos.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/quem-somos" />
        <link rel="canonical" href="https://pepekgrupo.com/quem-somos" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": t('pages.quemSomos.schemaName'),
          "url": "https://pepekgrupo.com/quem-somos"
        })}</script>
      </Helmet>

      {/* O About traz o seu próprio cabeçalho com <h1> — não usa o PageHero. */}
      <About />
      <PaymentSecurity />
      <BrandCTA />
    </>
  );
};
