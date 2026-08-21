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
    name: 'Range Rover Blindado 2025',
    brand: 'Land Rover',
    model: 'Range Rover Blindado',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Máxima Segurança',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isArmored: true,
    isFeatured: true,
    pricePerDayAOA: 1999999,
    pricePerDayFormatted: '1.999.999 Kz',
    depositAOA: 500000,
    description: 'Veículo de alta segurança com blindagem balística de nível internacional, conforto supremo e tecnologia de ponta para transporte de altas individualidades e delegações diplomáticas em Angola.',
    primaryImage: '/rent_car/RANGEROVER-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=85',
        caption: 'Frente Imponente — Blindagem Nível B6 com vidros balísticos de alta densidade',
        altText: 'Range Rover Blindado 2025 vista frontal — Pepek Rent a Car Angola'
      },
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        caption: 'Perfil Executivo — Pneus run-flat de segurança reforçada e insonorização total',
        altText: 'Range Rover Blindado perfil lateral — Pepek Grupo'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        caption: 'Interior First-Class — Bancos em couro perfurado com massagem e ecrãs traseiros',
        altText: 'Interior Range Rover blindado executivo — Pepek VIP'
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
    name: 'Mercedes Classe S 2025',
    brand: 'Mercedes-Benz',
    model: 'Classe S',
    year: '2025',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Presidencial',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 1449999,
    pricePerDayFormatted: '1.449.999 Kz',
    depositAOA: 400000,
    description: 'O padrão de luxo global por excelência. Equipado com bancos traseiros reclináveis tipo Lounge, iluminação ambiente ativa e suspensão inteligente AIRMATIC que anula qualquer imperfeição da via.',
    primaryImage: '/rent_car/MERCEDES-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Frente Presidencial — Óticas Digital Light e assinatura cromada no capô',
        altText: 'Mercedes Classe S 2025 frente executiva — Pepek Rent a Car'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Salão Traseiro — Bancos Executive em pele Nappa com climatização independente',
        altText: 'Interior Mercedes Classe S 2025 — Pepek Grupo Luanda'
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
    name: 'Range Rover Novo Modelo',
    brand: 'Land Rover',
    model: 'Range Rover',
    year: '2024',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Nova Geração',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 1449999,
    pricePerDayFormatted: '1.449.999 Kz',
    depositAOA: 400000,
    description: 'A mais recente geração do ícone de luxo britânico. Design minimalista exterior e requinte artesanal no habitáculo com tração integral e capacidade de cruzeiro inigualável.',
    primaryImage: '/rent_car/RANGER_ROVER-Me74FJj3QHuV8v2T8_78CQ-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        caption: 'Linhas Esculpidas — Traseira integrada com faróis ocultos e teto panorâmico',
        altText: 'Range Rover Novo Modelo perfil — Pepek Rent a Car'
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
    badge: 'AMG Performance',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 999999,
    pricePerDayFormatted: '999.999 Kz',
    depositAOA: 350000,
    description: 'O todo-terreno mais desejado do mundo. Motor 4.0L V8 Biturbo AMG com aceleração estonteante e presença cénica imponente para eventos de prestígio.',
    primaryImage: '/rent_car/MERCEDES_G63-gHG0ppvUDrfx6Pj0ZF1CWg-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85',
        caption: 'G63 AMG — Grelha Panamericana e escapes laterais duplos AMG',
        altText: 'Mercedes G63 2023 — Pepek Grupo'
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
    name: 'Lexus 600',
    brand: 'Lexus',
    model: 'LX 600',
    year: '2023',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Ultra-Luxo',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 800000,
    pricePerDayFormatted: '800.000 Kz',
    depositAOA: 300000,
    description: 'O SUV topo de gama japonês com fiabilidade inabalável e refinamento artesanal Takumi. 7 lugares amplos e suspensão hidráulica adaptativa para viagens confortáveis.',
    primaryImage: '/rent_car/LEXUS-600-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Frente Esculpida — Grelha Spindle Grille e luzes Triple-LED',
        altText: 'Lexus 600 — Pepek Rent a Car'
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
    name: 'Mercedes Vito',
    brand: 'Mercedes-Benz',
    model: 'Vito Executiva',
    year: '2023',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: '9 Lugares VIP',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    depositAOA: 250000,
    description: 'Transporte executivo espaçoso para 9 ocupantes com poltronas ergonómicas individuais, ar condicionado traseiro reforçado e espaço generoso para bagagens.',
    primaryImage: '/rent_car/MERCEDES-f-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mercedes Vito — Conforto para equipas e comitivas',
        altText: 'Mercedes Vito Executiva — Pepek Grupo'
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
    name: 'Mercedes G63',
    brand: 'Mercedes-Benz',
    model: 'G63',
    year: '2022',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'AMG Clássico',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    depositAOA: 250000,
    description: 'A clássica força bruta e estatuto do Classe G em configuração diesel robusta e económica com interior em pele e suspensão adaptativa.',
    primaryImage: '/rent_car/MERCEDES_G63-gHG0ppvUDrfx6Pj0ZF1CWg-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mercedes G63 Preto Executivo',
        altText: 'Mercedes G63 preto — Pepek Rent a Car'
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
    name: 'Toyota LC300 2023',
    brand: 'Toyota',
    model: 'Land Cruiser 300 VXR',
    year: '2023',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Mais Solicitado',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 599999,
    pricePerDayFormatted: '599.999 Kz',
    depositAOA: 250000,
    description: 'O topo da frota governamental e diplomática em Angola. Motor 3.3L Twin-Turbo Diesel de 304 CV com suspensão Kinetic Dynamic e 7 lugares de absoluto luxo.',
    primaryImage: '/rent_car/TOYOTA_LCRUISER_VR-IKjhTo9IFwGwNmmSGebiVQ-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota LC300 VXR — Frente com grelha cromada imponente e ópticas Full LED',
        altText: 'Toyota LC300 2023 — Pepek Grupo'
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
    name: 'Lexus 570',
    brand: 'Lexus',
    model: 'LX 570',
    year: '2021',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'V8 Potência',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 500000,
    pricePerDayFormatted: '500.000 Kz',
    depositAOA: 200000,
    description: 'SUV de prestígio clássico com lendário motor 5.7L V8 naturalmente aspirado, interior artesanal e suspensão pneumática de extrema suavidade.',
    primaryImage: '/rent_car/LEXUS_570-E62fReUtK2_INVmKUZaIFQ-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Lexus LX 570 — Silhueta Executiva',
        altText: 'Lexus 570 — Pepek Rent a Car'
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
    name: 'Range Rover',
    brand: 'Land Rover',
    model: 'Range Rover Vogue',
    year: '2021',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Luxo Clássico',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 499999,
    pricePerDayFormatted: '499.999 Kz',
    depositAOA: 200000,
    description: 'Requinte e distinção britânica com suspensão a ar autonivelante, vidros duplos insonorizados e excelente desempenho urbano em Luanda.',
    primaryImage: '/rent_car/RANG-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        caption: 'Range Rover Vogue Preto',
        altText: 'Range Rover — Pepek Grupo'
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
    name: 'Toyota LC V8 2021',
    brand: 'Toyota',
    model: 'Land Cruiser 200 V8',
    year: '2021',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Lendário V8',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 449999,
    pricePerDayFormatted: '449.999 Kz',
    depositAOA: 200000,
    description: 'O inquebrável Land Cruiser 200 com motor 4.5L V8 Twin-Turbo Diesel. A viatura preferida para viagens interprovinciais com total segurança e potência.',
    primaryImage: '/rent_car/TOYOTA-LC-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Land Cruiser V8 Preto',
        altText: 'Toyota LC V8 2021 — Pepek Rent a Car'
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
    name: 'Mercedes CLS63',
    brand: 'Mercedes-Benz',
    model: 'CLS 63 AMG',
    year: '2020',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Coupé Desportivo',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 399999,
    pricePerDayFormatted: '399.999 Kz',
    depositAOA: 200000,
    description: 'Coupé de 4 portas com linhas arrebatadoras e performance de superdesportivo. Ideal para casamentos, produções e chegadas de alto impacto.',
    primaryImage: '/rent_car/MERCEDES-CLS63-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mercedes CLS63 Branco — Silhueta Aerodinâmica',
        altText: 'Mercedes CLS63 — Pepek Grupo'
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
    name: 'Mercedes Brabus',
    brand: 'Mercedes-Benz',
    model: 'Brabus Edition',
    year: '2021',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Edição Especial',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 399999,
    pricePerDayFormatted: '399.999 Kz',
    depositAOA: 200000,
    description: 'Personalização exclusiva Brabus com kit estético aerodinâmico em fibra de carbono, jantes forjadas e sonoridade desportiva marcante.',
    primaryImage: '/rent_car/MERCEDES_BRABUS-a1w-yJcKQK5-vSp3-fxwJg-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mercedes Brabus Preto',
        altText: 'Mercedes Brabus — Pepek Rent a Car'
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
    name: 'Volvo XC60',
    brand: 'Volvo',
    model: 'XC60 Inscription',
    year: '2022',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Segurança Máxima',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 349999,
    pricePerDayFormatted: '349.999 Kz',
    depositAOA: 150000,
    description: 'Design escandinavo elegante e o mais avançado pacote de segurança ativa do mundo (Pilot Assist, City Safety e visão 360°).',
    primaryImage: '/rent_car/VOLVO-XC-60-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Volvo XC60 Branco — Elegância Nórdica',
        altText: 'Volvo XC60 — Pepek Grupo'
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
    name: 'Novo Toyota Prado',
    brand: 'Toyota',
    model: 'Land Cruiser Prado 250',
    year: '2024',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Último Lançamento',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 349999,
    pricePerDayFormatted: '349.999 Kz',
    depositAOA: 180000,
    description: 'A mais recente geração do Prado com design retro-moderno robusto, novo chassis TNGA-F e tecnologia off-road de última geração.',
    primaryImage: '/rent_car/NEW-TOYOTA-1-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Novo Prado 250 Preto',
        altText: 'Novo Toyota Prado — Pepek Rent a Car'
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
    name: 'Nissan Patrol',
    brand: 'Nissan',
    model: 'Patrol V8 Platinum',
    year: '2022',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'V8 Rei das Dunas',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 349999,
    pricePerDayFormatted: '349.999 Kz',
    depositAOA: 180000,
    description: 'O gigante dos SUVs com motor 5.6L V8 de 400 CV e depósito colossal de 140 L para autonomia ilimitada em qualquer viagem por Angola.',
    primaryImage: '/rent_car/NISSAN-PATROL-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Nissan Patrol Platinum V8',
        altText: 'Nissan Patrol — Pepek Grupo'
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
    name: 'Toyota Prado Atual',
    brand: 'Toyota',
    model: 'Land Cruiser Prado TXL',
    year: '2022',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Popular Executivo',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 289999,
    pricePerDayFormatted: '289.999 Kz',
    depositAOA: 150000,
    description: 'A referência mais fiável para deslocações executivas diárias em Luanda e no interior. 7 lugares, ar condicionado potente e tração 4x4 integral.',
    primaryImage: '/rent_car/NEW-TOYOTA-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Prado TXL Preto',
        altText: 'Toyota Prado Atual — Pepek Rent a Car'
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
    name: 'Toyota Fortuner Atual',
    brand: 'Toyota',
    model: 'Fortuner 2.8 GD-6',
    year: '2023',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Versátil 4x4',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 229999,
    pricePerDayFormatted: '229.999 Kz',
    depositAOA: 120000,
    description: 'Elegância urbana combinada com capacidade 4x4. Equipada com interior refinado, 7 lugares e motor turbodiesel de grande resposta.',
    inconsistentDataNote: 'Marcado para revisão interna de lotação.',
    primaryImage: '/rent_car/TOYOTA-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Fortuner Branca',
        altText: 'Toyota Fortuner Atual — Pepek Grupo'
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
    name: 'Toyota Fortuner 2023',
    brand: 'Toyota',
    model: 'Fortuner',
    year: '2023',
    category: 'luxo',
    categoryLabel: 'Luxo e Executivo',
    badge: 'Conforto & Robustez',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 199999,
    pricePerDayFormatted: '199.999 Kz',
    depositAOA: 100000,
    description: 'SUV 4x4 espaçosa para 7 ocupantes com ar condicionado reforçado e consumo eficiente em circuitos urbanos ou rurais.',
    primaryImage: '/rent_car/TOYOTA-300x300 (1).webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Fortuner 2023 Preta',
        altText: 'Toyota Fortuner 2023 — Pepek Rent a Car'
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
    name: 'Mercedes-Benz V300 Class',
    brand: 'Mercedes-Benz',
    model: 'Classe V 300d',
    year: '2023',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Van VIP Maybach',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 800000,
    pricePerDayFormatted: '800.000 Kz',
    depositAOA: 300000,
    description: 'O mais luxuoso transporte de passageiros em Angola. 7 poltronas individuais face-a-face em pele com climatização independente, mesa dobrável e acabamentos de altíssimo padrão.',
    primaryImage: '/rent_car/bc-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mercedes-Benz Classe V 300d Branco Executivo',
        altText: 'Mercedes-Benz V300 Class — Pepek Grupo'
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
    name: 'Hyundai Staria Executiva',
    brand: 'Hyundai',
    model: 'Staria Lounge',
    year: '2023',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: 'Design Futurista',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 449999,
    pricePerDayFormatted: '449.999 Kz',
    depositAOA: 200000,
    description: 'Design espacial futurista com janelas panorâmicas de grandes dimensões, 9 lugares VIP e bancos de relaxamento com apoio de pernas.',
    primaryImage: '/rent_car/HYUNDAI-STARIA-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai Staria Executiva Branca',
        altText: 'Hyundai Staria Executiva — Pepek Rent a Car'
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
    name: 'Toyota Coaster',
    brand: 'Toyota',
    model: 'Coaster 30L',
    year: '2022',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '30 Lugares',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 399999,
    pricePerDayFormatted: '399.999 Kz',
    depositAOA: 200000,
    description: 'Minibus de grande capacidade para transporte confortável de 30 pessoas com ar condicionado potente para o clima de Angola, microfone e bagageiro.',
    primaryImage: '/rent_car/TOYOTA-coast-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Coaster 30 Lugares Branco',
        altText: 'Toyota Coaster — Pepek Grupo'
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
    name: 'Mercedes Sprinter Atual',
    brand: 'Mercedes-Benz',
    model: 'Sprinter 21L',
    year: '2022',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '21 Lugares Executiva',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 369999,
    pricePerDayFormatted: '369.999 Kz',
    depositAOA: 180000,
    description: 'Van executiva de 21 lugares com teto alto, poltronas reclináveis individuais em pele, estribo de acesso elétrico e excelente insonorização.',
    primaryImage: '/rent_car/sprinter-furgon-m_tjweHsHe-filters1000x_-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mercedes Sprinter 21 Lugares Preto',
        altText: 'Mercedes Sprinter Atual — Pepek Rent a Car'
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
    name: 'Hyundai Staria Atual',
    brand: 'Hyundai',
    model: 'Staria 11L',
    year: '2023',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '11 Lugares',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 359999,
    pricePerDayFormatted: '359.999 Kz',
    depositAOA: 150000,
    description: 'Espaço para 11 pessoas com conforto moderno, saídas de ar condicionado em todas as filas e design contemporâneo.',
    primaryImage: '/rent_car/HYUNDAI-TARIA-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai Staria 11 Lugares Preto',
        altText: 'Hyundai Staria Atual — Pepek Grupo'
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
    name: 'Nova Toyota Hiace',
    brand: 'Toyota',
    model: 'Hiace Novo Modelo 15L',
    year: '2023',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '15 Lugares Nova Geração',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 359999,
    pricePerDayFormatted: '359.999 Kz',
    depositAOA: 150000,
    description: 'A nova geração da Toyota Hiace com capô dianteiro semi-avançado para maior segurança, 15 lugares e condução suave.',
    primaryImage: '/rent_car/fazer-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Nova Toyota Hiace 15 Lugares',
        altText: 'Nova Toyota Hiace — Pepek Rent a Car'
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
    name: 'Hyundai H1',
    brand: 'Hyundai',
    model: 'H1 12L',
    year: '2022',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '12 Lugares',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 349999,
    pricePerDayFormatted: '349.999 Kz',
    depositAOA: 150000,
    description: 'Minivan executiva confortável para 12 pessoas com bancos reconfiguráveis, portas laterais de correr em ambos os lados e ar condicionado independente.',
    primaryImage: '/rent_car/HYUNDAI-H1-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai H1 Preto 12 Lugares',
        altText: 'Hyundai H1 — Pepek Grupo'
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
    name: 'Toyota Hiace',
    brand: 'Toyota',
    model: 'Hiace Clássica 15L',
    year: '2021',
    category: 'vans',
    categoryLabel: 'Vans e Transporte',
    badge: '15 Lugares Clássica',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 199999,
    pricePerDayFormatted: '199.999 Kz',
    depositAOA: 100000,
    description: 'A van de trabalho e transporte de passageiros mais robusta e testada em Angola. 15 lugares com ar condicionado e manutenção 100% garantida.',
    primaryImage: '/rent_car/TOYOTA-HIACE-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Hiace Branca',
        altText: 'Toyota Hiace — Pepek Rent a Car'
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
    name: 'Jetour X70',
    brand: 'Jetour',
    model: 'X70 7L',
    year: '2023',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: '7 Lugares Espaçoso',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 189999,
    pricePerDayFormatted: '189.999 Kz',
    depositAOA: 80000,
    description: 'SUV moderna com 7 lugares, teto solar panorâmico, ecrã multimédia de 10.1" e excelente relação custo-benefício para famílias e equipas.',
    primaryImage: '/rent_car/JETOUR-X70-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Jetour X70 Branco',
        altText: 'Jetour X70 — Pepek Grupo'
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
    name: 'Hyundai Santa Fé',
    brand: 'Hyundai',
    model: 'Santa Fé',
    year: '2022',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Conforto Familiar',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 149999,
    pricePerDayFormatted: '149.999 Kz',
    depositAOA: 75000,
    description: 'SUV refinada com 5 lugares, condução silenciosa, acabamento de topo e tecnologia de assistência ao condutor.',
    primaryImage: '/rent_car/HYUNDAIS-SANTA-FE-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai Santa Fé Branca',
        altText: 'Hyundai Santa Fé — Pepek Rent a Car'
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
    name: 'Hyundai Tucson',
    brand: 'Hyundai',
    model: 'Tucson',
    year: '2023',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Design Dinâmico',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 149999,
    pricePerDayFormatted: '149.999 Kz',
    depositAOA: 75000,
    description: 'SUV compacta premium com assinatura luminosa paramétrica oculta, interior digital e condução ágil no trânsito de Luanda.',
    primaryImage: '/rent_car/gdfhgdf-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai Tucson Branco',
        altText: 'Hyundai Tucson — Pepek Grupo'
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
    name: 'Chery Tiggo 7',
    brand: 'Chery',
    model: 'Tiggo 7 Pro',
    year: '2023',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Tecnologia & Conforto',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 149999,
    pricePerDayFormatted: '149.999 Kz',
    depositAOA: 75000,
    description: 'SUV com motor turbo, teto panorâmico, bancos em pele com ajuste elétrico e excelente espaço para 5 passageiros.',
    primaryImage: '/rent_car/Sem-Titulo-2-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Chery Tiggo 7 Preto',
        altText: 'Chery Tiggo 7 — Pepek Rent a Car'
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
    name: 'Chery Tiggo 2',
    brand: 'Chery',
    model: 'Tiggo 2',
    year: '2022',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'Crossover Económico',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 129999,
    pricePerDayFormatted: '129.999 Kz',
    depositAOA: 60000,
    description: 'Crossover compacto com altura ao solo elevada para enfrentar pisos irregulares em Luanda, com excelente economia de combustível.',
    primaryImage: '/rent_car/CHERY-TIGGO-2-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Chery Tiggo 2 Vermelho',
        altText: 'Chery Tiggo 2 — Pepek Grupo'
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
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    model: 'Creta',
    year: '2023',
    category: 'suvs',
    categoryLabel: 'SUVs',
    badge: 'SUV Urbana Ágil',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 129999,
    pricePerDayFormatted: '129.999 Kz',
    depositAOA: 60000,
    description: 'SUV compacta muito procurada pela sua robustez, posição de condução elevada, ar condicionado eficiente e facilidade de estacionamento.',
    primaryImage: '/rent_car/HYUNDAI-CRETA-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai Creta Vermelho',
        altText: 'Hyundai Creta — Pepek Rent a Car'
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
    name: 'Toyota LC HZ',
    brand: 'Toyota',
    model: 'Land Cruiser Série 70 HZJ',
    year: '2022',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Mito Todo-Terreno',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 259999,
    pricePerDayFormatted: '259.999 Kz',
    depositAOA: 150000,
    description: 'O clássico Land Cruiser Série 70 com motor diesel 4.2L 1HZ inquebrável, chassis de longarinas reforçado e capacidade para qualquer picada em Angola.',
    primaryImage: '/rent_car/TOYOTA-LC-HZ-1-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota LC HZ Bege — Força Pura',
        altText: 'Toyota LC HZ — Pepek Grupo'
      }
    ],
    specs: {
      color: 'Bege',
      passengers: 5,
      doors: 2,
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
    name: 'Toyota LC HZ 18P',
    brand: 'Toyota',
    model: 'Land Cruiser Série 78 Troopy',
    year: '2022',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Tropas & Expedições',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 249999,
    pricePerDayFormatted: '249.999 Kz',
    depositAOA: 150000,
    description: 'Versão Troop Carrier de caixa longa para transporte de equipas técnicas com bancos longitudinais traseiros e tanque duplo de combustível.',
    inconsistentDataNote: 'Capacidade de 13 passageiros marcada para revisão técnica.',
    primaryImage: '/rent_car/Manual-ou-Automatica-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota LC HZ 18P Branco',
        altText: 'Toyota LC HZ 18P — Pepek Rent a Car'
      }
    ],
    specs: {
      color: 'Branco',
      passengers: 13,
      doors: 2,
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
    name: 'Mitsubishi Canter',
    brand: 'Mitsubishi',
    model: 'Canter Caixa Aberta/Fechada',
    year: '2021',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Camião Ligeiro',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 159999,
    pricePerDayFormatted: '159.999 Kz',
    depositAOA: 100000,
    description: 'Camião ligeiro de carga com grande capacidade volumétrica e de peso. Ideal para mudanças corporativas, logística de eventos e transporte de equipamentos.',
    primaryImage: '/rent_car/MITSUBISHI-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mitsubishi Canter Branco',
        altText: 'Mitsubishi Canter — Pepek Grupo'
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
    name: 'Mitsubishi L200',
    brand: 'Mitsubishi',
    model: 'L200 Sportero 4x4',
    year: '2022',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'Pick-up Resistente',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 159999,
    pricePerDayFormatted: '159.999 Kz',
    depositAOA: 80000,
    description: 'Pick-up cabine dupla com sistema de tração Super Select 4WD-II, caixa de carga espaçosa e excelente conforto para 5 ocupantes.',
    primaryImage: '/rent_car/MITSUBISHI-L200-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Mitsubishi L200 Azul',
        altText: 'Mitsubishi L200 — Pepek Rent a Car'
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
    name: 'Toyota Hilux',
    brand: 'Toyota',
    model: 'Hilux Dupla Cabine 4x4',
    year: '2023',
    category: 'pickups',
    categoryLabel: 'Pick-ups e Camiões',
    badge: 'A Mais Procurada',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 159999,
    pricePerDayFormatted: '159.999 Kz',
    depositAOA: 80000,
    description: 'A pick-up número um em Angola. Lendária durabilidade para minas, estaleiros ou viagens a qualquer das 18 províncias.',
    primaryImage: '/rent_car/TOYOTAHILUX-300x300.webp',
    secondaryImage: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Hilux Dupla Cabine Branca 4x4',
        altText: 'Toyota Hilux — Pepek Grupo'
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
    name: 'Suzuki Swift',
    brand: 'Suzuki',
    model: 'Swift 1.2 GLX',
    year: '2023',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Super Económico',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 69999,
    pricePerDayFormatted: '69.999 Kz',
    depositAOA: 40000,
    description: 'Hatchback moderno com design jovial, consumo ultra-baixo (5.0L/100km), ar condicionado potente e facilidade máxima de condução.',
    primaryImage: '/rent_car/SUZUKI-SWIFT-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Suzuki Swift Vermelho',
        altText: 'Suzuki Swift — Pepek Rent a Car'
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
    name: 'Suzuki Baleno',
    brand: 'Suzuki',
    model: 'Baleno 1.5 GLX',
    year: '2023',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Espaçoso',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 69999,
    pricePerDayFormatted: '69.999 Kz',
    depositAOA: 40000,
    description: 'Hatchback espaçoso com excelente espaço para pernas nos bancos traseiros, bagageira generosa e câmara 360° no modelo de topo.',
    primaryImage: '/rent_car/SUZUKI-BALENO-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Suzuki Baleno Vermelho',
        altText: 'Suzuki Baleno — Pepek Grupo'
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
    name: 'Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: '2022',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Design Moderno',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 59999,
    pricePerDayFormatted: '59.999 Kz',
    depositAOA: 35000,
    description: 'Carro citadino europeu com acabamento de qualidade, estabilidade excelente em autoestrada e ar condicionado digital.',
    primaryImage: '/rent_car/i20-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai i20 Vermelho',
        altText: 'Hyundai i20 — Pepek Rent a Car'
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
    name: 'Suzuki S-Presso',
    brand: 'Suzuki',
    model: 'S-Presso',
    year: '2023',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Mini-SUV Ágil',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 59999,
    pricePerDayFormatted: '59.999 Kz',
    depositAOA: 35000,
    description: 'Mini-SUV compacta com altura ao solo de 180mm que ultrapassa lombas e buracos com facilidade. Consumo impressionante de 4.5L/100km.',
    primaryImage: '/rent_car/SUZUKI-SPRESSO-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Suzuki S-Presso Preto',
        altText: 'Suzuki S-Presso — Pepek Grupo'
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
    name: 'Toyota Starlet',
    brand: 'Toyota',
    model: 'Starlet 1.4',
    year: '2023',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Fiabilidade Toyota',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 59999,
    pricePerDayFormatted: '59.999 Kz',
    depositAOA: 35000,
    description: 'A fiabilidade lendária da Toyota num formato económico e prático para o dia-a-dia na capital.',
    primaryImage: '/rent_car/starlete-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Toyota Starlet Castanho',
        altText: 'Toyota Starlet — Pepek Rent a Car'
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
    name: 'Hyundai Grand i10',
    brand: 'Hyundai',
    model: 'Grand i10',
    year: '2022',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Prático Citadino',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 49999,
    pricePerDayFormatted: '49.999 Kz',
    depositAOA: 30000,
    description: 'Carro compacto económico com 5 lugares, fácil de manobrar e estacionar em qualquer rua de Luanda.',
    primaryImage: '/rent_car/HYUNDAI-G.-I10-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hyundai Grand i10',
        altText: 'Hyundai Grand i10 — Pepek Grupo'
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
    name: 'Kia Morning',
    brand: 'Kia',
    model: 'Morning / Picanto',
    year: '2022',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Super Tarifa',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 44999,
    pricePerDayFormatted: '44.999 Kz',
    depositAOA: 25000,
    description: 'Uma das tarifas mais acessíveis da frota. Ideal para deslocações pontuais, compras ou gestão pessoal.',
    primaryImage: '/rent_car/KIA-MORNING-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Kia Morning Cinza',
        altText: 'Kia Morning — Pepek Rent a Car'
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
    name: 'Suzuki Celerio',
    brand: 'Suzuki',
    model: 'Celerio',
    year: '2022',
    category: 'economicos',
    categoryLabel: 'Económicos',
    badge: 'Mais Económico',
    availabilityTag: 'Disponível',
    isAvailable: true,
    pricePerDayAOA: 44999,
    pricePerDayFormatted: '44.999 Kz',
    depositAOA: 25000,
    description: 'O campeão da poupança de combustível em Luanda. Condução leve, ar condicionado e manutenção sempre em dia.',
    primaryImage: '/rent_car/Suzuk-celero1-1-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        caption: 'Suzuki Celerio Azul',
        altText: 'Suzuki Celerio — Pepek Grupo'
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
    name: 'Limousine',
    brand: 'Lincoln / Cadillac',
    model: 'Presidential Stretch Limousine',
    year: '2023',
    category: 'eventos',
    categoryLabel: 'Eventos Especiais',
    badge: 'Super VIP & Gala',
    availabilityTag: 'Disponível',
    isAvailable: true,
    isFeatured: true,
    pricePerDayAOA: 999999,
    pricePerDayFormatted: '999.999 Kz',
    depositAOA: 300000,
    description: 'Limousine executiva estendida para 20 ocupantes com bar embutido com flautas de cristal, iluminação estroboscópica de discoteca e fibra ótica, ecrãs LED e privacidade total com divisória acústica.',
    primaryImage: '/rent_car/Aluguer-de-limozine-em-Angola-300x300.webp',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Limousine Executiva Preta — Impacto Visual Incomparável',
        altText: 'Limousine — Pepek Rent a Car Angola'
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
  }
];
