import { UserProfile, InvoiceItem, FleetTelemetryItem, OdooSyncStatus } from '../types/auth';

export const DEMO_USERS: Record<string, UserProfile> = {
  cliente_vip: {
    id: 'usr_vip_001',
    name: 'S. Exa. Dr. Robert Vance',
    email: 'vance.r@state.gov.us',
    phone: '+244 923 881 100',
    role: 'cliente_vip',
    roleLabel: 'Cliente VIP Diplomático',
    company: 'Embaixada dos EUA em Luanda',
    nif: '5000998821',
    tier: 'Diplomático',
    creditLimitAOA: 45000000,
    activeRentalsCount: 3
  },
  cliente_normal: {
    id: 'usr_norm_002',
    name: 'Eng. Paulo Domingos',
    email: 'paulo.domingos@logistica.ao',
    phone: '+244 931 445 522',
    role: 'cliente_normal',
    roleLabel: 'Cliente Particular / PME',
    company: 'Particular / Angola Consulting',
    nif: '5412009811',
    tier: 'Standard',
    creditLimitAOA: 5000000,
    activeRentalsCount: 1
  },
  vendedor: {
    id: 'usr_vend_003',
    name: 'Dra. Marlene Silva',
    email: 'marlene.comercial@pepekgrupo.com',
    phone: '+244 923 719 090',
    role: 'vendedor',
    roleLabel: 'Consultora Comercial Sénior',
    company: 'PEPEK GRUPO RENT-A-CAR',
    tier: 'Administrativo'
  },
  diretor_frotas: {
    id: 'usr_frotas_004',
    name: 'Comandante Hélder Kiala',
    email: 'helder.operacoes@pepekgrupo.com',
    phone: '+244 923 000 010',
    role: 'diretor_frotas',
    roleLabel: 'Director de Frotas & Operações',
    company: 'PEPEK GRUPO — Talatona Hub',
    tier: 'Administrativo'
  },
  contabilista: {
    id: 'usr_contab_005',
    name: 'Dr. Mateus Afonso (CPA)',
    email: 'mateus.financas@pepekgrupo.com',
    phone: '+244 923 719 091',
    role: 'contabilista',
    roleLabel: 'Responsável de Contabilidade AGT',
    company: 'PEPEK GRUPO — Finanças',
    tier: 'Administrativo'
  },
  direcao: {
    id: 'usr_dir_006',
    name: 'Conselho de Administração Executivo',
    email: 'administracao@pepekgrupo.com',
    phone: '+244 923 719 099',
    role: 'direcao',
    roleLabel: 'Direcção Geral Executiva',
    company: 'PEPEK GRUPO S.A.',
    tier: 'Administrativo'
  }
};

export const DEMO_INVOICES: InvoiceItem[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'FT-PEPEK-2026/0891',
    date: '15/08/2026',
    dueDate: '15/09/2026',
    amountAOA: 4200000,
    amountUSD: 4600,
    status: 'paid',
    description: 'Aluguer Mensal 2x Land Cruiser Prado TXL com Motorista Protocolar',
    paymentGateway: 'Multicaixa Express',
    odooInvoiceId: 'INV/2026/00412'
  },
  {
    id: 'inv_002',
    invoiceNumber: 'FT-PEPEK-2026/0904',
    date: '19/08/2026',
    dueDate: '25/08/2026',
    amountAOA: 1850000,
    amountUSD: 2050,
    status: 'pending',
    description: 'Transfers VIP Aeroporto AIAAN + Escolta Huambo 4x4 Hilux',
    paymentGateway: 'Stripe',
    odooInvoiceId: 'INV/2026/00428'
  },
  {
    id: 'inv_003',
    invoiceNumber: 'FT-PEPEK-2026/0920',
    date: '21/08/2026',
    dueDate: '30/08/2026',
    amountAOA: 890000,
    amountUSD: 980,
    status: 'pending',
    description: 'Aluguer Semanal Toyota Hiace VIP 12L para Comitiva Técnica',
    paymentGateway: 'MB WAY',
    odooInvoiceId: 'INV/2026/00445'
  }
];

export const DEMO_FLEET_TELEMETRY: FleetTelemetryItem[] = [
  {
    id: 'flt_01',
    vehicleName: 'Toyota Land Cruiser Prado TXL (2025)',
    plateNumber: 'LD-44-88-GG',
    assignedTo: 'Embaixada dos EUA (Comitiva)',
    status: 'em_circulacao',
    location: 'Talatona ➔ Miramar, Luanda (GPS Activo)',
    fuelLevel: 88,
    mileageKm: 14200,
    driverName: 'António Kapapelo (Bilingue)',
    driverPhone: '+244 923 112 334'
  },
  {
    id: 'flt_02',
    vehicleName: 'Toyota Land Cruiser 300 VXR',
    plateNumber: 'LD-90-12-HH',
    assignedTo: 'Delegação Presidencial / Estado',
    status: 'em_circulacao',
    location: 'Aeroporto 4 de Fevereiro (Área VIP)',
    fuelLevel: 95,
    mileageKm: 8600,
    driverName: 'Domingos Simão (Protocolar)',
    driverPhone: '+244 923 556 778'
  },
  {
    id: 'flt_03',
    vehicleName: 'Toyota Hilux Dupla Cabine 4x4',
    plateNumber: 'HB-12-33-AA',
    assignedTo: 'Missão Huambo / Bié — Engenharia',
    status: 'em_circulacao',
    location: 'Pólo Operacional Huambo (Planalto)',
    fuelLevel: 72,
    mileageKm: 31400,
    driverName: 'Manuel Tchissola (Off-road)',
    driverPhone: '+244 924 990 112'
  },
  {
    id: 'flt_04',
    vehicleName: 'Toyota Hiace VIP Executiva 12L',
    plateNumber: 'LD-77-55-EE',
    assignedTo: 'Disponível para Despacho Imediato',
    status: 'disponivel_talatona',
    location: 'Sede Talatona, Rua Reino do Bailundo',
    fuelLevel: 100,
    mileageKm: 18200
  },
  {
    id: 'flt_05',
    vehicleName: 'Toyota Fortuner 4x4 V6',
    plateNumber: 'LD-33-21-CC',
    assignedTo: 'Manutenção Preventiva dos 20.000 km',
    status: 'em_manutencao',
    location: 'Oficina Técnica Oficial Talatona',
    fuelLevel: 60,
    mileageKm: 20050
  }
];

export const DEMO_ODOO_SYNC: OdooSyncStatus = {
  lastSync: 'Sincronizado há 2 minutos (v17 Enterprise)',
  odooDb: 'pepek_erp_production_ao',
  serverStatus: 'connected',
  totalVehiclesSynced: 48,
  openInvoicesCount: 14,
  pendingQuotesCount: 7
};
