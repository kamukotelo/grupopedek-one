import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Phone } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Contact } from '../components/sections/Contact';

export const PageContactos: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.contactos.metaTitle')}</title>
        <meta name="description" content={t('pages.contactos.metaDescription')} />
        <meta property="og:title" content={t('pages.contactos.ogTitle')} />
        <meta property="og:description" content={t('pages.contactos.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/contactos" />
        <link rel="canonical" href="https://pepekgrupo.com/contactos" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: 'https://pepekgrupo.com/contactos',
          mainEntity: {
            '@type': 'Organization',
            name: 'PEPEK GRUPO RENT-A-CAR',
            telephone: '+244923719090',
            email: 'geral@pepekgrupo.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Rua Reino do Bailundo',
              addressLocality: 'Talatona, Luanda',
              addressCountry: 'AO',
            },
          },
        })}</script>
      </Helmet>

      <PageHero
        icon={Phone}
        eyebrow={t('pages.contactos.eyebrow')}
        title={t('pages.contactos.title')}
        description={t('pages.contactos.description')}
        highlights={t('pages.contactos.highlights', { returnObjects: true }) as string[]}
        breadcrumb={[{ label: t('nav.contact') }]}
      />

      <Contact />
    </>
  );
};
