import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteEstimator } from '../components/sections/RouteEstimator';

export const PageRotas: React.FC = () => (
  <>
    <Helmet>
      <title>Rotas Executivas e Transfers em Angola | PEPEK GRUPO</title>
      <meta name="description" content="Planeie transfers de aeroporto, deslocações empresariais e missões interprovinciais com viatura e motorista adequados ao itinerário." />
      <meta property="og:title" content="Rotas Executivas em Angola | PEPEK GRUPO" />
      <meta property="og:description" content="Itinerários executivos, transfers e mobilidade protocolar com planeamento operacional em Angola." />
      <link rel="canonical" href="https://pepekgrupo.com/rotas" />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Rotas Executivas e Transfers PEPEK GRUPO',
        provider: { '@type': 'LocalBusiness', name: 'PEPEK GRUPO RENT-A-CAR' },
        areaServed: { '@type': 'Country', name: 'Angola' },
        url: 'https://pepekgrupo.com/rotas',
      })}</script>
    </Helmet>
    <div className="pt-28">
      <RouteEstimator />
    </div>
  </>
);
