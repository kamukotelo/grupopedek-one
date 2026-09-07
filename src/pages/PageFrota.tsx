import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Car } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Fleet } from '../components/sections/Fleet';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageFrota: React.FC<{ onSelectVehicle: (v: string) => void }> = ({ onSelectVehicle }) => (
  <>
    <Helmet>
      <title>Frota Executiva – Viaturas de Luxo, Blindados, SUVs e Vans | PEPEK GRUPO</title>
      <meta name="description" content="Conheça a frota executiva da PEPEK GRUPO em Angola: blindados, berlinas de luxo, SUVs, viaturas 4x4, Vans VIP e soluções económicas." />
      <meta property="og:title" content="Frota Executiva PEPEK GRUPO – Blindados, SUVs e Vans VIP" />
      <meta property="og:description" content="Blindados, berlinas de luxo, SUVs, 4x4 e Vans VIP disponíveis com ou sem motorista em Luanda e em todo o país." />
      <meta property="og:url" content="https://pepekgrupo.com/frota" />
      <link rel="canonical" href="https://pepekgrupo.com/frota" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AutoRental",
        "name": "Frota Executiva PEPEK GRUPO RENT-A-CAR",
        "url": "https://pepekgrupo.com/frota",
        "description": "Aluguer executivo, corporativo e diplomático de viaturas em Angola."
      })}</script>
    </Helmet>

    <PageHero
      icon={Car}
      eyebrow="A nossa frota"
      title="Uma viatura certa para cada missão."
      description="Blindados, berlinas executivas, SUVs, 4x4 para o interior e Vans VIP. Compare categorias, lugares e condições, e escolha com ou sem motorista."
      breadcrumb={[{ label: 'Frota' }]}
    />

    <Fleet onSelectVehicle={onSelectVehicle} />
    <BrandCTA />
  </>
);
