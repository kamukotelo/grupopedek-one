import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { InstitutionalClients } from '../components/sections/InstitutionalClients';
import { CorporatePortal } from '../components/sections/CorporatePortal';
import { Capabilities } from '../components/sections/Capabilities';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageClientes: React.FC = () => (
  <>
    <Helmet>
      <title>Clientes de Referência – Embaixadas, Governo & Multinacionais | PEPEK GRUPO</title>
      <meta name="description" content="Embaixadas, Governo angolano, UNDP, Bestfly, DP World, instituições e empresas confiam na PEPEK GRUPO para a sua mobilidade executiva em Angola." />
      <meta property="og:title" content="Clientes Institucionais | PEPEK GRUPO" />
      <meta property="og:description" content="Corpos diplomáticos, ministérios, banca, energia e media confiam a sua mobilidade à PEPEK GRUPO." />
      <meta property="og:url" content="https://pepekgrupo.com/clientes" />
      <link rel="canonical" href="https://pepekgrupo.com/clientes" />
    </Helmet>

    <PageHero
      icon={Users}
      eyebrow="Confiança institucional"
      title="A confiança de quem exige mais."
      description="Servimos corpos diplomáticos, entidades do Estado e empresas de setores estratégicos, onde segurança, discrição e pontualidade não são opcionais, são o padrão."
      breadcrumb={[{ label: 'Clientes' }]}
    />

    <InstitutionalClients withLink={false} />
    <CorporatePortal />
    <Capabilities />
    <BrandCTA />
  </>
);
