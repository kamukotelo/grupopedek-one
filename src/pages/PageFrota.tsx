import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Fleet } from '../components/sections/Fleet';

export const PageFrota: React.FC<{ onSelectVehicle: (v: string) => void }> = ({ onSelectVehicle }) => (
  <>
    <Helmet>
      <title>Frota Oficial – 47 Viaturas de Luxo, Blindados, SUVs e Vans | PEPEK GRUPO</title>
      <meta name="description" content="Conheça a frota de 47 viaturas da PEPEK GRUPO em Angola: Blindados B6/B7, Range Rover 2025, Mercedes Classe S, Land Cruiser LC300, Hilux 4x4, Vans VIP e Económicos. Diárias a partir de 44.999 Kz." />
      <link rel="canonical" href="https://pepekgrupo.com/frota" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AutoRental",
        "name": "Frota Oficial PEPEK GRUPO RENT-A-CAR (47 Viaturas)",
        "url": "https://pepekgrupo.com/frota",
        "description": "Aluguer executivo e diplomático com 47 viaturas em Angola."
      })}</script>
    </Helmet>
    <div className="pt-28">
      <Fleet onSelectVehicle={onSelectVehicle} />
    </div>
  </>
);
