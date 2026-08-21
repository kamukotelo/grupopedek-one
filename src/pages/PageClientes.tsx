import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CorporatePortal } from '../components/sections/CorporatePortal';

export const PageClientes: React.FC = () => (
  <>
    <Helmet>
      <title>Clientes de Referência – Embaixadas, Governo & Multinacionais | PEPEK GRUPO</title>
      <meta name="description" content="Embaixadas, Governo angolano, UNICEF, TAAG, Banco BFA e dezenas de multinacionais confiam na PEPEK GRUPO para a sua mobilidade executiva em Angola." />
      <link rel="canonical" href="https://pepekgrupo.com/clientes" />
    </Helmet>
    <div className="pt-28">
      <CorporatePortal />
    </div>
  </>
);
