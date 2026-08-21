import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Services } from '../components/sections/Services';

export const PageServicos: React.FC = () => (
  <>
    <Helmet>
      <title>Serviços de Mobilidade Executiva – PEPEK GRUPO Angola</title>
      <meta name="description" content="Rent-a-Car de Luxo, Apoio Executivo & Protocolo Diplomático, Mobilidade Corporativa e Transportes para Eventos e Cimeiras em Angola. Frota de alta gama 24/7." />
      <link rel="canonical" href="https://pepekgrupo.com/servicos" />
    </Helmet>
    <div className="pt-28">
      <Services />
    </div>
  </>
);
