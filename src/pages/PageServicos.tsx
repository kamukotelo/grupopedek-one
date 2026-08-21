import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Services } from '../components/sections/Services';

export const PageServicos: React.FC = () => (
  <>
    <Helmet>
      <title>Serviços de Mobilidade Executiva – PEPEK GRUPO Angola</title>
      <meta name="description" content="Rent-a-Car de Luxo, Apoio Executivo & Protocolo Diplomático, Mobilidade Corporativa e Transportes para Eventos e Cimeiras em Angola. Frota de alta gama 24/7." />
      <meta property="og:title" content="Serviços de Mobilidade Executiva | PEPEK GRUPO" />
      <meta property="og:description" content="Rent-a-car premium, motoristas executivos, protocolo, transfers e mobilidade corporativa em Angola." />
      <meta property="og:url" content="https://pepekgrupo.com/servicos" />
      <link rel="canonical" href="https://pepekgrupo.com/servicos" />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Serviços PEPEK GRUPO',
        url: 'https://pepekgrupo.com/servicos',
        itemListElement: [
          'Rent-a-Car Premium',
          'Mobilidade Executiva',
          'Transfers de Aeroporto',
          'Mobilidade Corporativa',
          'Eventos e Protocolo',
        ].map((name, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', name } })),
      })}</script>
    </Helmet>
    <div className="pt-28">
      <Services />
    </div>
  </>
);
