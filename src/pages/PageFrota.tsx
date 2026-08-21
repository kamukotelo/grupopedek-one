import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Fleet } from '../components/sections/Fleet';

export const PageFrota: React.FC<{ onSelectVehicle: (v: string) => void }> = ({ onSelectVehicle }) => (
  <>
    <Helmet>
      <title>Frota Executiva – Viaturas de Luxo, Blindados, SUVs e Vans | PEPEK GRUPO</title>
      <meta name="description" content="Conheça a frota executiva da PEPEK GRUPO em Angola: blindados, berlinas de luxo, SUVs, viaturas 4x4, Vans VIP e soluções económicas." />
      <link rel="canonical" href="https://pepekgrupo.com/frota" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AutoRental",
        "name": "Frota Executiva PEPEK GRUPO RENT-A-CAR",
        "url": "https://pepekgrupo.com/frota",
        "description": "Aluguer executivo, corporativo e diplomático de viaturas em Angola."
      })}</script>
    </Helmet>
    <div className="pt-28">
      <Fleet onSelectVehicle={onSelectVehicle} />
    </div>
  </>
);
