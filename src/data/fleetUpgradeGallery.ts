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
    [
      ['01-exterior-principal.webp', 'Vista exterior principal', 'exterior'],
      ['02-exterior-traseira.webp', 'Vista exterior traseira', 'exterior'],
      ['03-exterior-lateral.webp', 'Vista exterior lateral', 'exterior'],
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

export const getFleetUpgradeCover = (vehicleId: string): string | undefined =>
  FLEET_UPGRADE_GALLERY[vehicleId]?.[0]?.url;

export const getFleetUpgradePhotoCount = (vehicleId: string): number =>
  FLEET_UPGRADE_GALLERY[vehicleId]?.length ?? 0;
