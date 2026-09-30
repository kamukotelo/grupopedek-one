import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
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

      {/* Cabeçalho curto: no telemóvel o formulário tem de aparecer logo. */}
      <section className="bg-[#001E4A] px-4 pb-6 pt-28 text-white sm:pb-8 lg:pt-44">
        <div className="mx-auto max-w-3xl">
          <h1 style={{ color: '#fff' }} className="text-2xl font-extrabold leading-tight sm:text-3xl">{t('bookingForm.title')}</h1>
          <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">{t('bookingForm.subtitle')}</p>
        </div>
      </section>

      <BookingWidget />
      <PaymentSecurity />
    </>
  );
};
