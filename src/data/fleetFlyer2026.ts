import { FLEET_DATABASE, type VehicleDetail } from './fleetData';

type FlyerVehicle = {
  id: string;
  name: string;
  fullDay: number;
  transfer: number;
  image: string;
};

const formatAOA = (value: number): string =>
  `${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} Kz`;

const FLYER_VEHICLES: FlyerVehicle[] = [
  { id: 'kia-morning', name: 'Kia Morning', fullDay: 49999, transfer: 37499, image: 'kia-morning' },
  { id: 'suzuki-celerio', name: 'Suzuki Celerio', fullDay: 49999, transfer: 37499, image: 'suzuki-celerio' },
  { id: 'hyundai-g-i10', name: 'Hyundai Grand i10', fullDay: 59999, transfer: 44999, image: 'hyundai-grand-i10' },
  { id: 'hyundai-i-20', name: 'Hyundai i20', fullDay: 59999, transfer: 44999, image: 'hyundai-i20' },
  { id: 'suzuki-spresso', name: 'Suzuki S-Presso', fullDay: 59999, transfer: 44999, image: 'suzuki-s-presso' },
  { id: 'suzuki-swift', name: 'Suzuki Swift', fullDay: 69999, transfer: 52499, image: 'suzuki-swift' },
  { id: 'toyota-starlet', name: 'Toyota Starlet', fullDay: 79999, transfer: 59999, image: 'toyota-starlet' },
  { id: 'suzuki-baleno', name: 'Suzuki Baleno', fullDay: 79999, transfer: 59999, image: 'suzuki-baleno' },
  { id: 'hyundai-creta', name: 'Hyundai Creta', fullDay: 139999, transfer: 97999, image: 'hyundai-creta' },
  { id: 'chery-tiggo-2', name: 'Chery Tiggo 2', fullDay: 145999, transfer: 102999, image: 'chery-tiggo-2' },
  { id: 'hyundai-tucson', name: 'Hyundai Tucson', fullDay: 149999, transfer: 104999, image: 'hyundai-tucson' },
  { id: 'kia-seltos', name: 'Kia Seltos', fullDay: 149999, transfer: 104999, image: 'kia-seltos' },
  { id: 'chery-tiggo-7', name: 'Chery Tiggo 7 Pro Max', fullDay: 159999, transfer: 111999, image: 'chery-tiggo-7-pro-max' },
  { id: 'hyundai-santa-fe', name: 'Hyundai Santa Fé', fullDay: 159999, transfer: 111999, image: 'hyundai-santa-fe' },
  { id: 'mitsubishi-canter', name: 'Mitsubishi Canter', fullDay: 169999, transfer: 118999, image: 'mitsubishi-canter' },
  { id: 'toyota-hilux', name: 'Toyota Hilux', fullDay: 189999, transfer: 132999, image: 'toyota-hilux' },
  { id: 'mitsubishi-l200', name: 'Mitsubishi L200', fullDay: 189999, transfer: 132999, image: 'mitsubishi-l200' },
  { id: 'jetour-x70', name: 'Jetour X70', fullDay: 229999, transfer: 160999, image: 'jetour-x70' },
  { id: 'toyota-fortuner-2023', name: 'Toyota Fortuner 2023', fullDay: 249999, transfer: 174999, image: 'toyota-fortuner-2023' },
  { id: 'toyota-lc-hz-18p', name: 'Toyota LC HZ 18P', fullDay: 259999, transfer: 181999, image: 'toyota-lc-hz-18p' },
  { id: 'toyota-lc-hz', name: 'Toyota LC HZ', fullDay: 289999, transfer: 202999, image: 'toyota-lc-hz' },
  { id: 'toyota-prado-atual', name: 'Toyota Prado 2023', fullDay: 289999, transfer: 202999, image: 'toyota-prado-2023' },
  { id: 'volvo-xc-60', name: 'Volvo XC60', fullDay: 349999, transfer: 244999, image: 'volvo-xc60' },
  { id: 'hyundai-h1', name: 'Hyundai H1', fullDay: 349999, transfer: 262499, image: 'hyundai-h1' },
  { id: 'hyundai-staria-atual', name: 'Hyundai Staria Atual', fullDay: 359999, transfer: 269999, image: 'hyundai-staria-atual' },
  { id: 'new-toyota-hiace', name: 'Nova Toyota Hiace', fullDay: 369999, transfer: 277500, image: 'nova-toyota-hiace' },
  { id: 'mercedes-sprinter-atual', name: 'Mercedes Sprinter Atual', fullDay: 369999, transfer: 277500, image: 'mercedes-sprinter-atual' },
  { id: 'nissan-patrol', name: 'Nissan Patrol', fullDay: 399999, transfer: 279999, image: 'nissan-patrol' },
  { id: 'new-toyota-prado', name: 'Novo Toyota Prado', fullDay: 399999, transfer: 279999, image: 'novo-toyota-prado' },
  { id: 'mercedes-brabus', name: 'Mercedes Brabus', fullDay: 399999, transfer: 299999, image: 'mercedes-brabus' },
  { id: 'mercedes-cls63', name: 'Mercedes CLS63', fullDay: 399999, transfer: 299999, image: 'mercedes-cls63' },
  { id: 'toyota-coaster', name: 'Toyota Coaster', fullDay: 399999, transfer: 299999, image: 'toyota-coaster' },
  { id: 'hyundai-staria-executiva', name: 'Hyundai Staria Executiva', fullDay: 450999, transfer: 337500, image: 'hyundai-staria-executiva' },
  { id: 'toyota-lc-v8-2021', name: 'Toyota LC V8 2021', fullDay: 499999, transfer: 374999, image: 'toyota-lc-v8-2021' },
  { id: 'range-rover', name: 'Range Rover', fullDay: 499999, transfer: 374999, image: 'range-rover' },
  { id: 'lexus-570', name: 'Lexus 570', fullDay: 500999, transfer: 375000, image: 'lexus-570' },
  { id: 'toyota-lc300-2023', name: 'Toyota LC300 2023', fullDay: 599999, transfer: 499999, image: 'toyota-lc300-2023' },
  { id: 'mercedes-g63-2023', name: 'Mercedes G63', fullDay: 599999, transfer: 499999, image: 'mercedes-g63' },
  { id: 'mercedes-vito', name: 'Mercedes Viano', fullDay: 799999, transfer: 599999, image: 'mercedes-viano' },
  { id: 'mercedes-benz-v300-class', name: 'Mercedes-Benz V300 Class', fullDay: 800999, transfer: 599999, image: 'mercedes-v300-class' },
  { id: 'mercedes-g63', name: 'Mercedes G63 Atual', fullDay: 999999, transfer: 749999, image: 'mercedes-g63-atual' },
  { id: 'lexus-600', name: 'Lexus 600', fullDay: 999999, transfer: 749999, image: 'lexus-600' },
  { id: 'limousine', name: 'Limousine', fullDay: 999999, transfer: 749999, image: 'limousine' },
  { id: 'range-rover-novo-modelo', name: 'Range Rover Novo Modelo', fullDay: 1449999, transfer: 1087499, image: 'range-rover-novo-modelo' },
  { id: 'mercedes-class-s-2025', name: 'Mercedes Classe S 2025', fullDay: 1449999, transfer: 1087499, image: 'mercedes-classe-s-2025' },
  { id: 'rangerover-blindado-2025', name: 'Range Rover Blindado 2025', fullDay: 1999999, transfer: 1499999, image: 'range-rover-blindado-2025' }
];

const fleetById = new Map(FLEET_DATABASE.map((vehicle) => [vehicle.id, vehicle]));
const kiaSeltosTemplate = fleetById.get('hyundai-tucson');

export const FLYER_FLEET_2026: VehicleDetail[] = FLYER_VEHICLES.map((entry) => {
  const source = fleetById.get(entry.id) ?? kiaSeltosTemplate;
  if (!source) throw new Error(`Viatura-base não encontrada para ${entry.id}`);

  const primaryImage = `/fleet-flyer-2026/${entry.image}/01-oficial.webp`;
  const isKiaSeltos = entry.id === 'kia-seltos';

  return {
    ...source,
    id: entry.id,
    slug: entry.id,
    name: entry.name,
    brand: isKiaSeltos ? 'Kia' : source.brand,
    model: isKiaSeltos ? 'Seltos' : source.model,
    badge: 'Catálogo oficial 2026',
    pricePerDayAOA: entry.fullDay,
    pricePerDayFormatted: formatAOA(entry.fullDay),
    transferPriceAOA: entry.transfer,
    transferPriceFormatted: formatAOA(entry.transfer),
    primaryImage,
    secondaryImage: undefined,
    visualCollection: 'flyer',
    gallery: [{
      url: primaryImage,
      caption: 'Imagem oficial do catálogo PEPEK Rent A Car 2026',
      altText: `${entry.name} - catálogo oficial PEPEK 2026`,
      type: 'exterior_front'
    }]
  };
});

