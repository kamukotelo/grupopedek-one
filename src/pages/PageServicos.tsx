import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Services } from '../components/sections/Services';

export const PageServicos: React.FC = () => (
  <>
    <Helmet>
      <title>Frota Premium e Mobilidade Executiva – PEPEK GRUPO Angola</title>
      <meta name="description" content="Frota premium, motoristas profissionais, serviços protocolares e suporte 24 horas para deslocações executivas, transfers, eventos e operações corporativas em Angola." />
      <meta property="og:title" content="Frota Premium e Mobilidade Executiva | PEPEK GRUPO" />
      <meta property="og:description" content="Conforto, segurança e acompanhamento operacional em serviços de mobilidade executiva, corporativa e protocolar em Angola." />
      <meta property="og:url" content="https://pepekgrupo.com/servicos" />
      <link rel="canonical" href="https://pepekgrupo.com/servicos" />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Serviços PEPEK GRUPO',
        url: 'https://pepekgrupo.com/servicos',
        itemListElement: [
          'Frota Premium',
          'Motoristas Profissionais',
          'Serviços Protocolares',
          'Suporte 24 Horas',
        ].map((name, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', name } })),
      })}</script>
    </Helmet>
    <div className="pt-28">
      <Services />
    </div>
  </>
);
