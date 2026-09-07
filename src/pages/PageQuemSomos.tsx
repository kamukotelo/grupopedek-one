import React from 'react';
import { Helmet } from 'react-helmet-async';
import { About } from '../components/sections/About';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageQuemSomos: React.FC = () => (
  <>
    <Helmet>
      <title>Quem Somos – PEPEK GRUPO RENT-A-CAR | Desde 2014 em Angola</title>
      <meta name="description" content="A PEPEK GRUPO nasceu em Luanda em 2014. Mobilidade executiva com frota preparada, motoristas bilingues e capacidade operacional em Angola." />
      <meta property="og:title" content="Quem Somos | PEPEK GRUPO RENT-A-CAR" />
      <meta property="og:description" content="Uma década de mobilidade executiva em Angola: história, princípios, equipa e capacidade operacional." />
      <meta property="og:url" content="https://pepekgrupo.com/quem-somos" />
      <link rel="canonical" href="https://pepekgrupo.com/quem-somos" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Quem Somos – PEPEK GRUPO",
        "url": "https://pepekgrupo.com/quem-somos"
      })}</script>
    </Helmet>

    {/* O About traz o seu próprio cabeçalho com <h1> — não usa o PageHero. */}
    <About />
    <PaymentSecurity />
    <BrandCTA />
  </>
);
