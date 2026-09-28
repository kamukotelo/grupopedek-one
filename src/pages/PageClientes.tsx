import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Users } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { InstitutionalClients } from '../components/sections/InstitutionalClients';
import { CorporatePortal } from '../components/sections/CorporatePortal';
import { Capabilities } from '../components/sections/Capabilities';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageClientes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.clientes.metaTitle')}</title>
        <meta name="description" content={t('pages.clientes.metaDescription')} />
        <meta property="og:title" content={t('pages.clientes.ogTitle')} />
        <meta property="og:description" content={t('pages.clientes.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/clientes" />
        <link rel="canonical" href="https://pepekgrupo.com/clientes" />
      </Helmet>

      <PageHero
        icon={Users}
        eyebrow={t('pages.clientes.eyebrow')}
        title={t('pages.clientes.title')}
        description={t('pages.clientes.description')}
        breadcrumb={[{ label: t('nav.clients') }]}
      />

      <InstitutionalClients withLink={false} />
      <CorporatePortal />
      <Capabilities />
      <BrandCTA />
    </>
  );
};
