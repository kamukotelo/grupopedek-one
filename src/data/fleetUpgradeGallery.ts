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
  'toyota-lc300-2023',
  'lexus-570',
  'range-rover',
  'toyota-lc-v8-2021',
  'mercedes-cls63',
  'toyota-prado-atual',
  'toyota-fortuner-2023',
  'mercedes-brabus'
] as const;

export const FLEET_UPGRADE_GALLERY: Record<string, GalleryImage[]> = Object.fromEntries(
  UPGRADE_IDS.map((id) => [
    id,
    [
      ['04-interior-cockpit.webp', 'Cockpit e painel de instrumentos', 'interior'],
      ['05-interior-passageiros.webp', 'Interior e espaço dos passageiros', 'interior']
    ].map(([file, caption, type]) => ({
      url: `/fleet-carousel-generated/${id}/${file}`,
      caption: `Nova apresentação premium — ${caption}`,
      altText: `${id} — ${caption.toLowerCase()}`,
      type: type as GalleryImage['type']
    }))
  ])
);

// Este acervo complementa a frota existente sem substituir capas, viaturas ou
// vistas exteriores. Apenas estas vistas internas, verificadas sem pessoas,
// podem ser acrescentadas à galeria pública de cada viatura.
export const getFleetPeopleFreeInteriors = (vehicleId: string): GalleryImage[] =>
  FLEET_UPGRADE_GALLERY[vehicleId] ?? [];

export const getFleetUpgradePhotoCount = (vehicleId: string): number =>
  getFleetPeopleFreeInteriors(vehicleId).length;
