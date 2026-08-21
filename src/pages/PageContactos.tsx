import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Contact } from '../components/sections/Contact';

export const PageContactos: React.FC = () => (
  <>
    <Helmet>
      <title>Contactos – Central de Operações PEPEK GRUPO | +244 923 719 090</title>
      <meta name="description" content="Contacte a Central de Operações PEPEK GRUPO em Talatona, Luanda. Linha 24/7: +244 923 719 090 / 923 000 010. WhatsApp disponível." />
      <link rel="canonical" href="https://pepekgrupo.com/contactos" />
    </Helmet>
    <div className="pt-28">
      <Contact />
    </div>
  </>
);
