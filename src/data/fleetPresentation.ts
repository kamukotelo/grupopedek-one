import type { VehicleDetail } from './fleetData';

// Fundo único e uniforme para toda a frota — tonalidade azul da marca.
// Substitui o showroom fotográfico para que todos os cards fiquem coerentes.
export const FLEET_STUDIO_BACKGROUNDS = {
  default: '/studio/background-options/official-blue-flat.png',
  luxury: '/studio/background-options/official-blue-flat.png'
} as const;

export const getVehicleStudioBackground = (_vehicle: Pick<VehicleDetail, 'category'>): string =>
  FLEET_STUDIO_BACKGROUNDS.default;

// As imagens entregues em "Carros PNG" têm recortes transparentes diferentes.
// Estes ajustes mantêm a viatura como elemento dominante sem esticar nem cortar
// a fotografia original; todos os valores preservam a proporção do ficheiro.
const FLEET_IMAGE_SCALES: Record<string, number> = {
  'rangerover-blindado-2025': 1.72,
  'mercedes-class-s-2025': 1.14,
  'range-rover-novo-modelo': 1.5,
  'mercedes-g63-2023': 1.13,
  'lexus-600': 1.16,
  'mercedes-vito': 1.18,
  'mercedes-g63': 1.5,
  'toyota-lc300-2023': 1.14,
  'lexus-570': 1.13,
  'range-rover': 1.12,
  'toyota-lc-v8-2021': 1.12,
  'mercedes-cls63': 1.15,
  'mercedes-brabus': 1.14,
  'volvo-xc-60': 1.5,
  'new-toyota-prado': 1.48,
  'nissan-patrol': 1.13,
  'toyota-prado-atual': 1.14,
  'toyota-fortuner-2023': 1.14,
  'mercedes-benz-v300-class': 1.22,
  'hyundai-staria-executiva': 1.14,
  'toyota-coaster': 1.1,
  'mercedes-sprinter-atual': 1.1,
  'hyundai-staria-atual': 1.1,
  'new-toyota-hiace': 1.1,
  'hyundai-h1': 1.13,
  'toyota-hiace': 1.1,
  'jetour-x70': 1.13,
  'hyundai-santa-fe': 1.28,
  'hyundai-tucson': 1.48,
  'chery-tiggo-7': 1.12,
  'chery-tiggo-2': 1.08,
  'hyundai-creta': 1.12,
  'toyota-lc-hz': 1.1,
  'toyota-lc-hz-18p': 1.1,
  'mitsubishi-canter': 1.08,
  'mitsubishi-l200': 1.14,
  'toyota-hilux': 1.2,
  'suzuki-swift': 1.12,
  'suzuki-baleno': 1.12,
  'hyundai-i-20': 1.12,
  'suzuki-spresso': 1.12,
  'toyota-starlet': 1.12,
  'hyundai-g-i10': 1.12,
  'kia-morning': 1.12,
  'suzuki-celerio': 1.12,
  'limousine': 1.05,
  'chery-himla': 1.1,
  'jmc-touring': 1.1,
  'jac-sunray': 1.1,
  'baw-m7': 1.1,
  'kia-seltos': 1.12,
};

export const getFleetImageScale = (vehicleId: string): number =>
  FLEET_IMAGE_SCALES[vehicleId] ?? 1.12;

// Alguns recortes oficiais concentram a viatura na metade superior da tela.
// O deslocamento corrige somente a posição, sem deformar nem alterar a escala.
const FLEET_IMAGE_OFFSET_Y: Record<string, string> = {
  'range-rover': '5%',
  'range-rover-novo-modelo': '10%',
  'rangerover-blindado-2025': '13%',
  'mercedes-g63': '9%',
  'new-toyota-prado': '8%',
  'volvo-xc-60': '10%',
  'hyundai-santa-fe': '8%',
  'hyundai-tucson': '9%',
};

export const getFleetImageOffsetY = (vehicleId: string): string =>
  FLEET_IMAGE_OFFSET_Y[vehicleId] ?? '0%';
