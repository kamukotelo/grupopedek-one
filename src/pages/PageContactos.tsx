import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Contact } from '../components/sections/Contact';

export const PageContactos: React.FC = () => (
  <>
    <Helmet>
      <title>Contactos – Central de Operações PEPEK GRUPO | +244 923 719 090</title>
      <meta name="description" content="Contacte a Central de Operações PEPEK GRUPO em Talatona, Luanda. Linha 24/7: +244 923 719 090 / 923 000 010. WhatsApp disponível." />
      <meta property="og:title" content="Contactos | PEPEK GRUPO" />
      <meta property="og:description" content="Central de Operações em Talatona, Luanda. Linha e WhatsApp disponíveis 24 horas." />
      <meta property="og:url" content="https://pepekgrupo.com/contactos" />
      <link rel="canonical" href="https://pepekgrupo.com/contactos" />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: 'https://pepekgrupo.com/contactos',
        mainEntity: {
          '@type': 'Organization',
          name: 'PEPEK GRUPO RENT-A-CAR',
          telephone: '+244923719090',
          email: 'geral@pepekgrupo.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rua Reino do Bailundo',
            addressLocality: 'Talatona, Luanda',
            addressCountry: 'AO',
          },
        },
      })}</script>
    </Helmet>

    <PageHero
      icon={Phone}
      eyebrow="Central de operações"
      title="Falamos consigo a qualquer hora."
      description="Talatona, Luanda. Linha directa, WhatsApp e e-mail disponíveis 24 horas por dia, todos os dias, para pedidos urgentes, propostas corporativas e apoio durante o serviço."
      breadcrumb={[{ label: 'Contactos' }]}
    />

    <Contact />
  </>
);
