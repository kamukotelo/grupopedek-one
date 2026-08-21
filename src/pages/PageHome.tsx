import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { Fleet } from '../components/sections/Fleet';
import { CorporatePortal } from '../components/sections/CorporatePortal';
import { Process } from '../components/sections/Process';
import { About } from '../components/sections/About';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';
import { FAQ } from '../components/sections/FAQ';
import { Contact } from '../components/sections/Contact';
import { CoverageMap } from '../components/sections/CoverageMap';
import { BookingWidget } from '../components/sections/BookingWidget';
import { RouteEstimator } from '../components/sections/RouteEstimator';

const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PEPEK GRUPO RENT-A-CAR",
  "description": "Serviço de aluguer de viaturas de luxo e mobilidade executiva em Angola. Especialistas em protocolos diplomáticos, corporativos e eventos de estado.",
  "url": "https://pepekgrupo.com",
  "telephone": "+244923719090",
  "email": "geral@pepekgrupo.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Reino do Bailundo",
    "addressLocality": "Talatona, Luanda",
    "addressCountry": "AO"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$$$$",
  "image": "https://pepekgrupo.com/logo.png"
};

export const PageHome: React.FC<{ onSelectVehicle: (v: string) => void }> = ({ onSelectVehicle }) => (
  <>
    <Helmet>
      <title>PEPEK GRUPO – Rent-a-Car Executivo & Mobilidade de Luxo em Angola</title>
      <meta name="description" content="Aluguer de viaturas de luxo em Luanda com ou sem motorista protocolar. Frota oficial de 47 viaturas: Blindados, Mercedes Classe S, Land Cruiser LC300, Hilux 4x4 e Vans VIP. Talatona, Luanda." />
      <meta property="og:title" content="PEPEK GRUPO – Rent-a-Car Executivo & Blindados Angola" />
      <meta property="og:description" content="Embaixadas, Multinacionais e Protocolo de Estado escolhem a PEPEK GRUPO. Frota oficial de 47 modelos em Talatona, Luanda." />
      <meta property="og:url" content="https://pepekgrupo.com" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://pepekgrupo.com/" />
      <script type="application/ld+json">{JSON.stringify(SCHEMA_ORG)}</script>
    </Helmet>
    <Hero />
    <BookingWidget initialVehicle="Novo Toyota Prado" />
    <Services />
    <Fleet onSelectVehicle={onSelectVehicle} />
    <CorporatePortal />
    <CoverageMap />
    <RouteEstimator />
    <Process />
    <About />
    <PaymentSecurity />
    <FAQ />
    <Contact />
  </>
);
