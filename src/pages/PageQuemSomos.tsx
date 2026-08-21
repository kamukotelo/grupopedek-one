import React from 'react';
import { Helmet } from 'react-helmet-async';
import { About } from '../components/sections/About';

export const PageQuemSomos: React.FC = () => (
  <>
    <Helmet>
      <title>Quem Somos – PEPEK GRUPO RENT-A-CAR | Desde 2014 em Angola</title>
      <meta name="description" content="A PEPEK GRUPO nasceu em Luanda em 2014. Somos a referência angolana em mobilidade executiva, com frota certificada, motoristas bilingues e cobertura nas 18 províncias." />
      <link rel="canonical" href="https://pepekgrupo.com/quem-somos" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Quem Somos – PEPEK GRUPO",
        "url": "https://pepekgrupo.com/quem-somos"
      })}</script>
    </Helmet>
    <div className="pt-28">
      <About />
    </div>
  </>
);
