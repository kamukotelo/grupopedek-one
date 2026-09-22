import React from 'react';
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
export const PageHome: React.FC<{ onSelectVehicle: (v: string) => void }> = () => (
  <>
    <Helmet>
      <title>PEPEK GRUPO – Rent-a-Car Executivo & Mobilidade de Luxo em Angola</title>
      <meta name="description" content="Aluguer de viaturas de luxo em Luanda com ou sem motorista protocolar. Blindados, berlinas executivas, SUVs, viaturas 4x4 e Vans VIP. Talatona, Luanda." />
      <meta property="og:title" content="PEPEK GRUPO – Rent-a-Car Executivo & Blindados Angola" />
      <meta property="og:description" content="Mobilidade executiva, protocolo e rent-a-car premium para empresas, instituições e particulares em Angola." />
      <meta property="og:url" content="https://pepekgrupo.com/" />
      <meta property="og:type" content="website" />
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
