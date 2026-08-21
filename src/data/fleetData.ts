export interface VehicleDetail {
  id: string;
  name: string;
  subtitle: string;
  category: 'suv' | '4x4' | 'van' | 'protocol';
  categoryLabel: string;
  badge?: string;
  availabilityTag?: 'Disponível Agora em Talatona' | 'Prontidão Operacional' | 'Disponível sob Reserva';
  isMostRequested?: boolean;
  pricePerDayAOA: number;
  pricePerDayEUR: number;
  description: string;
  primaryImage: string;
  secondaryImage: string; // for instant hover crossfade
  gallery: Array<{
    url: string;
    caption: string;
    altText: string;
    type: 'exterior_front' | 'exterior_side' | 'interior' | 'detail' | 'context';
  }>;
  specs: {
    passengers: number;
    luggage: number;
    transmission: string;
    traction: string;
    fuelType: string;
    engine: string;
    armorProtection?: string;
    airConditioning: string;
    connectivity: string;
  };
  features: string[];
  inclusions: string[];
  recommendedFor: string[];
}

export const FLEET_DATABASE: VehicleDetail[] = [
  {
    id: 'suv-prado-lc300',
    name: 'Toyota Land Cruiser Prado TXL & LC300 VXR',
    subtitle: 'O Padrão Executivo de Excelência em Angola',
    category: 'suv',
    categoryLabel: 'SUV Executiva de Luxo',
    badge: 'Mais Solicitado',
    availabilityTag: 'Disponível Agora em Talatona',
    isMostRequested: true,
    pricePerDayAOA: 185000,
    pricePerDayEUR: 205,
    description: 'A referência incontornável para Embaixadas, Governos, Ministérios e Quadros Executivos de Multinacionais. Combina imponência visual, insonorização premium e suspensão adaptativa para o tráfego urbano de Luanda ou autoestradas provinciais.',
    primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
        caption: 'Vista Frontal 3/4 — Design imponente com grelha cromada e ópticas Full LED',
        altText: 'Toyota Land Cruiser Prado TXL vista frontal executiva — Pepek Grupo Rent-a-Car Luanda',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1600&q=85',
        caption: 'Perfil Lateral & Traseira — Linhas sólidas, jantes de liga leve 20" e vidros fumados de segurança',
        altText: 'Land Cruiser LC300 perfil lateral e traseira executiva — Aluguer de viaturas Luanda Angola',
        type: 'exterior_side'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Cockpit & Interior em Couro — Bancos ventilados com ajuste elétrico e painel multimédia táctil',
        altText: 'Interior bancos em couro premium e cockpit Land Cruiser — Aluguer VIP Luanda Pepek',
        type: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
        caption: 'Detalhe de Acabamento & Ecrãs Traseiros — Climatização Quad-Zone independente',
        altText: 'Detalhe de conforto traseiro para dignitários e diplomatas — Pepek Rent a Car Angola',
        type: 'detail'
      },
      {
        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85',
        caption: 'Em Operação — Despacho protocolar em Luanda com motorista bilingue credenciado',
        altText: 'Land Cruiser Prado em comitiva protocolar em Talatona Luanda — Pepek Grupo',
        type: 'context'
      }
    ],
    specs: {
      passengers: 7,
      luggage: 5,
      transmission: 'Automática 10 Velocidades',
      traction: '4WD Permanente com Multi-Terrain Select',
      fuelType: 'Diesel Turbo V6',
      engine: '3.3L V6 Twin-Turbo Diesel (304 CV)',
      armorProtection: 'B6 / Blindagem Nível III-A (Opcional)',
      airConditioning: 'Climatização Quad-Zone Automática Independente',
      connectivity: 'Apple CarPlay, Android Auto, Wi-Fi 4G Hotspot a bordo'
    },
    features: [
      'Bancos em couro premium ventilados e aquecidos',
      'Vidros fumados de alta densidade anti-impacto',
      'Sistema de Rastreio GPS Satelital 24/7 com botão de pânico',
      'Frigorífico de bordo integrado na consola central',
      'Câmara 360° com sensores de proximidade periféricos',
      'Suspensão adaptativa Kinetic Dynamic Suspension'
    ],
    inclusions: [
      'Seguro contra Todos os Riscos com cobertura total',
      'Motorista protocolar bilingue (Português/Inglês) com fato escuro',
      'Água mineral selada de cortesia e toalhetes refrescantes',
      'Substituição de viatura garantida em caso de imprevisto em <60 min'
    ],
    recommendedFor: [
      'Delegações Diplomáticas e Embaixadas',
      'Visitas de Estado, Chefes de Governo e Ministros',
      'Quadros de Direcção e CEOs de Multinacionais',
      'Transfers VIP Aeroporto 4 de Fevereiro / AIAAN'
    ]
  },
  {
    id: '4x4-hilux-offroad',
    name: 'Toyota Hilux Dupla Cabine 4x4 Off-Road',
    subtitle: 'Resistência Imparável para o Interior & Províncias',
    category: '4x4',
    categoryLabel: '4x4 Todo-Terreno & Operações',
    badge: 'Expedições & Minas',
    availabilityTag: 'Prontidão Operacional',
    pricePerDayAOA: 135000,
    pricePerDayEUR: 150,
    description: 'A viatura de eleição para deslocações a todas as 18 províncias angolanas (Huambo, Bengo, Bié, Benguela, Cabinda). Equipada com protecção de cárter, suspensão reforçada e tracção integral com redutoras para qualquer terreno.',
    primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85',
        caption: 'Vista Frontal 4x4 — Pára-choques reforçado e capacidade de vau de 700mm',
        altText: 'Toyota Hilux Dupla Cabine 4x4 todo-terreno — Aluguer para províncias Pepek Rent-a-Car',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1600&q=85',
        caption: 'Vista Lateral & Caixa de Carga — Caixa forrada com cobertura rígida trancável',
        altText: 'Toyota Hilux 4x4 lateral e caixa protegida — Mobilidade corporativa Angola',
        type: 'exterior_side'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
        caption: 'Interior Ergonómico — Ar condicionado reforçado para altas temperaturas tropicais',
        altText: 'Cockpit e cabine dupla Toyota Hilux — Pepek Grupo',
        type: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
        caption: 'Em Missão — Operações de campo em sectores petrolífero, mineiro e construção',
        altText: 'Toyota Hilux em estrada de terra batida no interior de Angola — Pepek Frota',
        type: 'context'
      }
    ],
    specs: {
      passengers: 5,
      luggage: 6,
      transmission: 'Manual / Automática 6 Velocidades',
      traction: '4x4 com Caixa Redutora (L4/H4/H2) e Bloqueio Traseiro',
      fuelType: 'Diesel Turbo D-4D',
      engine: '2.8L D-4D Turbo Diesel (204 CV)',
      airConditioning: 'Ar Condicionado Reforçado Tropicalizado',
      connectivity: 'Bluetooth, USB, Rádio VHF/HF (sob pedido)'
    },
    features: [
      'Pneus All-Terrain (A/T) com 2 pneus sobressalentes incluídos',
      'Protecção integral de cárter e depósito em duralumínio',
      'Snorkel de admissão de ar elevado para travessia de água/pó',
      'Kit de desatolamento (cintas de reboque, compressor 12V e manómetro)',
      'Localizador por satélite com aviso de saída de rota'
    ],
    inclusions: [
      'Seguro de danos próprios com cobertura de picadas e estaleiros',
      'Motorista-mecânico certificado para percursos de longa distância',
      'Assistência técnica móvel nas capitais provinciais'
    ],
    recommendedFor: [
      'Engenharia, Auditorias e Missões de Mineração/Petróleo',
      'ONGs, Agências das Nações Unidas e Embaixadas no Interior',
      'Viagens de longa distância Luanda ➔ Huambo / Benguela / Lubango'
    ]
  },
  {
    id: 'van-hiace-vip',
    name: 'Toyota Hiace VIP Executiva 12 Lugares',
    subtitle: 'Comitivas Diplomáticas, Cimeiras & Equipas de Alto Nível',
    category: 'van',
    categoryLabel: 'Van VIP & Transporte de Delegações',
    badge: 'Ideal para Grupos',
    availabilityTag: 'Disponível Agora em Talatona',
    pricePerDayAOA: 210000,
    pricePerDayEUR: 230,
    description: 'Configuração exclusiva executiva para 12 ocupantes em poltronas reclináveis individuais em pele. Ideal para transporte de delegações técnicas, delegações desportivas, comitivas internacionais e transfers de equipas executivas.',
    primaryImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85',
        caption: 'Vista Frontal — Design aerodinâmico moderno com vidros fumados executivos',
        altText: 'Toyota Hiace VIP Executiva 12L vista frontal — Pepek Grupo Aluguer Luanda',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
        caption: 'Vista Lateral — Porta de correr assistida com estribo retrátil para fácil acesso',
        altText: 'Toyota Hiace lateral porta assistida — Transporte de comitivas Luanda Angola',
        type: 'exterior_side'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Salão de Passageiros — 12 poltronas individuais com cintos de 3 pontos e saídas AC directas',
        altText: 'Interior poltronas executivas Toyota Hiace VIP — Pepek Rent-a-Car',
        type: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85',
        caption: 'Em Recepção Aeroporto — Embarque VIP no Aeroporto Internacional Dr. António Agostinho Neto',
        altText: 'Toyota Hiace transfer aeroporto Luanda AIAAN — Pepek Grupo',
        type: 'context'
      }
    ],
    specs: {
      passengers: 12,
      luggage: 10,
      transmission: 'Automática 6 Velocidades',
      traction: 'Traseira (RWD) com Controlo de Estabilidade VSC',
      fuelType: 'Diesel Turbo Intercooler',
      engine: '2.8L Turbo Diesel (177 CV)',
      airConditioning: 'Climatização Traseira com Difusores Individuais de Teto',
      connectivity: 'Tomadas USB em todas as filas + Sistema de Som com Microfone'
    },
    features: [
      'Poltronas individuais em pele com apoio de braço reclinável',
      'Porta lateral de abertura automática com iluminação de cortesia',
      'Espaço de bagagem modular traseiro para malas de viagem de grande volume',
      'Inversor de corrente 220V para carregamento de computadores portáteis',
      'Microfone a bordo para guia protocolar ou briefings de equipa'
    ],
    inclusions: [
      'Chauffeur profissional protocolar fardado',
      'Combustível inicial e seguro para todos os ocupantes',
      'Gestão de bagagens com etiquetas e identificação de voo'
    ],
    recommendedFor: [
      'Cimeiras Internacionais, Fóruns Económicos e Conferências',
      'Delegações de Embaixadas e Missões Multilaterais',
      'Transfers de Tripulações Aéreas e Equipas Petrolíferas (Offshore/Onshore)'
    ]
  },
  {
    id: '4x4-fortuner-v6',
    name: 'Toyota Fortuner 2.8 GD-6 4x4 Leather Edition',
    subtitle: 'Elegância Urbana & Potência 4x4 em Perfeita Harmonia',
    category: '4x4',
    categoryLabel: 'SUV 4x4 Versátil',
    badge: 'Disponível Agora',
    availabilityTag: 'Disponível Agora em Talatona',
    pricePerDayAOA: 155000,
    pricePerDayEUR: 170,
    description: 'A combinação ideal entre o requinte de uma SUV urbana de luxo e a capacidade de tração 4x4 para pisos irregulares. Muito procurada por directores regionais e consultores internacionais.',
    primaryImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85',
        caption: 'Vista Frontal — Design esculpido com assinatura luminosa LED Bi-Beam',
        altText: 'Toyota Fortuner 4x4 vista frontal — Aluguer executivo Luanda Pepek',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
        caption: 'Perfil — Guarda-lamas alargados e estribos laterais integrados',
        altText: 'Toyota Fortuner perfil lateral — Rent a Car Angola',
        type: 'exterior_side'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Interior — 7 lugares flexíveis com acabamento em pele castanha nobre',
        altText: 'Interior Toyota Fortuner bancos pele — Pepek Grupo',
        type: 'interior'
      }
    ],
    specs: {
      passengers: 7,
      luggage: 4,
      transmission: 'Automática 6 Velocidades com Patilhas no Volante',
      traction: '4x4 com Redutoras e Assistente de Descida DAC',
      fuelType: 'Diesel Turbo',
      engine: '2.8L GD-6 Turbo Diesel (204 CV)',
      airConditioning: 'Ar Condicionado Digital Bi-Zona com saídas traseiras',
      connectivity: 'Apple CarPlay, Android Auto, Bluetooth'
    },
    features: [
      'Bancos em pele nobre com regulações elétricas',
      'Portão da bagageira com abertura elétrica hands-free',
      'Câmara de marcha-atrás com guias dinâmicas de estacionamento',
      'Modos de condução Eco / Normal / Power'
    ],
    inclusions: [
      'Assistência 24 Horas em toda a província de Luanda e Bengo',
      'Seguro contra Todos os Riscos',
      'Viatura higienizada e selada antes de cada entrega'
    ],
    recommendedFor: [
      'Consultores Técnicos e Gestores de Projecto',
      'Famílias Diplomáticas e Viagens de Fim de Semana',
      'Supervisão de Obras e Infraestruturas'
    ]
  },
  {
    id: 'protocol-comitiva-escolta',
    name: 'Comboio Protocolar Escoltado & Segurança de Estado',
    subtitle: 'Soluções Integradas para Chefes de Estado & Cimeiras Internacionais',
    category: 'protocol',
    categoryLabel: 'Comboio & Escolta Protocolar',
    badge: 'Serviço de Estado',
    availabilityTag: 'Disponível sob Reserva',
    pricePerDayAOA: 480000,
    pricePerDayEUR: 525,
    description: 'Operação de mobilidade de máxima segurança constituída por múltiplos Land Cruiser Prado/LC300 idênticos pretos, com condutores treinados em condução evasiva e defensiva, comunicações encriptadas e veículo de reserva a fechar a comitiva.',
    primaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
        caption: 'Comboio em Formação — Viaturas pretas executivas alinhadas com rigor protocolar',
        altText: 'Comboio protocolar de estado Land Cruiser pretos — Pepek Grupo Luanda',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
        caption: 'Viatura Líder — Despacho com coordenação de tráfego e planeamento de rota segura',
        altText: 'Viatura executiva Land Cruiser escolta — Aluguer diplomático Luanda',
        type: 'context'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Interior de Segurança — Comunicações discretas e vidros reforçados de alta blindagem',
        altText: 'Interior de segurança diplomática — Pepek Grupo',
        type: 'interior'
      }
    ],
    specs: {
      passengers: 15,
      luggage: 20,
      transmission: 'Automática',
      traction: '4WD / Integral Permanente',
      fuelType: 'Diesel Turbo',
      engine: 'V6 / V8 Twin-Turbo',
      armorProtection: 'Blindagem Certificada DIS (Disponível sob requisição)',
      airConditioning: 'Climatização Total Independente',
      connectivity: 'Rádio Encriptado em Frequência Dedicada + Hotspot 5G Satélite'
    },
    features: [
      'Frota de viaturas homogéneas na cor preta executiva',
      'Motoristas com certificação de protecção a altas individualidades',
      'Plano de contingência com viatura reserva em prontidão permanente',
      'Coordenação prévia com equipas de protocolo e segurança nos aeroportos'
    ],
    inclusions: [
      'Equipa de coordenação operacional em Talatona dedicada 24/7',
      'Combustível e manutenções preventivas em regime prioritário',
      'Faturação centralizada e confidencialidade contratual estrita'
    ],
    recommendedFor: [
      'Chefes de Estado, Primeiros-Ministros e Secretários de Estado',
      'Embaixadores Extraordinários e Plenipotenciários',
      'Cimeiras da SADC, CPLP, União Africana e Visitas Oficiais'
    ]
  },
  {
    id: 'suv-range-rover-autobiography',
    name: 'Range Rover Autobiography LWB 4.4L V8',
    subtitle: 'A Quintessência do Luxo Executivo Britânico em Luanda',
    category: 'suv',
    categoryLabel: 'Ultra-Luxo & Prestígio',
    badge: 'Ultra-Luxo',
    availabilityTag: 'Disponível Agora em Talatona',
    pricePerDayAOA: 295000,
    pricePerDayEUR: 320,
    description: 'Versão Long Wheelbase (LWB) com poltronas traseiras Executive Class Comfort-Plus, massagem com pedras quentes, sistema de som Meridian Signature 1600W com cancelamento ativo de ruído e suspensão pneumática eletrónica adaptativa.',
    primaryImage: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1600&q=85',
        caption: 'Design Esculpido — Grelha Autobiography e óticas Digital LED com projeção de imagem',
        altText: 'Range Rover Autobiography LWB vista frontal executiva — Pepek Grupo',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
        caption: 'Perfil LWB Alongado — Portas com fecho suave assistido (Soft-Close) e vidros duplos acústicos',
        altText: 'Range Rover perfil lateral executivo Luanda — Pepek Rent-a-Car',
        type: 'exterior_side'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Salão Traseiro Executive Class — Consola central motorizada com ecrã táctil de 8" e frigorífico para champanhe',
        altText: 'Interior Range Rover Autobiography poltronas executivas — Pepek VIP',
        type: 'interior'
      }
    ],
    specs: {
      passengers: 4,
      luggage: 5,
      transmission: 'Automática ZF 8 Velocidades',
      traction: 'All-Wheel Drive Inteligente (iAWD) com Eixo Traseiro Direcional',
      fuelType: 'Gasolina Twin-Turbo V8',
      engine: '4.4L Twin-Turbocharged V8 (530 CV)',
      armorProtection: 'Vidros de Segurança Laminados Acústicos',
      airConditioning: 'Climatização Quad-Zone com Purificação de Ar Nanoe X',
      connectivity: 'Pivi Pro 13.1", Ecrãs Traseiros HD 11.4", Wi-Fi 5G Hotspot'
    },
    features: [
      'Poltronas Executive Class com 24 regulações e função de massagem',
      'Portas com assistência elétrica e fecho suave Soft-Close',
      'Ecrãs multimédia traseiros de 11.4" com HDMI e auscultadores sem fios',
      'Frigorífico de bordo integrado com capacidade para garrafas',
      'Sistema de som Meridian Signature 35 altifalantes com cancelamento de ruído'
    ],
    inclusions: [
      'Motorista executivo bilingue com uniforme de protocolo e luvas',
      'Bebidas premium de boas-vindas e snacks gourmet a bordo',
      'Acesso prioritário e receção personalizada no Aeroporto de Luanda',
      'Seguro VIP Total sem franquia'
    ],
    recommendedFor: [
      'CEOs de Multinacionais e Investidores Internacionais',
      'Embaixadores e Recepções Diplomáticas de Gala',
      'Cerimónias de Estado, Casamentos VIP e Cimeiras Económicas'
    ]
  },
  {
    id: 'protocol-mercedes-s-class',
    name: 'Mercedes-Benz Classe S S580 / Maybach Edition',
    subtitle: 'O Pináculo da Mobilidade Presidencial & Diplomática',
    category: 'protocol',
    categoryLabel: 'Sedan Presidencial de Luxo',
    badge: 'Presidencial',
    availabilityTag: 'Disponível sob Reserva',
    pricePerDayAOA: 340000,
    pricePerDayEUR: 370,
    description: 'O sedan de luxo mais prestigiado do mundo. Equipado com bancos First-Class Lounge reclináveis a 43.5 graus, suspensão E-Active Body Control que lê a estrada em tempo real e insonorização absoluta.',
    primaryImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85',
        caption: 'Frente Presidencial — Estrela Mercedes no capô com grelha cromada Maybach e Digital Light',
        altText: 'Mercedes-Benz Classe S S580 frente executiva — Pepek Grupo Rent-a-Car',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85',
        caption: 'Lateral Distinta — Distância entre eixos longa com jantes forjadas e vidros fumados escuros',
        altText: 'Mercedes Classe S perfil lateral — Aluguer executivo Luanda',
        type: 'exterior_side'
      },
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
        caption: 'Cabine First-Class — Pele Nappa Exclusive com costuras diamante e iluminação ambiente ativa de 64 cores',
        altText: 'Interior bancos traseiros Mercedes Classe S — Pepek VIP Luanda',
        type: 'interior'
      }
    ],
    specs: {
      passengers: 4,
      luggage: 4,
      transmission: '9G-TRONIC Automática',
      traction: '4MATIC Tração Integral Permanente',
      fuelType: 'Gasolina Mild-Hybrid V8 Biturbo',
      engine: '4.0L V8 Biturbo com EQ Boost (503 CV)',
      armorProtection: 'Vidros Laminados Reforçados Anti-Intrusão',
      airConditioning: 'Climatização Automática THERMOTRONIC Traseira',
      connectivity: 'MBUX High-End Traseiro com 2 Ecrãs OLED de 11.6" e Tablet Central'
    },
    features: [
      'Bancos Executive com apoio de pernas e massagem energizante',
      'Sistema de som Burmester High-End 4D Surround Sound',
      'Cortinas elétricas para as janelas traseiras e óculo traseiro',
      'Pacote Chauffeur com avanço elétrico do banco dianteiro do passageiro',
      'Suspensão AIRMATIC com amortecimento adaptativo contínuo'
    ],
    inclusions: [
      'Motorista protocolar oficial fardado e credenciado',
      'Água mineral termal, toalhetes e carregadores rápidos para iPhone/Android',
      'Despacho VIP porta-a-porta em Talatona, Miramar ou Aeroporto'
    ],
    recommendedFor: [
      'Chefes de Missão Diplomática e Embaixadores',
      'Ministros de Estado e Dignitários Estrangeiros',
      'Eventos de Alta Sociedade, Cimeiras e Aberturas Oficiais'
    ]
  },
  {
    id: 'suv-lexus-lx600-vip',
    name: 'Lexus LX 600 VIP 4-Lugares Executive Lounge',
    subtitle: 'Engenharia Japonesa de Ultra-Luxo & Fiabilidade Extrema',
    category: 'suv',
    categoryLabel: 'SUV VIP Ultra-Luxo',
    badge: 'Exclusivo VIP',
    availabilityTag: 'Disponível Agora em Talatona',
    pricePerDayAOA: 260000,
    pricePerDayEUR: 285,
    description: 'A versão mais luxuosa da gama Lexus. Configuração exclusiva de apenas 4 lugares para espaço infinito na 2ª fila, com bancos Ottoman com reclinação até 48 graus, massagem Shiatsu e suspensão hidráulica ativa AHC.',
    primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
        caption: 'Grelha Spindle Grille Imponente — Assinatura luminosa Triple-Beam LED',
        altText: 'Lexus LX600 VIP vista frontal — Pepek Rent a Car Angola',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Lounge Traseiro Ottoman — Poltronas com massagem Shiatsu e ecrã táctil de controlo central',
        altText: 'Interior Lexus LX600 bancos Ottoman — Pepek Grupo',
        type: 'interior'
      }
    ],
    specs: {
      passengers: 4,
      luggage: 5,
      transmission: 'Direct-Shift Automática 10 Velocidades',
      traction: 'Full-Time 4WD com Torsen LSD e Multi-Terrain Select',
      fuelType: 'Gasolina Twin-Turbo V6',
      engine: '3.5L Twin-Turbo V6 (415 CV)',
      armorProtection: 'Estrutura Reforçada GA-F e Vidros Acústicos Duplos',
      airConditioning: 'Lexus Climate Concierge com sensor de infravermelhos corporal',
      connectivity: 'Lexus Interface 12.3", Ecrãs Traseiros 11.6", Mark Levinson 25 Colunas'
    },
    features: [
      'Poltronas Ottoman traseiras com reclinação elétrica de 48° e apoio de pés',
      'Consola traseira exclusiva em madeira nobre com carregador por indução',
      'Sistema de áudio Mark Levinson Reference 3D Surround de 2400 Watts',
      'Suspensão Active Height Control (AHC) com ajuste de altura automático'
    ],
    inclusions: [
      'Motorista executivo bilingue',
      'Cobertura total de seguro e substituição de viatura em <45 min',
      'Frigorífico de bordo abastecido com água e refrigerantes'
    ],
    recommendedFor: [
      'Administradores e Presidentes de Conselhos de Administração (PCA)',
      'Altos Comissários e Representantes de Agências Internacionais',
      'Deslocações urbanas e interprovinciais com máximo conforto'
    ]
  },
  {
    id: 'van-vclass-maybach-vip',
    name: 'Mercedes-Benz Classe V Extra-Longa Maybach Executive',
    subtitle: 'Escritório Móvel de Primeira Classe para Direcção & Comitivas VIP',
    category: 'van',
    categoryLabel: 'Van VIP Maybach',
    badge: 'Escritório Móvel',
    availabilityTag: 'Disponível Agora em Talatona',
    pricePerDayAOA: 280000,
    pricePerDayEUR: 305,
    description: 'Transformação executiva de topo para 6 a 7 ocupantes com poltronas individuais face-a-face, mesa de reuniões dobrável, iluminação de teto tipo céu estrelado Rolls-Royce Starlight, TV HD de 32" e cafeteira Nespresso integrada.',
    primaryImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
        caption: 'Exterior Executivo — Linhas Maybach com jantes polidas e vidros de máxima privacidade',
        altText: 'Mercedes Classe V Maybach VIP vista exterior — Pepek Grupo',
        type: 'exterior_front'
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
        caption: 'Salão VIP Executivo — 4 poltronas Maybach reclináveis com mesa dobrável e ecrã de conferência',
        altText: 'Interior executivo Maybach Classe V — Pepek Rent a Car Luanda',
        type: 'interior'
      }
    ],
    specs: {
      passengers: 7,
      luggage: 8,
      transmission: '9G-TRONIC Automática',
      traction: 'Traseira / 4MATIC Integral',
      fuelType: 'Diesel Turbo OM654',
      engine: '2.0L Turbo Diesel 300d (239 CV)',
      armorProtection: 'Vidros Traseiros Escurecidos de Alta Segurança',
      airConditioning: 'TEMPMATIC Traseiro e Dianteiro com Controlo Automático',
      connectivity: 'Wi-Fi 5G a bordo, TV 32", Tomadas 220V e HDMI para apresentações'
    },
    features: [
      'Teto iluminado Starlight com constelações em fibra ótica',
      'Mesa de conferência elétrica retrátil para reuniões em trânsito',
      'Poltronas de couro capitoné Maybach com aquecimento, ventilação e massagem',
      'Divisória acústica entre cabine do motorista e salão de passageiros',
      'Máquina de café e frigorífico para garrafas de champanhe/água'
    ],
    inclusions: [
      'Chauffeur executivo com fato escuro e protocolo de comitiva',
      'Serviço de bordo com café, água mineral e toalhetes',
      'Seguro total de ocupantes e bagagens'
    ],
    recommendedFor: [
      'Reuniões de Direção e Roadshows Financeiros em Trânsito',
      'Transfers de Delegações Estrangeiras e Equipas Ministeriais',
      'Artistas Internacionais, Produtores e Eventos de Prestígio'
    ]
  }
];

