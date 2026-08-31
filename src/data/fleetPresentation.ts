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
// (moldura 16/9, object-bottom) com a MESMA LARGURA renderizada (~80% da
// moldura — a largura é o que o olho usa para comparar o tamanho de um carro
// de perfil). Há ainda um "piso" de altura (>=50%) que dá presença às
// carroçarias baixas (limousine, Brabus, sedans) e uma trava por cima
// (<=92%) + folga de tejadilho para vans/citadinos altos. Nunca cortam, nem
// no zoom do hover. Medido da bounding-box opaca real de cada 01-oficial.webp
// e afinado no browser — ver scripts/calc-fleet-card-scales.py.
const FLEET_IMAGE_SCALES: Record<string, number> = {
  'kia-morning': 1.19,
  'suzuki-celerio': 1.13,
  'hyundai-g-i10': 1.18,
  'hyundai-i-20': 1.22,
  'suzuki-spresso': 1.08,
  'suzuki-swift': 1.09,
  'toyota-starlet': 1.11,
  'suzuki-baleno': 1.15,
  'hyundai-creta': 1.1,
  'chery-tiggo-2': 1.05,
  'hyundai-tucson': 1.23,
  'kia-seltos': 1.09,
  'chery-tiggo-7': 1.16,
  'hyundai-santa-fe': 1.2,
  'mitsubishi-canter': 1.05,
  'toyota-hilux': 1.1,
  'mitsubishi-l200': 1.1,
  'jetour-x70': 1.13,
  'toyota-fortuner-2023': 1.11,
  'toyota-lc-hz-18p': 0.96,
  'toyota-lc-hz': 1.09,
  'toyota-prado-atual': 1.15,
  'volvo-xc-60': 1.25,
  'hyundai-h1': 1.1,
  'hyundai-staria-atual': 1.14,
  'new-toyota-hiace': 1.11,
  'mercedes-sprinter-atual': 1.06,
  'nissan-patrol': 1.03,
  'new-toyota-prado': 1.17,
  'mercedes-brabus': 0.97,
  'mercedes-cls63': 1.11,
  'toyota-coaster': 1.09,
  'hyundai-staria-executiva': 1.13,
  'toyota-lc-v8-2021': 1.07,
  'range-rover': 1.18,
  'lexus-570': 1.21,
  'toyota-lc300-2023': 1.13,
  'mercedes-g63-2023': 1.11,
  'mercedes-vito': 1.0,
  'mercedes-benz-v300-class': 1.03,
  'mercedes-g63': 1.18,
  'lexus-600': 1.11,
  'limousine': 1.08,
  'range-rover-novo-modelo': 1.25,
  'mercedes-class-s-2025': 1.1,
  'rangerover-blindado-2025': 1.22,
  'chery-himla': 1.21,
  'jac-sunray': 1.1,
  'baw-m7': 1.12,
  'jmc-touring': 1.09,
  'toyota-hiace': 1.11,
};

export const getFleetImageScale = (vehicleId: string): number =>
  FLEET_IMAGE_SCALES[vehicleId] ?? 1.1;

// Alguns recortes oficiais deixam a viatura a "flutuar" (muita margem
// transparente em baixo). Com object-bottom isso afastava o carro da base do
// card; este deslocamento empurra-o só o necessário para as rodas encostarem
// à base, sem nunca cortar o tejadilho. Medido por scripts/calc-fleet-card-scales.py.
const FLEET_IMAGE_OFFSET_Y: Record<string, string> = {
  'kia-morning': '9%',
  'suzuki-celerio': '8%',
  'hyundai-g-i10': '11%',
  'hyundai-i-20': '23%',
  'suzuki-spresso': '5%',
  'suzuki-swift': '8%',
  'toyota-starlet': '7%',
  'suzuki-baleno': '10%',
  'hyundai-creta': '12%',
  'chery-tiggo-2': '4%',
  'hyundai-tucson': '17%',
  'kia-seltos': '8%',
  'chery-tiggo-7': '1%',
  'hyundai-santa-fe': '14%',
  'mitsubishi-canter': '1%',
  'toyota-hilux': '10%',
  'mitsubishi-l200': '10%',
  'jetour-x70': '8%',
  'toyota-fortuner-2023': '10%',
  'toyota-lc-hz': '9%',
  'toyota-prado-atual': '16%',
  'volvo-xc-60': '19%',
  'hyundai-h1': '12%',
  'hyundai-staria-atual': '12%',
  'new-toyota-hiace': '5%',
  'new-toyota-prado': '5%',
  'mercedes-sprinter-atual': '4%',
  'nissan-patrol': '5%',
  'mercedes-g63': '5%',
  'mercedes-brabus': '7%',
  'mercedes-cls63': '15%',
  'toyota-coaster': '2%',
  'hyundai-staria-executiva': '12%',
  'toyota-lc-v8-2021': '5%',
  'range-rover': '6%',
  'lexus-570': '15%',
  'toyota-lc300-2023': '3%',
  'mercedes-g63-2023': '6%',
  'mercedes-vito': '2%',
  'mercedes-benz-v300-class': '1%',
  'lexus-600': '10%',
  'range-rover-novo-modelo': '18%',
  'mercedes-class-s-2025': '14%',
  'rangerover-blindado-2025': '11%',
  'chery-himla': '12%',
  'jac-sunray': '6%',
  'baw-m7': '8%',
  'jmc-touring': '7%',
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
