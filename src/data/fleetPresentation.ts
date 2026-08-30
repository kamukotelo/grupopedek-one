import type { VehicleDetail } from './fleetData';

// Fundo único e uniforme para toda a frota — tonalidade azul da marca.
// Substitui o showroom fotográfico para que todos os cards fiquem coerentes.
export const FLEET_STUDIO_BACKGROUNDS = {
  default: '/studio/background-options/official-blue-flat.png',
  luxury: '/studio/background-options/official-blue-flat.png'
} as const;

export const getVehicleStudioBackground = (_vehicle: Pick<VehicleDetail, 'category'>): string =>
  FLEET_STUDIO_BACKGROUNDS.default;

// As imagens de "Carros PNG" têm recortes transparentes com enquadramentos
// diferentes (o carro ocupa mais ou menos área do ficheiro). Estas escalas
// fazem com que TODAS as viaturas fiquem assentes na base do card /frota
// (object-bottom) com a MESMA altura renderizada (~72% da moldura) e sem
// nunca cortar — nem o tejadilho no topo nem as rodas em baixo, mesmo no
// zoom do hover. Valores medidos da bounding-box opaca real de cada
// 01-oficial.webp por scripts/calc-fleet-card-scales.py.
const FLEET_IMAGE_SCALES: Record<string, number> = {
  'kia-morning': 1.04,
  'suzuki-celerio': 1.08,
  'hyundai-g-i10': 1.06,
  'hyundai-i-20': 1.23,
  'suzuki-spresso': 1.0,
  'suzuki-swift': 1.04,
  'toyota-starlet': 1.06,
  'suzuki-baleno': 1.05,
  'hyundai-creta': 1.01,
  'chery-tiggo-2': 1.28,
  'hyundai-tucson': 1.24,
  'kia-seltos': 1.07,
  'chery-tiggo-7': 1.33,
  'hyundai-santa-fe': 1.21,
  'mitsubishi-canter': 1.2,
  'toyota-hilux': 1.09,
  'mitsubishi-l200': 1.06,
  'jetour-x70': 1.04,
  'toyota-fortuner-2023': 1.16,
  'toyota-lc-hz-18p': 1.07,
  'toyota-lc-hz': 1.13,
  'toyota-prado-atual': 1.3,
  'volvo-xc-60': 1.26,
  'hyundai-h1': 0.99,
  'hyundai-staria-atual': 1.17,
  'new-toyota-hiace': 1.04,
  'mercedes-sprinter-atual': 1.02,
  'nissan-patrol': 1.18,
  'new-toyota-prado': 1.18,
  'mercedes-brabus': 1.08,
  'mercedes-cls63': 1.24,
  'toyota-coaster': 0.98,
  'hyundai-staria-executiva': 1.02,
  'toyota-lc-v8-2021': 1.02,
  'range-rover': 1.14,
  'lexus-570': 1.22,
  'toyota-lc300-2023': 1.21,
  'mercedes-g63-2023': 1.12,
  'mercedes-vito': 1.13,
  'mercedes-benz-v300-class': 1.22,
  'mercedes-g63': 1.16,
  'lexus-600': 1.17,
  'limousine': 1.83,
  'range-rover-novo-modelo': 1.26,
  'mercedes-class-s-2025': 1.23,
  'rangerover-blindado-2025': 1.47,
  'chery-himla': 1.26,
  'jac-sunray': 0.99,
  'baw-m7': 1.03,
  'jmc-touring': 1.03,
  'toyota-hiace': 1.04,
};

export const getFleetImageScale = (vehicleId: string): number =>
  FLEET_IMAGE_SCALES[vehicleId] ?? 0.95;

// Alguns recortes oficiais deixam a viatura a "flutuar" (muita margem
// transparente em baixo). Com object-bottom isso afastava o carro da base do
// card; este deslocamento empurra-o só o necessário para as rodas encostarem
// à base, sem nunca cortar o tejadilho. Medido por scripts/calc-fleet-card-scales.py.
const FLEET_IMAGE_OFFSET_Y: Record<string, string> = {
  'kia-morning': '4%',
  'suzuki-celerio': '5%',
  'hyundai-g-i10': '1%',
  'hyundai-i-20': '21%',
  'suzuki-swift': '1%',
  'suzuki-baleno': '1%',
  'hyundai-creta': '1%',
  'chery-tiggo-2': '4%',
  'hyundai-tucson': '16%',
  'kia-seltos': '4%',
  'hyundai-santa-fe': '13%',
  'toyota-hilux': '2%',
  'mitsubishi-l200': '1%',
  'jetour-x70': '1%',
  'toyota-fortuner-2023': '2%',
  'toyota-lc-hz': '2%',
  'toyota-prado-atual': '16%',
  'volvo-xc-60': '18%',
  'hyundai-staria-atual': '2%',
  'new-toyota-hiace': '1%',
  'new-toyota-prado': '10%',
  'mercedes-cls63': '16%',
  'hyundai-staria-executiva': '1%',
  'range-rover': '7%',
  'lexus-570': '14%',
  'mercedes-g63-2023': '5%',
  'mercedes-vito': '2%',
  'mercedes-g63': '8%',
  'lexus-600': '9%',
  'range-rover-novo-modelo': '17%',
  'mercedes-class-s-2025': '15%',
  'rangerover-blindado-2025': '23%',
  'chery-himla': '4%',
  'baw-m7': '1%',
};

export const getFleetImageOffsetY = (vehicleId: string): string =>
  FLEET_IMAGE_OFFSET_Y[vehicleId] ?? '0%';

// Nos CARROSSEIS (BookingWidget, FleetShowcase) a moldura é pequena e larga
// (~2:1). Aqui a escala do card /frota corta a viatura. Esta tabela normaliza
// pela ALTURA renderizada do carro (~82% da moldura) e nunca ultrapassa 94% em
// nenhuma direção — todas as viaturas ficam do mesmo tamanho e sem corte.
// Valores medidos da bounding-box real de cada 01-oficial.webp (scripts/calc-carousel-scales).
const FLEET_CAROUSEL_SCALES: Record<string, number> = {
  'rangerover-blindado-2025': 1.56,
  'mercedes-class-s-2025': 1.18,
  'range-rover-novo-modelo': 1.24,
  'mercedes-g63-2023': 0.96,
  'lexus-600': 1.04,
  'mercedes-vito': 0.9,
  'mercedes-g63': 1.02,
  'toyota-lc300-2023': 0.93,
  'lexus-570': 1.15,
  'range-rover': 0.99,
  'toyota-lc-v8-2021': 0.87,
  'mercedes-cls63': 1.19,
  'mercedes-brabus': 0.83,
  'volvo-xc-60': 1.25,
  'new-toyota-prado': 1.06,
  'nissan-patrol': 0.9,
  'toyota-prado-atual': 1.17,
  'toyota-fortuner-2023': 0.98,
  'mercedes-benz-v300-class': 0.88,
  'hyundai-staria-executiva': 0.87,
  'toyota-coaster': 0.83,
  'mercedes-sprinter-atual': 0.87,
  'hyundai-staria-atual': 0.99,
  'new-toyota-hiace': 0.88,
  'hyundai-h1': 0.84,
  'toyota-hiace': 0.84,
  'jetour-x70': 0.88,
  'hyundai-santa-fe': 1.13,
  'hyundai-tucson': 1.2,
  'chery-tiggo-7': 0.9,
  'chery-tiggo-2': 0.93,
  'hyundai-creta': 0.85,
  'toyota-lc-hz': 0.96,
  'toyota-lc-hz-18p': 0.82,
  'mitsubishi-canter': 1.02,
  'mitsubishi-l200': 0.9,
  'toyota-hilux': 0.92,
  'suzuki-swift': 0.88,
  'suzuki-baleno': 0.89,
  'hyundai-i-20': 1.28,
  'suzuki-spresso': 0.84,
  'toyota-starlet': 0.9,
  'hyundai-g-i10': 0.9,
  'kia-morning': 0.88,
  'suzuki-celerio': 0.92,
  'limousine': 0.94,
  'chery-himla': 0.98,
  'jmc-touring': 0.88,
  'jac-sunray': 0.84,
  'baw-m7': 0.87,
  'kia-seltos': 0.91,
};

export const getFleetCarouselScale = (vehicleId: string): number =>
  FLEET_CAROUSEL_SCALES[vehicleId] ?? 0.95;
