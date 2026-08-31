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
// (object-bottom) com a MESMA LARGURA renderizada (~80% da moldura — a
// largura é o que o olho usa para comparar o tamanho de um carro de perfil;
// a altura tem uma trava por cima para vans/camiões). Nunca cortam — nem o
// tejadilho no topo nem as rodas em baixo, mesmo no zoom do hover. Valores
// medidos da bounding-box opaca real de cada 01-oficial.webp por
// scripts/calc-fleet-card-scales.py.
const FLEET_IMAGE_SCALES: Record<string, number> = {
  'kia-morning': 1.1,
  'suzuki-celerio': 1.04,
  'hyundai-g-i10': 1.08,
  'hyundai-i-20': 1.16,
  'suzuki-spresso': 1.07,
  'suzuki-swift': 1.0,
  'toyota-starlet': 1.01,
  'suzuki-baleno': 1.05,
  'hyundai-creta': 1.01,
  'chery-tiggo-2': 1.0,
  'hyundai-tucson': 1.15,
  'kia-seltos': 1.0,
  'chery-tiggo-7': 1.1,
  'hyundai-santa-fe': 1.15,
  'mitsubishi-canter': 0.96,
  'toyota-hilux': 1.01,
  'mitsubishi-l200': 1.01,
  'jetour-x70': 1.04,
  'toyota-fortuner-2023': 1.02,
  'toyota-lc-hz-18p': 0.91,
  'toyota-lc-hz': 1.0,
  'toyota-prado-atual': 1.1,
  'volvo-xc-60': 1.17,
  'hyundai-h1': 1.01,
  'hyundai-staria-atual': 1.05,
  'new-toyota-hiace': 1.02,
  'mercedes-sprinter-atual': 1.0,
  'nissan-patrol': 0.98,
  'new-toyota-prado': 1.15,
  'mercedes-brabus': 0.92,
  'mercedes-cls63': 1.01,
  'toyota-coaster': 1.0,
  'hyundai-staria-executiva': 1.04,
  'toyota-lc-v8-2021': 0.98,
  'range-rover': 1.1,
  'lexus-570': 1.15,
  'toyota-lc300-2023': 1.08,
  'mercedes-g63-2023': 1.01,
  'mercedes-vito': 0.95,
  'mercedes-benz-v300-class': 0.98,
  'mercedes-g63': 1.15,
  'lexus-600': 1.01,
  'limousine': 0.93,
  'range-rover-novo-modelo': 1.16,
  'mercedes-class-s-2025': 1.01,
  'rangerover-blindado-2025': 1.44,
  'chery-himla': 1.17,
  'jac-sunray': 1.05,
  'baw-m7': 1.03,
  'jmc-touring': 1.01,
  'toyota-hiace': 1.02,
};

export const getFleetImageScale = (vehicleId: string): number =>
  FLEET_IMAGE_SCALES[vehicleId] ?? 1.0;

// Alguns recortes oficiais deixam a viatura a "flutuar" (muita margem
// transparente em baixo). Com object-bottom isso afastava o carro da base do
// card; este deslocamento empurra-o só o necessário para as rodas encostarem
// à base, sem nunca cortar o tejadilho. Medido por scripts/calc-fleet-card-scales.py.
const FLEET_IMAGE_OFFSET_Y: Record<string, string> = {
  'kia-morning': '8%',
  'suzuki-celerio': '7%',
  'hyundai-g-i10': '9%',
  'hyundai-i-20': '20%',
  'suzuki-spresso': '4%',
  'suzuki-swift': '6%',
  'toyota-starlet': '6%',
  'suzuki-baleno': '8%',
  'hyundai-creta': '10%',
  'chery-tiggo-2': '3%',
  'hyundai-tucson': '15%',
  'kia-seltos': '7%',
  'chery-tiggo-7': '1%',
  'hyundai-santa-fe': '13%',
  'toyota-hilux': '8%',
  'mitsubishi-l200': '8%',
  'jetour-x70': '7%',
  'toyota-fortuner-2023': '9%',
  'toyota-lc-hz': '8%',
  'toyota-prado-atual': '14%',
  'volvo-xc-60': '17%',
  'hyundai-h1': '10%',
  'hyundai-staria-atual': '10%',
  'new-toyota-hiace': '4%',
  'mercedes-sprinter-atual': '4%',
  'nissan-patrol': '4%',
  'new-toyota-prado': '11%',
  'mercedes-brabus': '6%',
  'mercedes-cls63': '12%',
  'toyota-coaster': '2%',
  'hyundai-staria-executiva': '10%',
  'toyota-lc-v8-2021': '4%',
  'range-rover': '8%',
  'lexus-570': '14%',
  'toyota-lc300-2023': '3%',
  'mercedes-g63-2023': '5%',
  'mercedes-vito': '1%',
  'mercedes-g63': '9%',
  'lexus-600': '8%',
  'range-rover-novo-modelo': '16%',
  'mercedes-class-s-2025': '12%',
  'rangerover-blindado-2025': '29%',
  'chery-himla': '10%',
  'jac-sunray': '5%',
  'baw-m7': '7%',
  'jmc-touring': '5%',
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
