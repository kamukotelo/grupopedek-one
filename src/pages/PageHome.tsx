import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { FleetShowcase } from '../components/sections/FleetShowcase';
import { TrustStats } from '../components/sections/TrustStats';
import { AboutTeaser } from '../components/sections/AboutTeaser';
import { InstitutionalClients } from '../components/sections/InstitutionalClients';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';
import { BrandCTA } from '../components/sections/BrandCTA';

/**
 * Home = montra institucional. Cada bloco é um resumo que encaminha para a
 * página onde o assunto vive por inteiro (frota, serviços, quem somos,
 * clientes, reserva, rotas, contactos). Nada de conteúdo duplicado.
 */
export const PageHome: React.FC<{ onSelectVehicle: (v: string) => void }> = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('pages.home.metaTitle')}</title>
        <meta name="description" content={t('pages.home.metaDescription')} />
        <meta property="og:title" content={t('pages.home.ogTitle')} />
        <meta property="og:description" content={t('pages.home.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/" />
        <link rel="canonical" href="https://pepekgrupo.com/" />
      </Helmet>

      {/* Identidade + pedido rápido */}
      <Hero />

      {/* Faixa de clientes logo abaixo do hero */}
      <InstitutionalClients />

      {/* Resumo da oferta → /servicos */}
      <Services />

      {/* Montra de viaturas → /frota */}
      <FleetShowcase />

      {/* Prova institucional */}
      <TrustStats />
      <AboutTeaser />

      {/* Garantias de pagamento e faturação */}
      <PaymentSecurity />

      {/* Chamada final → /reservar */}
      <BrandCTA />
    </>
  );
};
