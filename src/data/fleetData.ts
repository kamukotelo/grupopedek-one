export type VehicleCategory =
  | 'luxo'
  | 'vans'
  | 'suvs'
  | 'pickups'
  | 'economicos'
  | 'eventos';

export interface VehicleDetail {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year?: string;
  category: VehicleCategory;
  categoryLabel: string;
  badge?: string;
  availabilityTag?: 'Disponível' | 'Sob Consulta' | 'Prontidão';
  isAvailable: boolean;
  isArmored?: boolean;
  isFeatured?: boolean;
  pricePerDayAOA: number;
  pricePerDayFormatted: string;
  transferPriceAOA?: number;
  transferPriceFormatted?: string;
  visualCollection?: 'standard' | 'flyer';
  depositAOA?: number;
  description: string;
  primaryImage: string;
  secondaryImage?: string;
  gallery: Array<{
    url: string;
    caption: string;
    altText: string;
    type?: 'exterior_front' | 'exterior_side' | 'interior' | 'detail' | 'context';
  }>;
  specs: {
    color: string;
    passengers: number;
    doors: number;
    luggage: number;
    transmission: 'Automática' | 'Manual' | 'Automática / Manual';
    fuelType: 'Gasolina' | 'Diesel' | 'Gasolina / Diesel';
    tankCapacity?: string;
    traction?: string;
    engine?: string;
    airConditioning: boolean;
  };
  features: string[];
  inclusions: string[];
  recommendedFor: string[];
  inconsistentDataNote?: string;
}

export const FLEET_DATABASE: VehicleDetail[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. LUXO E EXECUTIVO (19 Veículos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'rangerover-blindado-2025',
    slug: 'rangerover-blindado-2025',
    name: 'Range Rover Vogue Blindado',
    brand: 'Land Rover',
    model: 'Range Rover Vogue Blindado',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Blindado 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isArmored: true,
    isFeatured: true,
    pricePerDayAOA: 1999999,
    pricePerDayFormatted: '1.999.999 Kz',
    transferPriceAOA: 1499999,
    transferPriceFormatted: '1.499.999 Kz',
    depositAOA: 500000,
    description: 'Veículo de alta segurança com blindagem balística de nível internacional, conforto supremo e tecnologia de ponta para transporte de altas individualidades e delegações diplomáticas em Angola.',
    primaryImage: '/fleet-flyer-2026/range-rover-blindado-2025/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/range-rover-blindado-2025/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'rangerover-blindado-2025 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'rangerover-blindado-2025 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'rangerover-blindado-2025 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '90 L',
      traction: '4WD Inteligente',
      engine: '4.4L Twin-Turbo V8 (530 CV)',
      airConditioning: true
    },
    features: ['Blindagem Balística Certificada', 'Pneus Run-Flat Anti-Furo', 'Suspensão Pneumática Eletrónica', 'Vidros Escurecidos de Alta Segurança', 'Sistema de Comunicação Satelital'],
    inclusions: ['Seguro VIP de Cobertura Total', 'Motorista de segurança diplomática incluído (sob pedido)', 'Higienização e selagem hospitalar', 'Substituição prioritária em <30 min'],
    recommendedFor: ['Chefes de Estado e Embaixadores', 'CEOs e Quadros Executivos de Multinacionais', 'Visitas Diplomáticas e Cimeiras Internacionais']
  },
  {
    id: 'mercedes-class-s-2025',
    slug: 'mercedes-class-s-2025',
    name: 'Mercedes Classe S 2026/2027',
    brand: 'Mercedes-Benz',
    model: 'Classe S',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Presidencial 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 1449999,
    pricePerDayFormatted: '1.449.999 Kz',
    transferPriceAOA: 1087499,
    transferPriceFormatted: '1.087.499 Kz',
    depositAOA: 400000,
    description: 'O padrão de luxo global por excelência. Equipado com bancos traseiros reclináveis tipo Lounge, iluminação ambiente ativa e suspensão inteligente AIRMATIC que anula qualquer imperfeição da via.',
    primaryImage: '/fleet-flyer-2026/mercedes-classe-s-2025/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-classe-s-2025/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-class-s-2025 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-class-s-2025 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-class-s-2025 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '76 L',
      traction: '4MATIC Tração Integral',
      engine: '3.0L Turbo 6 Cilindros em Linha',
      airConditioning: true
    },
    features: ['Bancos Traseiros First-Class Reclináveis', 'Som Burmester High-End 4D', 'MBUX Traseiro com Tablets', 'Portas com Fecho Suave Soft-Close'],
    inclusions: ['Seguro contra Todos os Riscos', 'Motorista de protocolo bilingue fardado', 'Água e toalhetes de cortesia'],
    recommendedFor: ['Recepções de Estado', 'Embaixadores e Ministros', 'Eventos de Gala e Cerimónias']
  },
  {
    id: 'range-rover-novo-modelo',
    slug: 'range-rover-novo-modelo',
    name: 'Range Rover Autobiography 2026',
    brand: 'Land Rover',
    model: 'Range Rover Autobiography 2026',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 1449999,
    pricePerDayFormatted: '1.449.999 Kz',
    transferPriceAOA: 1087499,
    transferPriceFormatted: '1.087.499 Kz',
    depositAOA: 400000,
    description: 'A mais recente geração do ícone de luxo britânico. Design minimalista exterior e requinte artesanal no habitáculo com tração integral e capacidade de cruzeiro inigualável.',
    primaryImage: '/fleet-flyer-2026/range-rover-novo-modelo/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/range-rover-novo-modelo/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'range-rover-novo-modelo vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'range-rover-novo-modelo interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'range-rover-novo-modelo em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '90 L',
      traction: 'All-Wheel Drive iAWD',
      airConditioning: true
    },
    features: ['Ecrã Táctil Curvo Pivi Pro 13.1"', 'Bancos em Pele Windsor Aquecidos/Ventilados', 'Cancelamento Ativo de Ruído na Cabine'],
    inclusions: ['Seguro Total VIP', 'Assistência 24/7 em Luanda e arredores', 'Limpeza e preparação personalizada'],
    recommendedFor: ['Investidores Internacionais', 'CEOs e Quadros de Administração', 'Transfers de Luxo']
  },
  {
    id: 'mercedes-g63-2023',
    slug: 'mercedes-g63-2023',
    name: 'Mercedes G63 2023',
    brand: 'Mercedes-Benz',
    model: 'G63 AMG',
    year: '2023',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'AMG Performance 2023',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    transferPriceAOA: 449999,
    transferPriceFormatted: '449.999 Kz',
    depositAOA: 350000,
    description: 'O todo-terreno mais desejado do mundo. Motor 4.0L V8 Biturbo AMG com aceleração estonteante e presença cénica imponente para eventos de prestígio.',
    primaryImage: '/fleet-flyer-2026/mercedes-g63/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-g63/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-g63-2023 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-g63-2023 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-g63-2023 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Laranja',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '100 L',
      traction: 'AMG Performance 4MATIC 4x4',
      engine: '4.0L V8 Biturbo (585 CV)',
      airConditioning: true
    },
    features: ['Escape Desportivo AMG com Válvula Ativa', 'Interior em Pele Designo', '3 Bloqueios de Diferencial 100%'],
    inclusions: ['Seguro de Danos Próprios VIP', 'Despacho com viatura selada', 'Motorista de segurança disponível'],
    recommendedFor: ['Personalidades e Celebridades', 'Eventos VIP e Produções', 'Condução de Prestígio']
  },
  {
    id: 'lexus-600',
    slug: 'lexus-600',
    name: 'Lexus LX 600 VIP 2026',
    brand: 'Lexus',
    model: 'LX 600',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'VIP Imperial 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 800000,
    pricePerDayFormatted: '800.000 Kz',
    transferPriceAOA: 600000,
    transferPriceFormatted: '600.000 Kz',
    depositAOA: 300000,
    description: 'O SUV topo de gama japonês com fiabilidade inabalável e refinamento artesanal Takumi. 7 lugares amplos e suspensão hidráulica adaptativa para viagens confortáveis.',
    primaryImage: '/fleet-flyer-2026/lexus-600/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/lexus-600/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'lexus-600 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'lexus-600 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'lexus-600 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 7,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '80 L',
      traction: 'Full-Time 4WD',
      airConditioning: true
    },
    features: ['Som Mark Levinson Reference 3D', 'Bancos Reclináveis com Memória', 'Controlo de Altura Ativo AHC'],
    inclusions: ['Seguro Total', 'Motorista bilingue opcional', 'Suporte 24h'],
    recommendedFor: ['Famílias Diplomáticas', 'Executivos de Topo', 'Transfers de Aeroporto']
  },
  {
    id: 'mercedes-vito',
    slug: 'mercedes-vito',
    name: 'Mercedes Vito Tourer 2026',
    brand: 'Mercedes-Benz',
    model: 'Vito Executiva',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: '9 Lugares VIP 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    depositAOA: 250000,
    description: 'Transporte executivo espaçoso para 9 ocupantes com poltronas ergonómicas individuais, ar condicionado traseiro reforçado e espaço generoso para bagagens.',
    primaryImage: '/rent_car/MERCEDES-f-300x300.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/rent_car/MERCEDES-f-300x300.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-vito vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-vito interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-vito em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 9,
      doors: 3,
      luggage: 8,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '100 L',
      traction: 'Traseira / 4MATIC',
      airConditioning: true
    },
    features: ['Porta Lateral Deslizante com Assistência', 'Tomadas USB para Passageiros', 'Bancos Modulares em Pele'],
    inclusions: ['Seguro Completo', 'Motorista de protocolo incluído', 'Franquia reduzida'],
    recommendedFor: ['Comitivas Oficiais', 'Transfers Corporativos', 'Equipas Técnicas em Luanda']
  },
  {
    id: 'mercedes-g63',
    slug: 'mercedes-g63',
    name: 'Mercedes G63 AMG 2025/2026',
    brand: 'Mercedes-Benz',
    model: 'G63',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'AMG Clássico 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    depositAOA: 250000,
    description: 'A clássica força bruta e estatuto do Classe G em configuração diesel robusta e económica com interior em pele e suspensão adaptativa.',
    primaryImage: '/fleet-flyer-2026/mercedes-g63-atual/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-g63-atual/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-g63 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-g63 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-g63 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática',
      fuelType: 'Diesel',
      tankCapacity: '100 L',
      airConditioning: true
    },
    features: ['Tracção Integral 4x4', 'Bancos Desportivos em Pele', 'Sensores e Câmara 360°'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência Técnica 24h'],
    recommendedFor: ['Deslocações Urbanas de Prestígio', 'Eventos e Protocolo']
  },
  {
    id: 'toyota-lc300-2023',
    slug: 'toyota-lc300-2023',
    name: 'Toyota LC300 2026',
    brand: 'Toyota',
    model: 'Land Cruiser 300',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Líder 4x4 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    transferPriceAOA: 449999,
    transferPriceFormatted: '449.999 Kz',
    depositAOA: 250000,
    description: 'O topo da frota governamental e diplomática em Angola. Motor 3.3L Twin-Turbo Diesel de 304 CV com suspensão Kinetic Dynamic e 7 lugares de absoluto luxo.',
    primaryImage: '/fleet-flyer-2026/toyota-lc300-2023/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-lc300-2023/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-lc300-2023 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-lc300-2023 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-lc300-2023 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 7,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Diesel',
      tankCapacity: '110 L',
      traction: '4WD Permanente Multi-Terrain',
      engine: '3.3L V6 Twin-Turbo Diesel (304 CV)',
      airConditioning: true
    },
    features: ['Climatização Quad-Zone com Saídas Traseiras', 'Frigorífico na Consola Central', 'Câmara de Visão 360°', 'Suspensão Adaptativa KDSS'],
    inclusions: ['Seguro Total com Cobertura Completa', 'Motorista bilingue de protocolo', 'Substituição garantida em <45 min'],
    recommendedFor: ['Embaixadas e Ministérios', 'Transfers de Estado', 'Viagens Longas com Conforto Supremo']
  },
  {
    id: 'lexus-570',
    slug: 'lexus-570',
    name: 'Lexus LX 570 Luxury 2025/2026',
    brand: 'Lexus',
    model: 'LX 570',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'V8 Potência 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 550000,
    pricePerDayFormatted: '550.000 Kz',
    transferPriceAOA: 412500,
    transferPriceFormatted: '412.500 Kz',
    depositAOA: 200000,
    description: 'SUV de prestígio clássico com lendário motor 5.7L V8 naturalmente aspirado, interior artesanal e suspensão pneumática de extrema suavidade.',
    primaryImage: '/fleet-flyer-2026/lexus-570/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/lexus-570/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'lexus-570 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'lexus-570 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'lexus-570 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 7,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '93 L',
      airConditioning: true
    },
    features: ['Motor 5.7L V8', 'Bancos em Pele Nobre Climatizados', 'Sistema de Som Mark Levinson'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência 24 Horas'],
    recommendedFor: ['Direcção Executiva', 'Eventos Corporativos']
  },
  {
    id: 'range-rover',
    slug: 'range-rover',
    name: 'Range Rover Autobiography',
    brand: 'Land Rover',
    model: 'Range Rover Autobiography',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Luxo Clássico 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 549999,
    pricePerDayFormatted: '549.999 Kz',
    transferPriceAOA: 412499,
    transferPriceFormatted: '412.499 Kz',
    depositAOA: 200000,
    description: 'Requinte e distinção britânica com suspensão a ar autonivelante, vidros duplos insonorizados e excelente desempenho urbano em Luanda.',
    primaryImage: '/fleet-flyer-2026/range-rover/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/range-rover/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'range-rover vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'range-rover interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'range-rover em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Manual',
      fuelType: 'Gasolina',
      tankCapacity: '90 L',
      airConditioning: true
    },
    features: ['Suspensão Pneumática', 'Bancos Elétricos com Memória', 'Teto Panorâmico'],
    inclusions: ['Seguro Total', 'Manutenção preventiva garantida'],
    recommendedFor: ['Reuniões Executivas', 'Transfers de Quadros']
  },
  {
    id: 'toyota-lc-v8-2021',
    slug: 'toyota-lc-v8-2021',
    name: 'Toyota LC V8 2025/2026',
    brand: 'Toyota',
    model: 'Land Cruiser 200 V8',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Lendário V8 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 499999,
    pricePerDayFormatted: '499.999 Kz',
    transferPriceAOA: 374999,
    transferPriceFormatted: '374.999 Kz',
    depositAOA: 200000,
    description: 'O inquebrável Land Cruiser 200 com motor 4.5L V8 Twin-Turbo Diesel. A viatura preferida para viagens interprovinciais com total segurança e potência.',
    primaryImage: '/fleet-flyer-2026/toyota-lc-v8-2021/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-lc-v8-2021/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-lc-v8-2021 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-lc-v8-2021 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-lc-v8-2021 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 7,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Diesel',
      tankCapacity: '93 L',
      traction: '4WD Permanente',
      airConditioning: true
    },
    features: ['Motor 4.5L V8 Diesel Twin-Turbo', 'Frigorífico Central', 'Controlo de Tracção A-TRC'],
    inclusions: ['Seguro de Danos Próprios', 'Motorista de estrada certificado'],
    recommendedFor: ['Viagens para Províncias (Huambo, Benguela)', 'Missões Técnicas e Auditorias']
  },
  {
    id: 'mercedes-cls63',
    slug: 'mercedes-cls63',
    name: 'Mercedes CLS63 AMG 2025/2026',
    brand: 'Mercedes-Benz',
    model: 'CLS 63 AMG',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Coupé Desportivo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 699999,
    pricePerDayFormatted: '699.999 Kz',
    transferPriceAOA: 524999,
    transferPriceFormatted: '524.999 Kz',
    depositAOA: 200000,
    description: 'Coupé de 4 portas com linhas arrebatadoras e performance de superdesportivo. Ideal para casamentos, produções e chegadas de alto impacto.',
    primaryImage: '/fleet-flyer-2026/mercedes-cls63/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-cls63/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-cls63 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-cls63 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-cls63 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '66 L',
      airConditioning: true
    },
    features: ['Performance AMG', 'Bancos Desportivos com Apoio Dinâmico', 'Sistema de Som Premium'],
    inclusions: ['Seguro VIP', 'Higienização e preparação'],
    recommendedFor: ['Casamentos e Noivados VIP', 'Sessões Fotográficas e Eventos']
  },
  {
    id: 'mercedes-brabus',
    slug: 'mercedes-brabus',
    name: 'Mercedes Brabus Edition 2026',
    brand: 'Mercedes-Benz',
    model: 'Brabus Edition',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Edição Exclusiva 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 449999,
    pricePerDayFormatted: '449.999 Kz',
    transferPriceAOA: 337499,
    transferPriceFormatted: '337.499 Kz',
    depositAOA: 200000,
    description: 'Personalização exclusiva Brabus com kit estético aerodinâmico em fibra de carbono, jantes forjadas e sonoridade desportiva marcante.',
    primaryImage: '/fleet-flyer-2026/mercedes-brabus/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-brabus/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-brabus vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-brabus interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-brabus em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '70 L',
      airConditioning: true
    },
    features: ['Kit Aerodinâmico Brabus', 'Escapes Desportivos', 'Interior em Pele com Costura Vermelha'],
    inclusions: ['Seguro de Danos Próprios', 'Assistência 24h'],
    recommendedFor: ['Eventos Especiais', 'Deslocações de Prestígio']
  },
  {
    id: 'volvo-xc-60',
    slug: 'volvo-xc-60',
    name: 'Volvo XC60 Ultimate 2026',
    brand: 'Volvo',
    model: 'XC60 Inscription',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Híbrido Luxo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 349999,
    pricePerDayFormatted: '349.999 Kz',
    transferPriceAOA: 262499,
    transferPriceFormatted: '262.499 Kz',
    depositAOA: 150000,
    description: 'Design escandinavo elegante e o mais avançado pacote de segurança ativa do mundo (Pilot Assist, City Safety e visão 360°).',
    primaryImage: '/fleet-flyer-2026/volvo-xc60/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/volvo-xc60/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'volvo-xc-60 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'volvo-xc-60 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'volvo-xc-60 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '35 L',
      traction: 'AWD Integral',
      airConditioning: true
    },
    features: ['Bowers & Wilkins Sound', 'Pilot Assist Condução Semiautónoma', 'Purificador de Ar CleanZone'],
    inclusions: ['Seguro contra Todos os Riscos', 'Apoio ao cliente 24/7'],
    recommendedFor: ['Famílias e Directores', 'Condução Urbana Relaxante']
  },
  {
    id: 'new-toyota-prado',
    slug: 'new-toyota-prado',
    name: 'Novo Toyota Land Cruiser Prado 250 (2026)',
    brand: 'Toyota',
    model: 'Land Cruiser Prado 250',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 399999,
    pricePerDayFormatted: '399.999 Kz',
    transferPriceAOA: 299999,
    transferPriceFormatted: '299.999 Kz',
    depositAOA: 180000,
    description: 'A mais recente geração do Prado com design retro-moderno robusto, novo chassis TNGA-F e tecnologia off-road de última geração.',
    primaryImage: '/fleet-flyer-2026/novo-toyota-prado/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/novo-toyota-prado/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'new-toyota-prado vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'new-toyota-prado interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'new-toyota-prado em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preto',
      passengers: 7,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Diesel',
      tankCapacity: '87 L',
      traction: '4WD com Redutoras',
      airConditioning: true
    },
    features: ['Ecrã Digital Duplo 12.3"', 'Multi-Terrain Monitor com Visão Subterrânea', 'Barra Estabilizadora Desconectável SDM'],
    inclusions: ['Seguro Total VIP', 'Assistência móvel imediata'],
    recommendedFor: ['Delegações e Directores', 'Expedições com Conforto']
  },
  {
    id: 'nissan-patrol',
    slug: 'nissan-patrol',
    name: 'Novo Nissan Patrol Y63 (2026/2027)',
    brand: 'Nissan',
    model: 'Patrol V8 Platinum',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 390999,
    pricePerDayFormatted: '390.999 Kz',
    transferPriceAOA: 293249,
    transferPriceFormatted: '293.249 Kz',
    depositAOA: 180000,
    description: 'O gigante dos SUVs com motor 5.6L V8 de 400 CV e depósito colossal de 140 L para autonomia ilimitada em qualquer viagem por Angola.',
    primaryImage: '/fleet-flyer-2026/nissan-patrol/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/nissan-patrol/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'nissan-patrol vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'nissan-patrol interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'nissan-patrol em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preto',
      passengers: 7,
      doors: 4,
      luggage: 6,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '140 L',
      traction: 'All-Mode 4x4 com Hydraulic Body Motion',
      airConditioning: true
    },
    features: ['Motor 5.6L V8 (400 CV)', 'Depósito de 140 L de Longo Alcance', 'Bancos em Couro com Climatização Individual'],
    inclusions: ['Seguro de Danos Próprios', 'Motorista experiente'],
    recommendedFor: ['Viagens de Longo Curso', 'Comitivas e Autoridades']
  },
  {
    id: 'toyota-prado-atual',
    slug: 'toyota-prado-atual',
    name: 'Toyota Prado TXL 2025/2026',
    brand: 'Toyota',
    model: 'Land Cruiser Prado TXL',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Executivo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 299999,
    pricePerDayFormatted: '299.999 Kz',
    transferPriceAOA: 224999,
    transferPriceFormatted: '224.999 Kz',
    depositAOA: 150000,
    description: 'A referência mais fiável para deslocações executivas diárias em Luanda e no interior. 7 lugares, ar condicionado potente e tração 4x4 integral.',
    primaryImage: '/fleet-flyer-2026/toyota-prado-2023/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-prado-2023/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-prado-atual vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-prado-atual interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-prado-atual em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preto',
      passengers: 7,
      doors: 4,
      luggage: 5,
      transmission: 'Automática',
      fuelType: 'Diesel',
      tankCapacity: '87 L',
      traction: '4WD Permanente',
      airConditioning: true
    },
    features: ['Bancos em Pele', 'Câmara Traseira', 'Ar Condicionado Bi-Zona'],
    inclusions: ['Seguro contra Todos os Riscos', 'Assistência 24/7'],
    recommendedFor: ['Quadros de Empresas', 'Embaixadas e Delegações']
  },
  {
    id: 'toyota-fortuner-atual',
    slug: 'toyota-fortuner-atual',
    name: 'Toyota Fortuner VX 2026',
    brand: 'Toyota',
    model: 'Fortuner 2.8 GD-6',
    year: '2026',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Versátil 4x4 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 229999,
    pricePerDayFormatted: '229.999 Kz',
    depositAOA: 120000,
    description: 'Elegância urbana combinada com capacidade 4x4. Equipada com interior refinado, 7 lugares e motor turbodiesel de grande resposta.',
    inconsistentDataNote: 'Marcado para revisão interna de lotação.',
    primaryImage: '/fleet-flyer-2026/toyota-fortuner-2023/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-fortuner-2023/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-fortuner-atual vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-fortuner-atual interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-fortuner-atual em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 7,
      doors: 4,
      luggage: 4,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '70 L',
      traction: '4x4 com Redutoras',
      airConditioning: true
    },
    features: ['Bancos em Pele Nobre', 'Abertura Elétrica da Bagageira', 'Apple CarPlay e Android Auto'],
    inclusions: ['Seguro de Danos Próprios', 'Assistência 24 Horas'],
    recommendedFor: ['Supervisão Técnica', 'Directores de Departamento', 'Famílias']
  },
  {
    id: 'toyota-fortuner-2023',
    slug: 'toyota-fortuner-2023',
    name: 'Toyota Fortuner 2025/2026',
    brand: 'Toyota',
    model: 'Fortuner',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Robustez 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 289999,
    pricePerDayFormatted: '289.999 Kz',
    transferPriceAOA: 217499,
    transferPriceFormatted: '217.499 Kz',
    depositAOA: 100000,
    description: 'SUV 4x4 espaçosa para 7 ocupantes com ar condicionado reforçado e consumo eficiente em circuitos urbanos ou rurais.',
    primaryImage: '/fleet-flyer-2026/toyota-fortuner-2023/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-fortuner-2023/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-fortuner-2023 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-fortuner-2023 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-fortuner-2023 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 7,
      doors: 4,
      luggage: 4,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '80 L',
      traction: '4x4',
      airConditioning: true
    },
    features: ['7 Lugares Modulares', 'Sensores de Estacionamento', 'Bluetooth e USB'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência Técnica 24h'],
    recommendedFor: ['Deslocações Regionais', 'Equipas de Projecto']
  },

  // ═══════════════════════════════════════════════════════════
  // 2. VANS, MINI-VANS E TRANSPORTE (8 Veículos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'mercedes-benz-v300-class',
    slug: 'mercedes-benz-v300-class',
    name: 'Mercedes-Benz V300d Exclusive 2026',
    brand: 'Mercedes-Benz',
    model: 'Classe V 300d',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'VIP JetVan 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 800000,
    pricePerDayFormatted: '800.000 Kz',
    transferPriceAOA: 600000,
    transferPriceFormatted: '600.000 Kz',
    depositAOA: 300000,
    description: 'O mais luxuoso transporte de passageiros em Angola. 7 poltronas individuais face-a-face em pele com climatização independente, mesa dobrável e acabamentos de altíssimo padrão.',
    primaryImage: '/fleet-flyer-2026/mercedes-v300-class/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-v300-class/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-benz-v300-class vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-benz-v300-class interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-benz-v300-class em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 7,
      doors: 3,
      luggage: 8,
      transmission: 'Automática',
      fuelType: 'Diesel',
      tankCapacity: '70 L',
      traction: 'Traseira / 4MATIC',
      airConditioning: true
    },
    features: ['Poltronas Individuais Reclináveis', 'Mesa de Reuniões a Bordo', 'Portas Laterais Elétricas', 'Som Burmester'],
    inclusions: ['Seguro Total VIP', 'Motorista de protocolo bilingue incluído', 'Serviço de bordo com água e toalhetes'],
    recommendedFor: ['Reuniões de Direção em Trânsito', 'Delegações Diplomáticas', 'Transfers de Celebridades e VIPs']
  },
  {
    id: 'hyundai-staria-executiva',
    slug: 'hyundai-staria-executiva',
    name: 'Hyundai Staria Lounge VIP 2026',
    brand: 'Hyundai',
    model: 'Staria Lounge',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Futurista VIP 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 449999,
    pricePerDayFormatted: '449.999 Kz',
    transferPriceAOA: 337499,
    transferPriceFormatted: '337.499 Kz',
    depositAOA: 200000,
    description: 'Design espacial futurista com janelas panorâmicas de grandes dimensões, 9 lugares VIP e bancos de relaxamento com apoio de pernas.',
    primaryImage: '/fleet-flyer-2026/hyundai-staria-executiva/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-staria-executiva/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-staria-executiva vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-staria-executiva interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-staria-executiva em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 9,
      doors: 3,
      luggage: 6,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '75 L',
      airConditioning: true
    },
    features: ['Janelas Panorâmicas Baixas', 'Bancos Reclináveis com Apoio de Pernas', 'Ar Condicionado com Difusores de Teto'],
    inclusions: ['Seguro de Danos Próprios', 'Motorista profissional disponível'],
    recommendedFor: ['Delegações Internacionais', 'Conferências e Cimeiras']
  },
  {
    id: 'toyota-coaster',
    slug: 'toyota-coaster',
    name: 'Toyota Coaster Executive 2026',
    brand: 'Toyota',
    model: 'Coaster 30L',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '30 Lugares 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 399999,
    pricePerDayFormatted: '399.999 Kz',
    transferPriceAOA: 299999,
    transferPriceFormatted: '299.999 Kz',
    depositAOA: 200000,
    description: 'Minibus de grande capacidade para transporte confortável de 30 pessoas com ar condicionado potente para o clima de Angola, microfone e bagageiro.',
    primaryImage: '/fleet-flyer-2026/toyota-coaster/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-coaster/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-coaster vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-coaster interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-coaster em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 30,
      doors: 4,
      luggage: 15,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '95 L',
      airConditioning: true
    },
    features: ['30 Lugares com Cintos de Segurança', 'Microfone de Bordo para Briefings', 'Ar Condicionado Central de Teto'],
    inclusions: ['Seguro de Transporte de Passageiros', 'Motorista profissional de pesados'],
    recommendedFor: ['Delegações Desportivas', 'Convenções e Cimeiras', 'Equipas Petrolíferas']
  },
  {
    id: 'mercedes-sprinter-atual',
    slug: 'mercedes-sprinter-atual',
    name: 'Mercedes Sprinter VIP Shuttle 2026',
    brand: 'Mercedes-Benz',
    model: 'Sprinter 21L',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'VIP Shuttle 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 369999,
    pricePerDayFormatted: '369.999 Kz',
    transferPriceAOA: 277499,
    transferPriceFormatted: '277.499 Kz',
    depositAOA: 180000,
    description: 'Van executiva de 21 lugares com teto alto, poltronas reclináveis individuais em pele, estribo de acesso elétrico e excelente insonorização.',
    primaryImage: '/fleet-flyer-2026/mercedes-sprinter-atual/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mercedes-sprinter-atual/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mercedes-sprinter-atual vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mercedes-sprinter-atual interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mercedes-sprinter-atual em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 21,
      doors: 3,
      luggage: 12,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '75 L',
      airConditioning: true
    },
    features: ['Poltronas Individuais Reclináveis', 'Estribo Elétrico de Entrada', 'Ar Condicionado Reforçado'],
    inclusions: ['Seguro Total de Ocupantes', 'Motorista credenciado fardado'],
    recommendedFor: ['Transfers de Aeroporto para Grupos VIP', 'Equipas Técnicas e Delegações']
  },
  {
    id: 'hyundai-staria-atual',
    slug: 'hyundai-staria-atual',
    name: 'Hyundai Staria Minibus 2026',
    brand: 'Hyundai',
    model: 'Staria 11L',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '11 Lugares 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 359999,
    pricePerDayFormatted: '359.999 Kz',
    transferPriceAOA: 269999,
    transferPriceFormatted: '269.999 Kz',
    depositAOA: 150000,
    description: 'Espaço para 11 pessoas com conforto moderno, saídas de ar condicionado em todas as filas e design contemporâneo.',
    primaryImage: '/fleet-flyer-2026/hyundai-staria-atual/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-staria-atual/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-staria-atual vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-staria-atual interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-staria-atual em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 11,
      doors: 3,
      luggage: 8,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '75 L',
      airConditioning: true
    },
    features: ['11 Lugares Confortáveis', 'Tomadas USB Múltiplas', 'Controlo de Estabilidade ESC'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência 24 Horas'],
    recommendedFor: ['Comitivas Médias', 'Equipas de Produção e Logística']
  },
  {
    id: 'new-toyota-hiace',
    slug: 'new-toyota-hiace',
    name: 'Toyota HiAce Super Grandia 2026',
    brand: 'Toyota',
    model: 'Hiace Novo Modelo 15L',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 379999,
    pricePerDayFormatted: '379.999 Kz',
    transferPriceAOA: 284999,
    transferPriceFormatted: '284.999 Kz',
    depositAOA: 150000,
    description: 'A nova geração da Toyota Hiace com capô dianteiro semi-avançado para maior segurança, 15 lugares e condução suave.',
    primaryImage: '/fleet-flyer-2026/nova-toyota-hiace/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/nova-toyota-hiace/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'new-toyota-hiace vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'new-toyota-hiace interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'new-toyota-hiace em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Cinzenta / Branca / Preta',
      passengers: 15,
      doors: 3,
      luggage: 10,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '70 L',
      airConditioning: true
    },
    features: ['Motor 2.8L D-4D Turbo', 'Cintos de Segurança de 3 Pontos em Todos os Lugares', 'Ar Condicionado Central Traseiro'],
    inclusions: ['Seguro de Passageiros', 'Motorista profissional disponível'],
    recommendedFor: ['Transfers de Aeroporto', 'Equipas Petrolíferas e Corporativas']
  },
  {
    id: 'hyundai-h1',
    slug: 'hyundai-h1',
    name: 'Hyundai H-1 Royale 2025/2026',
    brand: 'Hyundai',
    model: 'H1 12L',
    year: '2025',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '12 Lugares 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 359999,
    pricePerDayFormatted: '359.999 Kz',
    transferPriceAOA: 269999,
    transferPriceFormatted: '269.999 Kz',
    depositAOA: 150000,
    description: 'Minivan executiva confortável para 12 pessoas com bancos reconfiguráveis, portas laterais de correr em ambos os lados e ar condicionado independente.',
    primaryImage: '/fleet-flyer-2026/hyundai-h1/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-h1/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-h1 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-h1 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-h1 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 12,
      doors: 3,
      luggage: 8,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '75 L',
      airConditioning: true
    },
    features: ['Dupla Porta Lateral Deslizante', 'Ar Condicionado com Controlo Traseiro', 'Bancos Reclináveis'],
    inclusions: ['Seguro Completo', 'Assistência 24h'],
    recommendedFor: ['Viagens de Grupo', 'Logística de Eventos']
  },
  {
    id: 'toyota-hiace',
    slug: 'toyota-hiace',
    name: 'Toyota HiAce Commuter 2025/2026',
    brand: 'Toyota',
    model: 'Hiace Clássica 15L',
    year: '2025',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '15 Lugares 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 299999,
    pricePerDayFormatted: '299.999 Kz',
    transferPriceAOA: 224999,
    transferPriceFormatted: '224.999 Kz',
    depositAOA: 100000,
    description: 'A van de trabalho e transporte de passageiros mais robusta e testada em Angola. 15 lugares com ar condicionado e manutenção 100% garantida.',
    primaryImage: '/fleet-flyer-2026/toyota-hiace-classica/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-hiace-classica/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-hiace vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-hiace interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-hiace em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 15,
      doors: 3,
      luggage: 10,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '70 L',
      airConditioning: true
    },
    features: ['Motor Diesel 5L/D-4D', '15 Lugares', 'Ar Condicionado Duplo'],
    inclusions: ['Seguro Obrigatório e Danos Próprios', 'Apoio técnico em Luanda'],
    recommendedFor: ['Transporte de Pessoal', 'Logística e Serviços']
  },

  // ═══════════════════════════════════════════════════════════
  // 3. SUVs (6 Veículos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'jetour-x70',
    slug: 'jetour-x70',
    name: 'Jetour X70 Plus / T2 2026',
    brand: 'Jetour',
    model: 'X70 7L',
    year: '2026',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Modelo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 238888,
    pricePerDayFormatted: '238.888 Kz',
    transferPriceAOA: 179166,
    transferPriceFormatted: '179.166 Kz',
    depositAOA: 80000,
    description: 'SUV moderna com 7 lugares, teto solar panorâmico, ecrã multimédia de 10.1" e excelente relação custo-benefício para famílias e equipas.',
    primaryImage: '/fleet-flyer-2026/jetour-x70/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/jetour-x70/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'jetour-x70 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'jetour-x70 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'jetour-x70 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branco',
      passengers: 7,
      doors: 4,
      luggage: 4,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '55 L',
      airConditioning: true
    },
    features: ['7 Lugares', 'Teto Panorâmico', 'Câmara 360°', 'Apple CarPlay'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência 24h'],
    recommendedFor: ['Famílias e Empresas', 'Condução Urbana em Luanda']
  },
  {
    id: 'hyundai-santa-fe',
    slug: 'hyundai-santa-fe',
    name: 'Novo Hyundai Santa Fe Calligraphy 2026',
    brand: 'Hyundai',
    model: 'Santa Fé',
    year: '2026',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 169999,
    pricePerDayFormatted: '169.999 Kz',
    transferPriceAOA: 127499,
    transferPriceFormatted: '127.499 Kz',
    depositAOA: 75000,
    description: 'SUV refinada com 5 lugares, condução silenciosa, acabamento de topo e tecnologia de assistência ao condutor.',
    primaryImage: '/fleet-flyer-2026/hyundai-santa-fe/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-santa-fe/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-santa-fe vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-santa-fe interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-santa-fe em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '64 L',
      airConditioning: true
    },
    features: ['Bancos em Pele', 'Carregador sem Fios', 'Sensor de Ângulo Morto'],
    inclusions: ['Seguro Completo', 'Assistência 24/7'],
    recommendedFor: ['Directores e Gestores', 'Fins de Semana em Família']
  },
  {
    id: 'hyundai-tucson',
    slug: 'hyundai-tucson',
    name: 'Hyundai Tucson N-Line 2026',
    brand: 'Hyundai',
    model: 'Tucson',
    year: '2026',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Modelo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 159999,
    pricePerDayFormatted: '159.999 Kz',
    transferPriceAOA: 119999,
    transferPriceFormatted: '119.999 Kz',
    depositAOA: 75000,
    description: 'SUV compacta premium com assinatura luminosa paramétrica oculta, interior digital e condução ágil no trânsito de Luanda.',
    primaryImage: '/fleet-flyer-2026/hyundai-tucson/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-tucson/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-tucson vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-tucson interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-tucson em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 4,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '62 L',
      airConditioning: true
    },
    features: ['Cockpit Totalmente Digital', 'Faróis Paramétricos LED', 'Ar Condicionado Dual-Zone'],
    inclusions: ['Seguro Total', 'Apoio técnico 24h'],
    recommendedFor: ['Profissionais Liberais', 'Consultores e Gestores']
  },
  {
    id: 'chery-tiggo-7',
    slug: 'chery-tiggo-7',
    name: 'Chery Tiggo 7 Pro Max 2026',
    brand: 'Chery',
    model: 'Tiggo 7 Pro',
    year: '2026',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Modelo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 159999,
    pricePerDayFormatted: '159.999 Kz',
    transferPriceAOA: 119999,
    transferPriceFormatted: '119.999 Kz',
    depositAOA: 75000,
    description: 'SUV com motor turbo, teto panorâmico, bancos em pele com ajuste elétrico e excelente espaço para 5 passageiros.',
    primaryImage: '/fleet-flyer-2026/chery-tiggo-7-pro-max/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/chery-tiggo-7-pro-max/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'chery-tiggo-7 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'chery-tiggo-7 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'chery-tiggo-7 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preto',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '51 L',
      airConditioning: true
    },
    features: ['Ecrã Central de 10.25"', 'Teto Solar Panorâmico', 'Câmara de Ré com Guias'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência 24h'],
    recommendedFor: ['Uso Corporativo Diário', 'Deslocações Urbanas']
  },
  {
    id: 'chery-tiggo-2',
    slug: 'chery-tiggo-2',
    name: 'Chery Tiggo 2 Pro 2025/2026',
    brand: 'Chery',
    model: 'Tiggo 2',
    year: '2025',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Crossover 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 149999,
    pricePerDayFormatted: '149.999 Kz',
    transferPriceAOA: 112499,
    transferPriceFormatted: '112.499 Kz',
    depositAOA: 60000,
    description: 'Crossover compacto com altura ao solo elevada para enfrentar pisos irregulares em Luanda, com excelente economia de combustível.',
    primaryImage: '/fleet-flyer-2026/chery-tiggo-2/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/chery-tiggo-2/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'chery-tiggo-2 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'chery-tiggo-2 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'chery-tiggo-2 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Vermelho',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '50 L',
      airConditioning: true
    },
    features: ['Altura ao Solo Elevada', 'Sensor de Estacionamento', 'Bluetooth'],
    inclusions: ['Seguro Obrigatório e Danos Próprios', 'Assistência Técnica'],
    recommendedFor: ['Deslocações Rápidas', 'Supervisão de Campo']
  },
  {
    id: 'hyundai-creta',
    slug: 'hyundai-creta',
    name: 'Hyundai Creta Smart 2026',
    brand: 'Hyundai',
    model: 'Creta',
    year: '2026',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Modelo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 139999,
    pricePerDayFormatted: '139.999 Kz',
    transferPriceAOA: 104999,
    transferPriceFormatted: '104.999 Kz',
    depositAOA: 60000,
    description: 'SUV compacta muito procurada pela sua robustez, posição de condução elevada, ar condicionado eficiente e facilidade de estacionamento.',
    primaryImage: '/fleet-flyer-2026/hyundai-creta/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-creta/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-creta vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-creta interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-creta em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Vermelho',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '50 L',
      airConditioning: true
    },
    features: ['Ecrã Táctil com Conectividade', 'Consumo Reduzido', 'Ar Condicionado Potente'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência 24h'],
    recommendedFor: ['Condução Urbana', 'Consultores e Pequenas Equipas']
  },

  // ═══════════════════════════════════════════════════════════
  // 4. PICK-UPS E CAMIÕES (5 Veículos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'toyota-lc-hz',
    slug: 'toyota-lc-hz',
    name: 'Toyota Land Cruiser HZJ79 2026',
    brand: 'Toyota',
    model: 'Land Cruiser Série 70 HZJ',
    year: '2026',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Heavy Duty 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 259999,
    pricePerDayFormatted: '259.999 Kz',
    depositAOA: 150000,
    description: 'O clássico Land Cruiser Série 70 com motor diesel 4.2L 1HZ inquebrável, chassis de longarinas reforçado e capacidade para qualquer picada em Angola.',
    primaryImage: '/fleet-flyer-2026/toyota-lc-hz/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-lc-hz/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-lc-hz vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-lc-hz interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-lc-hz em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Bege',
      passengers: 5,
      doors: 4,
      luggage: 8,
      transmission: 'Manual',
      fuelType: 'Diesel',
      tankCapacity: '95 L',
      traction: '4x4 com Redutoras e Cubos de Roda Manuais',
      airConditioning: true
    },
    features: ['Snorkel Elevado', 'Suspensão Reforçada para Minas/Obras', 'Protecção de Cárter em Duralumínio'],
    inclusions: ['Seguro Especial para Picadas e Minas', '2 Pneus sobressalentes incluídos'],
    recommendedFor: ['Sector Petrolífero e Mineiro', 'ONGs e Missões em Províncias Remotas']
  },
  {
    id: 'toyota-lc-hz-18p',
    slug: 'toyota-lc-hz-18p',
    name: 'Toyota Land Cruiser 70 Troopy 2026',
    brand: 'Toyota',
    model: 'Land Cruiser Série 78 Troopy',
    year: '2026',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: '18 Lugares 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 249999,
    pricePerDayFormatted: '249.999 Kz',
    depositAOA: 150000,
    description: 'Versão Troop Carrier de caixa longa para transporte de equipas técnicas com bancos longitudinais traseiros e tanque duplo de combustível.',
    inconsistentDataNote: 'Capacidade de 13 passageiros marcada para revisão técnica.',
    primaryImage: '/fleet-flyer-2026/toyota-lc-hz-18p/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-lc-hz-18p/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-lc-hz-18p vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-lc-hz-18p interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-lc-hz-18p em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branco',
      passengers: 13,
      doors: 4,
      luggage: 10,
      transmission: 'Manual',
      fuelType: 'Diesel',
      tankCapacity: '90 L',
      traction: '4x4 Integral',
      airConditioning: true
    },
    features: ['Bancos Longitudinais Rebatíveis', 'Duplo Tanque de Combustível', 'Chassis Resistente'],
    inclusions: ['Seguro de Todo-Terreno', 'Kit de Ferramentas e Desatolamento'],
    recommendedFor: ['Expedições Científicas', 'Geologia, Sondagens e Minas']
  },
  {
    id: 'mitsubishi-canter',
    slug: 'mitsubishi-canter',
    name: 'Mitsubishi Fuso Canter 2026',
    brand: 'Mitsubishi',
    model: 'Canter Caixa Aberta/Fechada',
    year: '2026',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Carga Pesada 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 200000,
    pricePerDayFormatted: '200.000 Kz',
    transferPriceAOA: 150000,
    transferPriceFormatted: '150.000 Kz',
    depositAOA: 100000,
    description: 'Camião ligeiro de carga com grande capacidade volumétrica e de peso. Ideal para mudanças corporativas, logística de eventos e transporte de equipamentos.',
    primaryImage: '/fleet-flyer-2026/mitsubishi-canter/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mitsubishi-canter/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mitsubishi-canter vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mitsubishi-canter interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mitsubishi-canter em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branco',
      passengers: 3,
      doors: 2,
      luggage: 20,
      transmission: 'Manual',
      fuelType: 'Diesel',
      tankCapacity: '100 L',
      airConditioning: true
    },
    features: ['Capacidade de Carga de 3.5 a 5 Toneladas', 'Caixa Rebatível', 'Direção Assistida'],
    inclusions: ['Seguro de Carga e Viatura', 'Motorista de pesados incluído (opcional)'],
    recommendedFor: ['Logística de Eventos', 'Mudanças Empresariais', 'Distribuição Comercial']
  },
  {
    id: 'mitsubishi-l200',
    slug: 'mitsubishi-l200',
    name: 'Nova Mitsubishi L200 Triton Athlete 2026',
    brand: 'Mitsubishi',
    model: 'L200 Sportero 4x4',
    year: '2026',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 189999,
    pricePerDayFormatted: '189.999 Kz',
    transferPriceAOA: 142499,
    transferPriceFormatted: '142.499 Kz',
    depositAOA: 80000,
    description: 'Pick-up cabine dupla com sistema de tração Super Select 4WD-II, caixa de carga espaçosa e excelente conforto para 5 ocupantes.',
    primaryImage: '/fleet-flyer-2026/mitsubishi-l200/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/mitsubishi-l200/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'mitsubishi-l200 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'mitsubishi-l200 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'mitsubishi-l200 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Azul',
      passengers: 3,
      doors: 4,
      luggage: 6,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '75 L',
      traction: 'Super Select 4WD',
      airConditioning: true
    },
    features: ['Tração 4x4 com Bloqueio Central', 'Caixa Forrada Resistente', 'Ar Condicionado'],
    inclusions: ['Seguro de Danos Próprios', 'Assistência Técnica 24h'],
    recommendedFor: ['Engenharia e Construção Civil', 'Operações de Campo']
  },
  {
    id: 'toyota-hilux',
    slug: 'toyota-hilux',
    name: 'Nova Toyota Hilux GR Sport 2026',
    brand: 'Toyota',
    model: 'Hilux Dupla Cabine 4x4',
    year: '2026',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Líder Offroad 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 189999,
    pricePerDayFormatted: '189.999 Kz',
    transferPriceAOA: 142499,
    transferPriceFormatted: '142.499 Kz',
    depositAOA: 80000,
    description: 'A pick-up número um em Angola. Lendária durabilidade para minas, estaleiros ou viagens a qualquer das 18 províncias.',
    primaryImage: '/fleet-flyer-2026/toyota-hilux/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-hilux/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-hilux vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-hilux interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-hilux em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 6,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '80 L',
      traction: '4x4 com Caixa Redutora',
      engine: '2.8L D-4D Turbo Diesel (204 CV)',
      airConditioning: true
    },
    features: ['Pneus All-Terrain Reforçados', 'Caixa com Cobertura Rígida Trancável', 'Ar Condicionado Tropicalizado'],
    inclusions: ['Seguro Total com Cobertura de Picadas', 'Motorista-mecânico opcional', 'Substituição em caso de avaria'],
    recommendedFor: ['Fiscalização de Obras', 'Mineração, Petróleo e Agricultura', 'Viagens Longas Interprovinciais']
  },

  // ═══════════════════════════════════════════════════════════
  // 5. ECONÓMICOS (8 Veículos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'suzuki-swift',
    slug: 'suzuki-swift',
    name: 'Novo Suzuki Swift GLX 2026',
    brand: 'Suzuki',
    model: 'Swift 1.2 GLX',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Nova Geração 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 69999,
    pricePerDayFormatted: '69.999 Kz',
    transferPriceAOA: 52499,
    transferPriceFormatted: '52.499 Kz',
    depositAOA: 40000,
    description: 'Hatchback moderno com design jovial, consumo ultra-baixo (5.0L/100km), ar condicionado potente e facilidade máxima de condução.',
    primaryImage: '/fleet-flyer-2026/suzuki-swift/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/suzuki-swift/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'suzuki-swift vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'suzuki-swift interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'suzuki-swift em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Vermelho',
      passengers: 5,
      doors: 4,
      luggage: 2,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '50 L',
      airConditioning: true
    },
    features: ['Ecrã Multimédia com Bluetooth', 'Direção Assistida Elétrica', 'Excelente Consumo Urbano'],
    inclusions: ['Seguro contra Terceiros e Danos Próprios', 'Assistência 24h'],
    recommendedFor: ['Deslocações Rápidas em Luanda', 'Consultores Individuais']
  },
  {
    id: 'suzuki-baleno',
    slug: 'suzuki-baleno',
    name: 'Suzuki Baleno GLX 2026',
    brand: 'Suzuki',
    model: 'Baleno 1.5 GLX',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Económico 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 86999,
    pricePerDayFormatted: '86.999 Kz',
    transferPriceAOA: 65249,
    transferPriceFormatted: '65.249 Kz',
    depositAOA: 40000,
    description: 'Hatchback espaçoso com excelente espaço para pernas nos bancos traseiros, bagageira generosa e câmara 360° no modelo de topo.',
    primaryImage: '/fleet-flyer-2026/suzuki-baleno/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/suzuki-baleno/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'suzuki-baleno vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'suzuki-baleno interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'suzuki-baleno em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Vermelho',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '37 L',
      airConditioning: true
    },
    features: ['Ecrã de 9" com Conectividade', 'Head-Up Display', 'Bancos Confortáveis'],
    inclusions: ['Seguro de Danos Próprios', 'Apoio ao cliente'],
    recommendedFor: ['Uso Corporativo Diário', 'Pequenas Famílias']
  },
  {
    id: 'hyundai-i-20',
    slug: 'hyundai-i-20',
    name: 'Hyundai i20 Premium 2026',
    brand: 'Hyundai',
    model: 'i20',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Modelo 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 69999,
    pricePerDayFormatted: '69.999 Kz',
    transferPriceAOA: 52499,
    transferPriceFormatted: '52.499 Kz',
    depositAOA: 35000,
    description: 'Carro citadino europeu com acabamento de qualidade, estabilidade excelente em autoestrada e ar condicionado digital.',
    primaryImage: '/fleet-flyer-2026/hyundai-i20/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-i20/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-i-20 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-i-20 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-i-20 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Vermelho',
      passengers: 5,
      doors: 4,
      luggage: 2,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '45 L',
      airConditioning: true
    },
    features: ['Painel Digital', 'Sensores de Estacionamento', 'Bluetooth'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência Técnica'],
    recommendedFor: ['Profissionais em Luanda', 'Transfers Simples']
  },
  {
    id: 'suzuki-spresso',
    slug: 'suzuki-spresso',
    name: 'Suzuki S-Presso GL 2026',
    brand: 'Suzuki',
    model: 'S-Presso',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Urbano 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 59999,
    pricePerDayFormatted: '59.999 Kz',
    transferPriceAOA: 44999,
    transferPriceFormatted: '44.999 Kz',
    depositAOA: 35000,
    description: 'Mini-SUV compacta com altura ao solo de 180mm que ultrapassa lombas e buracos com facilidade. Consumo impressionante de 4.5L/100km.',
    primaryImage: '/fleet-flyer-2026/suzuki-s-presso/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/suzuki-s-presso/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'suzuki-spresso vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'suzuki-spresso interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'suzuki-spresso em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preto',
      passengers: 4,
      doors: 4,
      luggage: 2,
      transmission: 'Manual',
      fuelType: 'Gasolina',
      tankCapacity: '27 L',
      airConditioning: true
    },
    features: ['Altura ao Solo de Mini-SUV', 'Consumo Mínimo', 'Ar Condicionado'],
    inclusions: ['Seguro Completo', 'Assistência 24h'],
    recommendedFor: ['Trabalho de Campo Urbano', 'Vendas e Logística Ligeira']
  },
  {
    id: 'toyota-starlet',
    slug: 'toyota-starlet',
    name: 'Toyota Starlet Cross 2026',
    brand: 'Toyota',
    model: 'Starlet 1.4',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Novo Crossover 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 86999,
    pricePerDayFormatted: '86.999 Kz',
    transferPriceAOA: 65249,
    transferPriceFormatted: '65.249 Kz',
    depositAOA: 35000,
    description: 'A fiabilidade lendária da Toyota num formato económico e prático para o dia-a-dia na capital.',
    primaryImage: '/fleet-flyer-2026/toyota-starlet/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/toyota-starlet/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'toyota-starlet vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'toyota-starlet interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'toyota-starlet em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Castanho',
      passengers: 5,
      doors: 4,
      luggage: 2,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '45 L',
      airConditioning: true
    },
    features: ['Ecrã Multimédia', 'Ar Condicionado Rápido', 'Baixa Manutenção'],
    inclusions: ['Seguro contra Danos Próprios', 'Suporte 24/7'],
    recommendedFor: ['Condução Urbana', 'Aluguer de Média Duração']
  },
  {
    id: 'hyundai-g-i10',
    slug: 'hyundai-g-i10',
    name: 'Hyundai Grand i10 Sedan 2026',
    brand: 'Hyundai',
    model: 'Grand i10',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Económico 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 55000,
    pricePerDayFormatted: '55.000 Kz',
    transferPriceAOA: 41250,
    transferPriceFormatted: '41.250 Kz',
    depositAOA: 30000,
    description: 'Carro compacto económico com 5 lugares, fácil de manobrar e estacionar em qualquer rua de Luanda.',
    primaryImage: '/fleet-flyer-2026/hyundai-grand-i10/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/hyundai-grand-i10/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'hyundai-g-i10 vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'hyundai-g-i10 interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'hyundai-g-i10 em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Branco / Preto',
      passengers: 5,
      doors: 4,
      luggage: 2,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '43 L',
      airConditioning: true
    },
    features: ['Económico', 'Ar Condicionado', 'Vidros Elétricos Dianteiros'],
    inclusions: ['Seguro contra Terceiros', 'Assistência Técnica'],
    recommendedFor: ['Tarefas Diárias', 'Estudantes e Funcionários']
  },
  {
    id: 'kia-morning',
    slug: 'kia-morning',
    name: 'Kia Picanto Morning 2026',
    brand: 'Kia',
    model: 'Morning / Picanto',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Compacto 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 49999,
    pricePerDayFormatted: '49.999 Kz',
    transferPriceAOA: 37499,
    transferPriceFormatted: '37.499 Kz',
    depositAOA: 25000,
    description: 'Uma das tarifas mais acessíveis da frota. Ideal para deslocações pontuais, compras ou gestão pessoal.',
    primaryImage: '/fleet-flyer-2026/kia-morning/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/kia-morning/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'kia-morning vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'kia-morning interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'kia-morning em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Cinza',
      passengers: 5,
      doors: 4,
      luggage: 2,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '35 L',
      airConditioning: true
    },
    features: ['Económico', 'Fácil Estacionamento', 'Ar Condicionado'],
    inclusions: ['Seguro Obrigatório', 'Assistência em Luanda'],
    recommendedFor: ['Uso Pessoal Ligeiro', 'Económico']
  },
  {
    id: 'suzuki-celerio',
    slug: 'suzuki-celerio',
    name: 'Suzuki Celerio GL 2026',
    brand: 'Suzuki',
    model: 'Celerio',
    year: '2026',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Económico 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 49999,
    pricePerDayFormatted: '49.999 Kz',
    transferPriceAOA: 37499,
    transferPriceFormatted: '37.499 Kz',
    depositAOA: 25000,
    description: 'O campeão da poupança de combustível em Luanda. Condução leve, ar condicionado e manutenção sempre em dia.',
    primaryImage: '/fleet-flyer-2026/suzuki-celerio/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/suzuki-celerio/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'suzuki-celerio vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'suzuki-celerio interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'suzuki-celerio em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Azul / Preto',
      passengers: 5,
      doors: 4,
      luggage: 2,
      transmission: 'Automática / Manual',
      fuelType: 'Gasolina',
      tankCapacity: '35 L',
      airConditioning: true
    },
    features: ['Consumo de 4.0L/100km', 'Ar Condicionado', 'Rádio USB'],
    inclusions: ['Seguro Obrigatório e Danos', 'Assistência 24h'],
    recommendedFor: ['Orçamento Reduzido', 'Deslocações Diárias']
  },

  // ═══════════════════════════════════════════════════════════
  // 6. EVENTOS ESPECIAIS (1 Veículo)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'limousine',
    slug: 'limousine',
    name: 'Limousine Presidencial / Gala 2026',
    brand: 'Lincoln / Cadillac',
    model: 'Presidential Stretch Limousine',
    year: '2026',
    category: 'eventos',
    categoryLabel: 'Eventos Especiais',
    badge: 'Exclusivo Gala 2026',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 999999,
    pricePerDayFormatted: '999.999 Kz',
    transferPriceAOA: 749999,
    transferPriceFormatted: '749.999 Kz',
    depositAOA: 300000,
    description: 'Limousine executiva estendida para 20 ocupantes com bar embutido com flautas de cristal, iluminação estroboscópica de discoteca e fibra ótica, ecrãs LED e privacidade total com divisória acústica.',
    primaryImage: '/fleet-flyer-2026/limousine/01-oficial.webp'
    ,
    secondaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: '/fleet-flyer-2026/limousine/01-oficial.webp',
        caption: 'Vista Oficial de Estúdio — Frota Real PEPEK Talatona',
        altText: 'limousine vista frontal oficial — PEPEK Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Cabine Executiva & Conforto — Ar condicionado independente e bancos ergonómicos',
        altText: 'limousine interior e cockpit — PEPEK Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil de Estrada & Deslocação — Prontidão operacional nas 18 províncias',
        altText: 'limousine em circulação — Mobilidade executiva Angola'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 20,
      doors: 6,
      luggage: 10,
      transmission: 'Automática',
      fuelType: 'Gasolina / Diesel',
      airConditioning: true
    },
    features: ['Bar Iluminado com Champanheira', 'Teto Estrelado em Fibra Ótica', 'Ecrãs de TV e Som Surround 2000W', 'Divisória Elétrica de Privacidade'],
    inclusions: ['Chauffeur com Fato de Gala', 'Champanhe de boas-vindas incluído', 'Tapete vermelho na chegada'],
    recommendedFor: ['Casamentos de Alta Sociedade', 'Galas e Festas de Aniversário VIP', 'Produções de Moda e Televisão']
  },
  // ═══════════════════════════════════════════════════════════
  // NOVAS VIATURAS — fotografias oficiais "Carros PNG" (Ago/2026)
  // DADOS PROVISÓRIOS: preços e specs derivados de irmãos de segmento.
  // Confirmar com a operação antes de comunicação comercial.
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chery-himla',
    slug: 'chery-himla',
    name: 'Chery Himla 4x4 2026',
    brand: 'Chery',
    model: 'Himla Dupla Cabine 2.0T',
    year: '2026',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Nova na Frota 2026',
    availabilityTag: 'Sob Consulta',
    isAvailable: true,
    pricePerDayAOA: 189999,
    pricePerDayFormatted: '189.999 Kz',
    transferPriceAOA: 132999,
    transferPriceFormatted: '132.999 Kz',
    depositAOA: 120000,
    description: 'Pick-up de dupla cabine com tração às quatro rodas, caixa de carga reforçada e cabina moderna. Alternativa robusta para obra, logística de campo e deslocações mistas asfalto/picada.',
    inconsistentDataNote: 'Ficha provisória — specs e tarifas a confirmar com a operação.',
    primaryImage: '/fleet-flyer-2026/chery-himla/01-oficial.webp',
    gallery: [
      {
        url: '/fleet-flyer-2026/chery-himla/01-oficial.webp',
        caption: 'Imagem oficial do catálogo PEPEK Rent A Car 2026',
        altText: 'Chery Himla 4x4 2026 — catálogo oficial PEPEK',
        type: 'exterior_front'
      },
      {
        url: '/fleet-carousel-generated/chery-himla/01-estudio-principal.webp',
        caption: 'Apresentação de estúdio — vista principal',
        altText: 'Chery Himla 4x4 2026 — apresentação de estúdio — vista principal',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/chery-himla/02-estudio-amplo.webp',
        caption: 'Apresentação de estúdio — enquadramento amplo',
        altText: 'Chery Himla 4x4 2026 — apresentação de estúdio — enquadramento amplo',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/chery-himla/03-estudio-aproximado.webp',
        caption: 'Apresentação de estúdio — plano aproximado',
        altText: 'Chery Himla 4x4 2026 — apresentação de estúdio — plano aproximado',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/chery-himla/04-estudio-detalhe-frontal.webp',
        caption: 'Apresentação de estúdio — detalhe da dianteira',
        altText: 'Chery Himla 4x4 2026 — apresentação de estúdio — detalhe da dianteira',
        type: 'detail'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 5,
      doors: 4,
      luggage: 3,
      transmission: 'Automática / Manual',
      fuelType: 'Diesel',
      tankCapacity: '76 L',
      traction: '4x4 com reduzidas',
      airConditioning: true
    },
    features: ['Tração 4x4 com Bloqueio de Diferencial', 'Caixa de Carga com Revestimento', 'Suspensão Reforçada'],
    inclusions: ['Seguro contra Todos os Riscos', 'Assistência 24/7'],
    recommendedFor: ['Construção e Obras Públicas', 'Logística de Campo', 'Sector Agrícola']
  },
  {
    id: 'jmc-touring',
    slug: 'jmc-touring',
    name: 'JMC Touring 2026',
    brand: 'JMC',
    model: 'Touring 14L',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Nova na Frota 2026',
    availabilityTag: 'Sob Consulta',
    isAvailable: true,
    pricePerDayAOA: 369999,
    pricePerDayFormatted: '369.999 Kz',
    transferPriceAOA: 277499,
    transferPriceFormatted: '277.499 Kz',
    depositAOA: 180000,
    description: 'Van de passageiros de teto alto com lugares confortáveis para equipas e comitivas, boa insonorização e ar condicionado em todas as filas.',
    inconsistentDataNote: 'Ficha provisória — specs e tarifas a confirmar com a operação.',
    primaryImage: '/fleet-flyer-2026/jmc-touring/01-oficial.webp',
    gallery: [
      {
        url: '/fleet-flyer-2026/jmc-touring/01-oficial.webp',
        caption: 'Imagem oficial do catálogo PEPEK Rent A Car 2026',
        altText: 'JMC Touring 2026 — catálogo oficial PEPEK',
        type: 'exterior_front'
      },
      {
        url: '/fleet-carousel-generated/jmc-touring/01-estudio-principal.webp',
        caption: 'Apresentação de estúdio — vista principal',
        altText: 'JMC Touring 2026 — apresentação de estúdio — vista principal',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/jmc-touring/02-estudio-amplo.webp',
        caption: 'Apresentação de estúdio — enquadramento amplo',
        altText: 'JMC Touring 2026 — apresentação de estúdio — enquadramento amplo',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/jmc-touring/03-estudio-aproximado.webp',
        caption: 'Apresentação de estúdio — plano aproximado',
        altText: 'JMC Touring 2026 — apresentação de estúdio — plano aproximado',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/jmc-touring/04-estudio-detalhe-frontal.webp',
        caption: 'Apresentação de estúdio — detalhe da dianteira',
        altText: 'JMC Touring 2026 — apresentação de estúdio — detalhe da dianteira',
        type: 'detail'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 14,
      doors: 4,
      luggage: 10,
      transmission: 'Manual',
      fuelType: 'Diesel',
      tankCapacity: '80 L',
      airConditioning: true
    },
    features: ['Teto Alto', '14 Lugares com Cintos', 'Ar Condicionado de Teto'],
    inclusions: ['Seguro de Transporte de Passageiros', 'Motorista profissional'],
    recommendedFor: ['Transfers de Grupos', 'Equipas Técnicas', 'Logística de Eventos']
  },
  {
    id: 'jac-sunray',
    slug: 'jac-sunray',
    name: 'JAC Sunray 2026',
    brand: 'JAC',
    model: 'Sunray 18L',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Nova na Frota 2026',
    availabilityTag: 'Sob Consulta',
    isAvailable: true,
    pricePerDayAOA: 349999,
    pricePerDayFormatted: '349.999 Kz',
    transferPriceAOA: 262499,
    transferPriceFormatted: '262.499 Kz',
    depositAOA: 170000,
    description: 'Minibus de grande capacidade para transporte de passageiros em conforto, com layout de 18 lugares, entrada elevada e climatização reforçada para o clima de Angola.',
    inconsistentDataNote: 'Ficha provisória — specs e tarifas a confirmar com a operação.',
    primaryImage: '/fleet-flyer-2026/jac-sunray/01-oficial.webp',
    gallery: [
      {
        url: '/fleet-flyer-2026/jac-sunray/01-oficial.webp',
        caption: 'Imagem oficial do catálogo PEPEK Rent A Car 2026',
        altText: 'JAC Sunray 2026 — catálogo oficial PEPEK',
        type: 'exterior_front'
      },
      {
        url: '/fleet-carousel-generated/jac-sunray/01-estudio-principal.webp',
        caption: 'Apresentação de estúdio — vista principal',
        altText: 'JAC Sunray 2026 — apresentação de estúdio — vista principal',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/jac-sunray/02-estudio-amplo.webp',
        caption: 'Apresentação de estúdio — enquadramento amplo',
        altText: 'JAC Sunray 2026 — apresentação de estúdio — enquadramento amplo',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/jac-sunray/03-estudio-aproximado.webp',
        caption: 'Apresentação de estúdio — plano aproximado',
        altText: 'JAC Sunray 2026 — apresentação de estúdio — plano aproximado',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/jac-sunray/04-estudio-detalhe-frontal.webp',
        caption: 'Apresentação de estúdio — detalhe da dianteira',
        altText: 'JAC Sunray 2026 — apresentação de estúdio — detalhe da dianteira',
        type: 'detail'
      }
    ],
    specs: {
      color: 'Branca',
      passengers: 18,
      doors: 3,
      luggage: 12,
      transmission: 'Manual',
      fuelType: 'Diesel',
      tankCapacity: '90 L',
      airConditioning: true
    },
    features: ['18 Lugares com Cintos de Segurança', 'Bagageiro Superior Interno', 'Ar Condicionado Reforçado'],
    inclusions: ['Seguro de Transporte de Passageiros', 'Motorista credenciado'],
    recommendedFor: ['Delegações e Comitivas', 'Transporte de Equipas', 'Excursões Corporativas']
  },
  {
    id: 'baw-m7',
    slug: 'baw-m7',
    name: 'BAW M7 2026',
    brand: 'BAW',
    model: 'M7 MPV',
    year: '2026',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Nova na Frota 2026',
    availabilityTag: 'Sob Consulta',
    isAvailable: true,
    pricePerDayAOA: 359999,
    pricePerDayFormatted: '359.999 Kz',
    transferPriceAOA: 269999,
    transferPriceFormatted: '269.999 Kz',
    depositAOA: 160000,
    description: 'Monovolume moderno para transporte executivo de pequenos grupos, com bancos confortáveis, boa isolação acústica e saídas de ar condicionado para todas as filas.',
    inconsistentDataNote: 'Ficha provisória — specs e tarifas a confirmar com a operação.',
    primaryImage: '/fleet-flyer-2026/baw-m7/01-oficial.webp',
    gallery: [
      {
        url: '/fleet-flyer-2026/baw-m7/01-oficial.webp',
        caption: 'Imagem oficial do catálogo PEPEK Rent A Car 2026',
        altText: 'BAW M7 2026 — catálogo oficial PEPEK',
        type: 'exterior_front'
      },
      {
        url: '/fleet-carousel-generated/baw-m7/01-estudio-principal.webp',
        caption: 'Apresentação de estúdio — vista principal',
        altText: 'BAW M7 2026 — apresentação de estúdio — vista principal',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/baw-m7/02-estudio-amplo.webp',
        caption: 'Apresentação de estúdio — enquadramento amplo',
        altText: 'BAW M7 2026 — apresentação de estúdio — enquadramento amplo',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/baw-m7/03-estudio-aproximado.webp',
        caption: 'Apresentação de estúdio — plano aproximado',
        altText: 'BAW M7 2026 — apresentação de estúdio — plano aproximado',
        type: 'detail'
      },
      {
        url: '/fleet-carousel-generated/baw-m7/04-estudio-detalhe-frontal.webp',
        caption: 'Apresentação de estúdio — detalhe da dianteira',
        altText: 'BAW M7 2026 — apresentação de estúdio — detalhe da dianteira',
        type: 'detail'
      }
    ],
    specs: {
      color: 'Preta',
      passengers: 9,
      doors: 5,
      luggage: 6,
      transmission: 'Automática',
      fuelType: 'Gasolina',
      tankCapacity: '60 L',
      airConditioning: true
    },
    features: ['Bancos Individuais na 2.ª Fila', 'Portas Laterais Deslizantes', 'Climatização Multizona'],
    inclusions: ['Seguro contra Danos Próprios', 'Assistência 24 Horas'],
    recommendedFor: ['Comitivas Pequenas', 'Transfers Executivos', 'Equipas de Produção']
  }
];
