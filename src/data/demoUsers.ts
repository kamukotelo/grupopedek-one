import { UserProfile, InvoiceItem, FleetTelemetryItem, OdooSyncStatus } from '../types/auth';

// ─────────────────────────────────────────────────────────────────────────────
// DEMO PERSONAS — Ambiente de Staging / Desenvolvimento APENAS
// TODOS os dados abaixo são FICTÍCIOS para fins de demonstração.
// TODO: PLACEHOLDER — substituir com autenticação real antes do lançamento público.
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_USERS: Record<string, UserProfile> = {
  cliente_vip: {
    id: 'demo_vip_001',
    name: 'S. Exa. Cliente VIP Diplomático (Demo)', // TODO: PLACEHOLDER
    email: 'demo.vip@pepekgrupo.com',               // TODO: PLACEHOLDER
    phone: '+244 9XX XXX XXX',                       // TODO: PLACEHOLDER
    role: 'cliente_vip',
    roleLabel: 'Cliente VIP Diplomático',
    company: 'Embaixada Parceira (Demo)',            // TODO: PLACEHOLDER — não identificar entidade real
    nif: '000000000',                               // TODO: PLACEHOLDER — NIF de demonstração
    tier: 'Diplomático',
    creditLimitAOA: 45000000,                        // TODO: PLACEHOLDER
    activeRentalsCount: 3
  },
  cliente_normal: {
    id: 'demo_norm_002',
    name: 'Cliente PME / Particular (Demo)',         // TODO: PLACEHOLDER
    email: 'demo.cliente@pepekgrupo.com',            // TODO: PLACEHOLDER
    phone: '+244 9XX XXX XXX',                       // TODO: PLACEHOLDER
    role: 'cliente_normal',
    roleLabel: 'Cliente Particular / PME',
    company: 'Empresa Parceira (Demo)',              // TODO: PLACEHOLDER
    nif: '000000001',                               // TODO: PLACEHOLDER
    tier: 'Standard',
    creditLimitAOA: 5000000,                         // TODO: PLACEHOLDER
    activeRentalsCount: 1
  },
  vendedor: {
    id: 'demo_vend_003',
    name: 'Consultora Comercial Sénior (Demo)',      // TODO: PLACEHOLDER
    email: 'comercial@pepekgrupo.com',
    phone: '+244 923 719 090',
    role: 'vendedor',
    roleLabel: 'Consultora Comercial Sénior',
    company: 'PEPEK GRUPO RENT-A-CAR',
    tier: 'Administrativo'
  },
  gestor_reservas: {
    id: 'demo_reservas_007',
    name: 'Gestora de Reservas & Despacho (Demo)',
    email: 'reservas@pepekgrupo.com',
    phone: '+244 923 719 090',
    role: 'gestor_reservas',
    roleLabel: 'Gestora de Reservas & Despacho',
    company: 'PEPEK GRUPO — Central de Reservas',
    tier: 'Administrativo'
  },
  diretor_frotas: {
    id: 'demo_frotas_004',
    name: 'Director de Frotas & Operações (Demo)',   // TODO: PLACEHOLDER
    email: 'operacoes@pepekgrupo.com',
    phone: '+244 923 000 010',
    role: 'diretor_frotas',
    roleLabel: 'Director de Frotas & Operações',
    company: 'PEPEK GRUPO — Talatona Hub',
    tier: 'Administrativo'
  },
  motorista: {
    id: 'demo_motorista_008',
    name: 'Motorista Protocolar de Serviço (Demo)',
    email: 'motorista.demo@pepekgrupo.com',
    phone: '+244 9XX XXX XXX',
    role: 'motorista',
    roleLabel: 'Motorista Protocolar',
    company: 'PEPEK GRUPO — Operações',
    tier: 'Administrativo'
  },
  contabilista: {
    id: 'demo_contab_005',
    name: 'Responsável de Contabilidade (Demo)',     // TODO: PLACEHOLDER
    email: 'financas@pepekgrupo.com',
    phone: '+244 923 719 090',
    role: 'contabilista',
    roleLabel: 'Responsável de Contabilidade AGT',
    company: 'PEPEK GRUPO — Finanças',
    tier: 'Administrativo'
  },
  gestor_portugal: {
    id: 'demo_portugal_009',
    name: 'Gestora de Clientes Portugal (Demo)',
    email: 'portugal.demo@pepekgrupo.com',
    phone: '+351 9XX XXX XXX',
    role: 'gestor_portugal',
    roleLabel: 'Gestora de Clientes Portugal',
    company: 'PEPEK GRUPO — Apoio Internacional',
    tier: 'Administrativo'
  },
  direcao: {
    id: 'demo_dir_006',
    name: 'Direcção Geral Executiva (Demo)',         // TODO: PLACEHOLDER
    email: 'administracao@pepekgrupo.com',
    phone: '+244 923 719 090',
    role: 'direcao',
    roleLabel: 'Direcção Geral Executiva',
    company: 'PEPEK GRUPO S.A.',
    tier: 'Administrativo'
  }
};

// TODO: PLACEHOLDER — faturas fictícias para demonstração
export const DEMO_INVOICES: InvoiceItem[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'FT-PEPEK-DEMO/0001',
    date: '15/08/2026',
    dueDate: '15/09/2026',
    amountAOA: 4200000, // TODO: PLACEHOLDER
    amountUSD: 4600,    // TODO: PLACEHOLDER
    status: 'paid',
    description: 'Aluguer Mensal 2x Novo Toyota Prado com Motorista Protocolar (Demo)',
    paymentGateway: 'Multicaixa Express',
    odooInvoiceId: 'INV/DEMO/00001' // TODO: PLACEHOLDER
  },
  {
    id: 'inv_002',
    invoiceNumber: 'FT-PEPEK-DEMO/0002',
    date: '19/08/2026',
    dueDate: '25/08/2026',
    amountAOA: 1850000, // TODO: PLACEHOLDER
    amountUSD: 2050,    // TODO: PLACEHOLDER
    status: 'pending',
    description: 'Transfers VIP Aeroporto AIAAN + Escolta Huambo Toyota Hilux Dupla Cabine (Demo)',
    paymentGateway: 'Stripe',
    odooInvoiceId: 'INV/DEMO/00002' // TODO: PLACEHOLDER
  },
  {
    id: 'inv_003',
    invoiceNumber: 'FT-PEPEK-DEMO/0003',
    date: '21/08/2026',
    dueDate: '30/08/2026',
    amountAOA: 890000, // TODO: PLACEHOLDER
    amountUSD: 980,    // TODO: PLACEHOLDER
    status: 'pending',
    description: 'Aluguer Semanal Mercedes-Benz V300 Class VIP — Comitiva Técnica (Demo)',
    paymentGateway: 'MB WAY',
    odooInvoiceId: 'INV/DEMO/00003' // TODO: PLACEHOLDER
  }
];

// TODO: PLACEHOLDER — telemetria fictícia de frota
export const DEMO_FLEET_TELEMETRY: FleetTelemetryItem[] = [
  {
    id: 'flt_01',
    vehicleName: 'Range Rover Blindado 2025',
    plateNumber: 'LD-XX-XX-XX', // TODO: PLACEHOLDER
    assignedTo: 'Missão Diplomática de Alto Nível (Demo)',
    status: 'em_circulacao',
    location: 'Talatona ➔ Miramar, Luanda (Demo)',
    fuelLevel: 88,   // TODO: PLACEHOLDER
    mileageKm: 14200, // TODO: PLACEHOLDER
    driverName: 'Motorista Protocolar (Demo)',
    driverPhone: '+244 9XX XXX XXX' // TODO: PLACEHOLDER
  },
  {
    id: 'flt_02',
    vehicleName: 'Toyota LC300 2023',
    plateNumber: 'LD-XX-XX-YY', // TODO: PLACEHOLDER
    assignedTo: 'Missão Institucional (Demo)',
    status: 'em_circulacao',
    location: 'Aeroporto 4 de Fevereiro (Demo)',
    fuelLevel: 95,  // TODO: PLACEHOLDER
    mileageKm: 8600, // TODO: PLACEHOLDER
    driverName: 'Motorista Executivo (Demo)',
    driverPhone: '+244 9XX XXX XXX' // TODO: PLACEHOLDER
  },
  {
    id: 'flt_03',
    vehicleName: 'Toyota Hilux Dupla Cabine',
    plateNumber: 'HB-XX-XX-XX', // TODO: PLACEHOLDER
    assignedTo: 'Missão Técnica Interior (Demo)',
    status: 'em_circulacao',
    location: 'Pólo Operacional Huambo (Demo)',
    fuelLevel: 72,   // TODO: PLACEHOLDER
    mileageKm: 31400, // TODO: PLACEHOLDER
    driverName: 'Motorista Off-road (Demo)',
    driverPhone: '+244 9XX XXX XXX' // TODO: PLACEHOLDER
  },
  {
    id: 'flt_04',
    vehicleName: 'Mercedes-Benz V300 Class VIP',
    plateNumber: 'LD-XX-XX-ZZ', // TODO: PLACEHOLDER
    assignedTo: 'Disponível para Despacho Imediato',
    status: 'disponivel_talatona',
    location: 'Sede Talatona, Rua Reino do Bailundo',
    fuelLevel: 100, // TODO: PLACEHOLDER
    mileageKm: 18200 // TODO: PLACEHOLDER
  },
  {
    id: 'flt_05',
    vehicleName: 'Novo Toyota Prado',
    plateNumber: 'LD-XX-XX-WW', // TODO: PLACEHOLDER
    assignedTo: 'Manutenção Preventiva (Demo)',
    status: 'em_manutencao',
    location: 'Oficina Técnica Oficial Talatona',
    fuelLevel: 60,   // TODO: PLACEHOLDER
    mileageKm: 20050  // TODO: PLACEHOLDER
  }
];

// NOTA DE SEGURANÇA: nunca expor nome da BD real, protocolo ou contagens exactas ao front-end público.
// Estes dados devem vir de uma API autenticada no backend em produção.
// TODO: PLACEHOLDER — estado de sincronização Odoo fictício
export const DEMO_ODOO_SYNC: OdooSyncStatus = {
  lastSync: 'Sincronizado há 2 minutos (Demo)',
  odooDb: 'pepek_erp_demo',  // TODO: PLACEHOLDER — nunca usar nome de BD de produção aqui
  serverStatus: 'connected',
  totalVehiclesSynced: 0, // TODO: PLACEHOLDER — substituir com valor real da API Odoo
  openInvoicesCount: 0,   // TODO: PLACEHOLDER
  pendingQuotesCount: 0   // TODO: PLACEHOLDER
};
