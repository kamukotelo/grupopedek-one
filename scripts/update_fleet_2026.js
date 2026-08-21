import fs from 'fs';

const filePath = '/Users/nsungukamukotelo/grupopedek-one/src/data/fleetData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Define customized vehicle enrichments for 2026/2027
const vehicleUpdates = {
  'rangerover-blindado-2025': {
    name: 'Range Rover Blindado 2026/2027',
    year: '2026',
    badge: 'Blindado 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-class-s-2025': {
    name: 'Mercedes Classe S 2026/2027',
    year: '2026',
    badge: 'Presidencial 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85'
  },
  'range-rover-novo-modelo': {
    name: 'Range Rover Autobiography 2026',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-g63-2023': {
    name: 'Mercedes-AMG G63 2026',
    year: '2026',
    badge: 'AMG Performance 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1600&q=85'
  },
  'lexus-600': {
    name: 'Lexus LX 600 VIP 2026',
    year: '2026',
    badge: 'VIP Imperial 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-vito': {
    name: 'Mercedes Vito Tourer 2026',
    year: '2026',
    badge: '9 Lugares VIP 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-g63': {
    name: 'Mercedes G63 AMG 2025/2026',
    year: '2025',
    badge: 'AMG Clássico 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-lc300-2023': {
    name: 'Toyota Land Cruiser 300 V6 2026',
    year: '2026',
    badge: 'Líder 4x4 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1600&q=85'
  },
  'lexus-570': {
    name: 'Lexus LX 570 Luxury 2025/2026',
    year: '2025',
    badge: 'V8 Potência 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85'
  },
  'range-rover': {
    name: 'Range Rover Vogue 2025/2026',
    year: '2025',
    badge: 'Luxo Clássico 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-lc-v8-2021': {
    name: 'Toyota LC V8 2025/2026',
    year: '2025',
    badge: 'Lendário V8 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-cls63': {
    name: 'Mercedes CLS63 AMG 2025/2026',
    year: '2025',
    badge: 'Coupé Desportivo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-brabus': {
    name: 'Mercedes Brabus Edition 2026',
    year: '2026',
    badge: 'Edição Exclusiva 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85'
  },
  'volvo-xc-60': {
    name: 'Volvo XC60 Ultimate 2026',
    year: '2026',
    badge: 'Híbrido Luxo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },
  'new-toyota-prado': {
    name: 'Novo Toyota Land Cruiser Prado 250 (2026)',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85'
  },
  'nissan-patrol': {
    name: 'Novo Nissan Patrol Y63 (2026/2027)',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-prado-atual': {
    name: 'Toyota Prado TXL 2025/2026',
    year: '2025',
    badge: 'Executivo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-fortuner-atual': {
    name: 'Toyota Fortuner VX 2026',
    year: '2026',
    badge: 'Versátil 4x4 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-fortuner-2023': {
    name: 'Toyota Fortuner 2025/2026',
    year: '2025',
    badge: 'Robustez 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85'
  },

  // 2. VANS & MINIBUS
  'mercedes-benz-v300-class': {
    name: 'Mercedes-Benz V300d Exclusive 2026',
    year: '2026',
    badge: 'VIP JetVan 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-staria-executiva': {
    name: 'Hyundai Staria Lounge VIP 2026',
    year: '2026',
    badge: 'Futurista VIP 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-coaster': {
    name: 'Toyota Coaster Executive 2026',
    year: '2026',
    badge: '30 Lugares 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },
  'mercedes-sprinter-atual': {
    name: 'Mercedes Sprinter VIP Shuttle 2026',
    year: '2026',
    badge: 'VIP Shuttle 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-staria-atual': {
    name: 'Hyundai Staria Minibus 2026',
    year: '2026',
    badge: '11 Lugares 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },
  'new-toyota-hiace': {
    name: 'Toyota HiAce Super Grandia 2026',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-h1': {
    name: 'Hyundai H-1 Royale 2025/2026',
    year: '2025',
    badge: '12 Lugares 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-hiace': {
    name: 'Toyota HiAce Commuter 2025/2026',
    year: '2025',
    badge: '15 Lugares 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85'
  },

  // 3. SUVS
  'jetour-x70': {
    name: 'Jetour X70 Plus / T2 2026',
    year: '2026',
    badge: 'Modelo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-santa-fe': {
    name: 'Novo Hyundai Santa Fe Calligraphy 2026',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-tucson': {
    name: 'Hyundai Tucson N-Line 2026',
    year: '2026',
    badge: 'Modelo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },
  'chery-tiggo-7': {
    name: 'Chery Tiggo 7 Pro Max 2026',
    year: '2026',
    badge: 'Modelo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },
  'chery-tiggo-2': {
    name: 'Chery Tiggo 2 Pro 2025/2026',
    year: '2025',
    badge: 'Crossover 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-creta': {
    name: 'Hyundai Creta Smart 2026',
    year: '2026',
    badge: 'Modelo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85'
  },

  // 4. PICKUPS & 4X4
  'toyota-lc-hz': {
    name: 'Toyota Land Cruiser HZJ79 2026',
    year: '2026',
    badge: 'Heavy Duty 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-lc-hz-18p': {
    name: 'Toyota Land Cruiser 70 Troopy 2026',
    year: '2026',
    badge: '18 Lugares 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85'
  },
  'mitsubishi-canter': {
    name: 'Mitsubishi Fuso Canter 2026',
    year: '2026',
    badge: 'Carga Pesada 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85'
  },
  'mitsubishi-l200': {
    name: 'Nova Mitsubishi L200 Triton Athlete 2026',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-hilux': {
    name: 'Nova Toyota Hilux GR Sport 2026',
    year: '2026',
    badge: 'Líder Offroad 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1559416523-140ddc3d2a88?auto=format&fit=crop&w=1600&q=85'
  },

  // 5. ECONÓMICOS
  'suzuki-swift': {
    name: 'Novo Suzuki Swift GLX 2026',
    year: '2026',
    badge: 'Nova Geração 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'suzuki-baleno': {
    name: 'Suzuki Baleno GLX 2026',
    year: '2026',
    badge: 'Económico 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-i-20': {
    name: 'Hyundai i20 Premium 2026',
    year: '2026',
    badge: 'Modelo 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'suzuki-spresso': {
    name: 'Suzuki S-Presso GL 2026',
    year: '2026',
    badge: 'Urbano 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'toyota-starlet': {
    name: 'Toyota Starlet Cross 2026',
    year: '2026',
    badge: 'Novo Crossover 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'hyundai-g-i10': {
    name: 'Hyundai Grand i10 Sedan 2026',
    year: '2026',
    badge: 'Económico 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'kia-morning': {
    name: 'Kia Picanto Morning 2026',
    year: '2026',
    badge: 'Compacto 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },
  'suzuki-celerio': {
    name: 'Suzuki Celerio GL 2026',
    year: '2026',
    badge: 'Económico 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85'
  },

  // 6. EVENTOS
  'limousine': {
    name: 'Limousine Presidencial / Gala 2026',
    year: '2026',
    badge: 'Exclusivo Gala 2026',
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    exteriorImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=85'
  }
};

for (const [id, update] of Object.entries(vehicleUpdates)) {
  const idRegex = new RegExp(`id:\\s*'${id}'[\\s\\S]*?\\n\\s*\\},`, 'g');
  content = content.replace(idRegex, (match) => {
    let updated = match;
    if (update.name) {
      updated = updated.replace(/name:\s*'[^']+'/, `name: '${update.name}'`);
    }
    if (update.year) {
      updated = updated.replace(/year:\s*'[^']+'/, `year: '${update.year}'`);
    }
    if (update.badge) {
      updated = updated.replace(/badge:\s*'[^']+'/, `badge: '${update.badge}'`);
    }
    if (update.secondaryImage) {
      updated = updated.replace(/secondaryImage:\s*'[^']+'/, `secondaryImage: '${update.secondaryImage}'`);
    }
    if (update.interiorImage) {
      updated = updated.replace(/(gallery:\s*\[[\s\S]*?url:\s*')[^']+(\'[\s\S]*?Cabine)/, `$1${update.interiorImage}$2`);
    }
    if (update.exteriorImage) {
      updated = updated.replace(/(url:\s*')[^']+(\'[\s\S]*?Perfil de Estrada)/, `$1${update.exteriorImage}$2`);
    }
    return updated;
  });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated fleetData.ts with 2026/2027 models, HD interior and exterior images!');
