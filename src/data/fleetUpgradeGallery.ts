import type { VehicleDetail } from './fleetData';

type GalleryImage = VehicleDetail['gallery'][number];

const UPGRADE_IDS = [
  'rangerover-blindado-2025',
  'mercedes-class-s-2025',
  'range-rover-novo-modelo',
  'mercedes-g63-2023',
  'lexus-600',
  'mercedes-vito',
  'mercedes-g63',
  'toyota-lc300-2023'
] as const;

export const FLEET_UPGRADE_GALLERY: Record<string, GalleryImage[]> = Object.fromEntries(
  UPGRADE_IDS.map((id) => [
    id,
    [{
      url: `/fleet-carousel-generated/${id}/catalog-v1.webp`,
      caption: 'Nova apresentação premium — múltiplas vistas exteriores e interiores',
      altText: `${id} — nova apresentação premium da viatura`,
      type: 'context' as const
    }]
  ])
);

export const getFleetUpgradeCover = (vehicleId: string): string | undefined =>
  FLEET_UPGRADE_GALLERY[vehicleId]?.[0]?.url;
