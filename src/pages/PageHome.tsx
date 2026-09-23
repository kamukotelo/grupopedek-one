import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/sections/Hero';
import { QuickReservation } from '../components/sections/QuickReservation';
import { InstitutionalClients } from '../components/sections/InstitutionalClients';
import { Services } from '../components/sections/Services';
import { FleetShowcase } from '../components/sections/FleetShowcase';
import { TrustStats } from '../components/sections/TrustStats';
import { AboutTeaser } from '../components/sections/AboutTeaser';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';
import { BrandCTA } from '../components/sections/BrandCTA';

/**
 * Sequência da página inicial:
 * 1. Hero (vídeos institucionais + headline + CTAs)
 * 2. Reserva Rápida (simulador de disponibilidade com frota VIP)
 * 3. Clientes VIP (logos institucionais e corporativos)
 * 4. Serviços → /servicos
 * 5. Montra de frota → /frota
 * 6. Prova institucional (stats + sobre nós)
 * 7. Segurança de pagamento
 * 8. Chamada final → /reservar
 */
export const PageHome: React.FC<{ onSelectVehicle: (v: string) => void }> = () => (
  <>
    <Helmet>
      <title>PEPEK GRUPO – Rent-a-Car Executivo &amp; Mobilidade de Luxo em Angola</title>
      <meta name="description" content="Aluguer de viaturas de luxo em Luanda com ou sem motorista protocolar. Blindados, berlinas executivas, SUVs, viaturas 4x4 e Vans VIP. Talatona, Luanda." />
      <meta property="og:title" content="PEPEK GRUPO – Rent-a-Car Executivo &amp; Blindados Angola" />
      <meta property="og:description" content="Mobilidade executiva, protocolo e rent-a-car premium para empresas, instituições e particulares em Angola." />
      <meta property="og:url" content="https://pepekgrupo.com/" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://pepekgrupo.com/" />
    </Helmet>

    {/* 1 — Hero: vídeos institucionais + identidade + CTAs */}
    <Hero />

    {/* 2 — Área de Reserva: simulador com frota VIP */}
    <QuickReservation />

    {/* 3 — Clientes VIP: faixa de logos institucionais */}
    <InstitutionalClients />

    {/* 4 — Serviços resumo → /servicos */}
    <Services />

    {/* 5 — Montra de viaturas → /frota */}
    <FleetShowcase />

    {/* 6 — Prova institucional */}
    <TrustStats />
    <AboutTeaser />

    {/* 7 — Garantias de pagamento e faturação */}
    <PaymentSecurity />

    {/* 8 — Chamada final → /reservar */}
    <BrandCTA />
  </>
);
