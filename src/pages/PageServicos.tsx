import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Services } from '../components/sections/Services';
import { Process } from '../components/sections/Process';
import { FAQ, faqItems } from '../components/sections/FAQ';
import { BrandCTA } from '../components/sections/BrandCTA';

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: 'https://pepekgrupo.com/servicos',
  mainEntity: faqItems.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export const PageServicos: React.FC = () => (
  <>
    <Helmet>
      <title>Serviços de Mobilidade Executiva e Rent-a-Car | PEPEK GRUPO Angola</title>
      <meta name="description" content="Transfers de aeroporto, mobilidade executiva, contratos corporativos, eventos, motorista protocolar e apoio 24 horas em Angola. Saiba como trabalhamos." />
      <meta property="og:title" content="Serviços de Mobilidade Executiva | PEPEK GRUPO" />
      <meta property="og:description" content="Conforto, segurança e acompanhamento operacional em serviços de mobilidade executiva, corporativa e protocolar em Angola." />
      <meta property="og:url" content="https://pepekgrupo.com/servicos" />
      <link rel="canonical" href="https://pepekgrupo.com/servicos" />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Serviços PEPEK GRUPO',
        url: 'https://pepekgrupo.com/servicos',
        itemListElement: [
          'Transfers de Aeroporto',
          'Mobilidade Executiva',
          'Contratos Corporativos',
          'Eventos e Comitivas',
          'Motorista Protocolar',
          'Apoio e Segurança 24 Horas',
        ].map((name, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', name } })),
      })}</script>
      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
    </Helmet>

    <PageHero
      icon={Briefcase}
      eyebrow="O que fazemos"
      title="Mobilidade executiva pensada ao detalhe."
      description="Do transfer de aeroporto ao contrato corporativo de longa duração: viatura, motorista e planeamento operacional ajustados a cada deslocação em Angola."
      breadcrumb={[{ label: 'Serviços' }]}
    />

    <Services withLinks={false} />
    <Process />
    <FAQ />
    <BrandCTA />
  </>
);
