import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { CalendarCheck } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { BookingWidget } from '../components/sections/BookingWidget';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';

export const PageReservar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.reservar.metaTitle')}</title>
        <meta name="description" content={t('pages.reservar.metaDescription')} />
        <meta property="og:title" content={t('pages.reservar.ogTitle')} />
        <meta property="og:description" content={t('pages.reservar.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/reservar" />
        <link rel="canonical" href="https://pepekgrupo.com/reservar" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ReserveAction',
          name: t('pages.reservar.schemaName'),
          target: 'https://pepekgrupo.com/reservar',
        })}</script>
      </Helmet>

      <PageHero
        icon={CalendarCheck}
        eyebrow={t('pages.reservar.eyebrow')}
        title={t('pages.reservar.title')}
        description={t('pages.reservar.description')}
        breadcrumb={[{ label: t('common.book') }]}
      />

      <BookingWidget initialVehicle="Toyota Land Cruiser 250" />
      <PaymentSecurity />
    </>
  );
};
