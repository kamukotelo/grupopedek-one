import type { VehicleDetail } from './fleetData';

import { FLYER_FLEET_2026 } from './fleetFlyer2026';

export type FleetVersion = 'original' | '2026' | 'flyer';

const ORIGINAL_FLEET_NAMES: Record<string, string> = {
  'rangerover-blindado-2025': 'Range Rover Vogue Blindado',
  'mercedes-class-s-2025': 'Mercedes Classe S 2025',
  'range-rover-novo-modelo': 'Range Rover Autobiography L460',
  'mercedes-g63-2023': 'Mercedes G63 2023',
  'lexus-600': 'Lexus 600',
  'mercedes-vito': 'Mercedes Vito',
  'mercedes-g63': 'Mercedes G63',
  'toyota-lc300-2023': 'Toyota LC300 Twin Turbo',
  'lexus-570': 'Lexus 570',
  'range-rover': 'Range Rover',
  'toyota-lc-v8-2021': 'Toyota LC V8 2021',
  'mercedes-cls63': 'Mercedes CLS63',
  'mercedes-brabus': 'Mercedes Brabus',
  'volvo-xc-60': 'Volvo XC60',
  'new-toyota-prado': 'Novo Toyota Prado',
  'nissan-patrol': 'Nissan Patrol',
  'toyota-prado-atual': 'Toyota Prado Atual',
  'toyota-fortuner-atual': 'Toyota Fortuner Atual',
  'toyota-fortuner-2023': 'Toyota Fortuner 2023',
  'mercedes-benz-v300-class': 'Mercedes-Benz V300 Class',
  'hyundai-staria-executiva': 'Hyundai Staria Executiva',
  'toyota-coaster': 'Toyota Coaster',
  'mercedes-sprinter-atual': 'Mercedes Sprinter Atual',
  'hyundai-staria-atual': 'Hyundai Staria Atual',
  'new-toyota-hiace': 'Nova Toyota Hiace',
  'hyundai-h1': 'Hyundai H1',
  'toyota-hiace': 'Toyota Hiace',
  'jetour-x70': 'Jetour X70',
  'hyundai-santa-fe': 'Hyundai Santa Fé',
  'hyundai-tucson': 'Hyundai Tucson',
  'chery-tiggo-7': 'Chery Tiggo 7',
  'chery-tiggo-2': 'Chery Tiggo 2',
  'hyundai-creta': 'Hyundai Creta',
  'toyota-lc-hz': 'Toyota LC HZ',
  'toyota-lc-hz-18p': 'Toyota LC HZ 18P',
  'mitsubishi-canter': 'Mitsubishi Canter',
  'mitsubishi-l200': 'Mitsubishi L200',
  'toyota-hilux': 'Toyota Hilux',
  'suzuki-swift': 'Suzuki Swift',
  'suzuki-baleno': 'Suzuki Baleno',
  'hyundai-i-20': 'Hyundai i20',
  'suzuki-spresso': 'Suzuki S-Presso',
  'toyota-starlet': 'Toyota Starlet',
  'hyundai-g-i10': 'Hyundai Grand i10',
  'kia-morning': 'Kia Morning',
  'suzuki-celerio': 'Suzuki Celerio',
  'limousine': 'Limousine',
  'chery-himla': 'Chery Himla',
  'jmc-touring': 'JMC Touring',
  'jac-sunray': 'JAC Sunray',
  'baw-m7': 'BAW M7'
};

export const getFleetForVersion = (fleet: VehicleDetail[], version: FleetVersion): VehicleDetail[] =>
  version === 'flyer'
    ? FLYER_FLEET_2026
    : version === '2026'
      ? fleet
      : fleet.map((vehicle) => ({
        ...vehicle,
        name: ORIGINAL_FLEET_NAMES[vehicle.id] ?? vehicle.name
      }));
