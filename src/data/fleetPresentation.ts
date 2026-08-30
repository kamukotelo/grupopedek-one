import type { VehicleDetail } from './fleetData';

// Fundo único e uniforme para toda a frota — tonalidade azul da marca.
// Substitui o showroom fotográfico para que todos os cards fiquem coerentes.
export const FLEET_STUDIO_BACKGROUNDS = {
  default: '/studio/background-options/official-blue-flat.png',
  luxury: '/studio/background-options/official-blue-flat.png'
} as const;

export const getVehicleStudioBackground = (_vehicle: Pick<VehicleDetail, 'category'>): string =>
  FLEET_STUDIO_BACKGROUNDS.default;

// As imagens entregues em "Carros PNG" têm recortes transparentes com
// enquadramentos diferentes (o carro ocupa mais ou menos área do ficheiro).
// Estas escalas são calculadas para que TODAS as viaturas ocupem a mesma
// largura no quadro do card /frota — a mesma proporção do Mercedes Brabus,
// que serve de referência. Valores obtidos por medição da bounding-box real
// de cada 01-oficial.webp (scripts/calc-scales); vans e minibus altos são
// limitados em altura para não sair do quadro. Nunca deformam nem cortam.
const FLEET_IMAGE_SCALES: Record<string, number> = {
  'rangerover-blindado-2025': 1.78,
  'mercedes-class-s-2025': 1.35,
  'range-rover-novo-modelo': 1.56,
  'mercedes-g63-2023': 1.36,
  'lexus-600': 1.35,
  'mercedes-vito': 1.21,
  'mercedes-g63': 1.54,
  'toyota-lc300-2023': 1.13,
  'lexus-570': 1.54,
  'range-rover': 1.47,
  'toyota-lc-v8-2021': 1.3,
  'mercedes-cls63': 1.36,
  'mercedes-brabus': 1.14,
  'volvo-xc-60': 1.56,
  'new-toyota-prado': 1.54,
  'nissan-patrol': 1.18,
  'toyota-prado-atual': 1.37,
  'toyota-fortuner-2023': 1.36,
  'mercedes-benz-v300-class': 1.21,
  'hyundai-staria-executiva': 1.3,
  'toyota-coaster': 1.24,
  'mercedes-sprinter-atual': 1.31,
  'hyundai-staria-atual': 1.35,
  'new-toyota-hiace': 1.33,
  'hyundai-h1': 1.26,
  'toyota-hiace': 1.26,
  'jetour-x70': 1.33,
  'hyundai-santa-fe': 1.55,
  'hyundai-tucson': 1.54,
  'chery-tiggo-7': 1.33,
  'chery-tiggo-2': 1.22,
  'hyundai-creta': 1.29,
  'toyota-lc-hz': 1.32,
  'toyota-lc-hz-18p': 1.12,
  'mitsubishi-canter': 1.29,
  'mitsubishi-l200': 1.32,
  'toyota-hilux': 1.35,
  'suzuki-swift': 1.33,
  'suzuki-baleno': 1.34,
  'hyundai-i-20': 1.55,
  'suzuki-spresso': 1.27,
  'toyota-starlet': 1.35,
  'hyundai-g-i10': 1.32,
  'kia-morning': 1.33,
  'suzuki-celerio': 1.32,
  'limousine': 1.12,
  'chery-himla': 1.23,
  'jmc-touring': 1.32,
  'jac-sunray': 1.26,
  'baw-m7': 1.31,
  'kia-seltos': 1.31,
};

export const getFleetImageScale = (vehicleId: string): number =>
  FLEET_IMAGE_SCALES[vehicleId] ?? 1.3;

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
