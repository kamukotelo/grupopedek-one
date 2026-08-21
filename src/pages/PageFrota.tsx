import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Fleet } from '../components/sections/Fleet';

export const PageFrota: React.FC<{ onSelectVehicle: (v: string) => void }> = ({ onSelectVehicle }) => (
  <>
    <Helmet>
      <title>Frota de Viaturas de Luxo – Land Cruiser, Hilux 4x4, Hiace VIP | PEPEK GRUPO</title>
      <meta name="description" content="Frota executiva: Toyota Land Cruiser Prado, LC300, Hilux 4x4, Fortuner e Hiace VIP disponíveis em Luanda com ou sem motorista protocolar bilingue." />
      <link rel="canonical" href="https://pepekgrupo.com/frota" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Vehicle",
        "name": "Frota Executiva PEPEK GRUPO",
        "brand": { "@type": "Brand", "name": "Toyota" },
        "url": "https://pepekgrupo.com/frota"
      })}</script>
    </Helmet>
    <div className="pt-28">
      <Fleet onSelectVehicle={onSelectVehicle} />
    </div>
  </>
);
