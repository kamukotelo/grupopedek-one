import { UserProfile, InvoiceItem, FleetTelemetryItem, OdooSyncStatus, OperationalRecord, OdooSyncEvent } from '../types/auth';

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
  },
  {
    id: 'inv_004', invoiceNumber: 'FT-PEPEK-DEMO/0004', date: '22/08/2026', dueDate: '05/09/2026',
    amountAOA: 675000, amountUSD: 725, status: 'paid', description: 'Transfer executivo AIAAN — Talatona, com motorista bilingue (Demo)',
    paymentGateway: 'BAI Direto', odooInvoiceId: 'INV/DEMO/00004'
  },
  {
    id: 'inv_005', invoiceNumber: 'FT-PEPEK-DEMO/0005', date: '23/08/2026', dueDate: '23/09/2026',
    amountAOA: 7850000, amountUSD: 8435, status: 'pending', description: 'Contrato mensal de mobilidade corporativa — 5 viaturas executivas (Demo)',
    paymentGateway: 'Transferência SWIFT', odooInvoiceId: 'INV/DEMO/00005'
  },
  {
    id: 'inv_006', invoiceNumber: 'FT-PEPEK-DEMO/0006', date: '24/08/2026', dueDate: '31/08/2026',
    amountAOA: 1295000, amountUSD: 1390, status: 'pending', description: 'Comitiva internacional — Mercedes V300 VIP e apoio protocolar (Demo)',
    paymentGateway: 'Stripe', odooInvoiceId: 'INV/DEMO/00006'
  },
  {
    id: 'inv_007', invoiceNumber: 'FT-PEPEK-DEMO/0007', date: '25/08/2026', dueDate: '25/09/2026',
    amountAOA: 3480000, amountUSD: 3740, status: 'paid', description: 'Missão técnica Luanda–Huambo com frota 4x4 (Demo)',
    paymentGateway: 'Multicaixa Express', odooInvoiceId: 'INV/DEMO/00007'
  },
  {
    id: 'inv_008', invoiceNumber: 'FT-PEPEK-DEMO/0008', date: '26/08/2026', dueDate: '26/09/2026',
    amountAOA: 960000, amountUSD: 1032, status: 'overdue', description: 'Aluguer semanal Toyota Prado — conta corporativa (Demo)',
    paymentGateway: 'MB WAY', odooInvoiceId: 'INV/DEMO/00008'
  }
];

// TODO: PLACEHOLDER — telemetria fictícia de frota
export const DEMO_FLEET_TELEMETRY: FleetTelemetryItem[] = [
  {
    id: 'flt_01',
    vehicleName: 'Range Rover Vogue Blindado',
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
    vehicleName: 'Toyota LC300 2026',
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
  },
  {
    id: 'flt_06', vehicleName: 'Range Rover Autobiography 2026', plateNumber: 'LD-XX-10-AA', assignedTo: 'Direcção Executiva (Demo)',
    status: 'em_reserva', location: 'Talatona — Preparação VIP', fuelLevel: 100, mileageKm: 5400, driverName: 'Motorista Executivo Alfa (Demo)', driverPhone: '+244 9XX XXX XXX'
  },
  {
    id: 'flt_07', vehicleName: 'Toyota Hilux Dupla Cabine', plateNumber: 'LD-XX-11-BB', assignedTo: 'Projecto Industrial Bengo (Demo)',
    status: 'em_circulacao', location: 'Caxito — Bengo (Demo)', fuelLevel: 64, mileageKm: 42780, driverName: 'Motorista Operacional Bravo (Demo)', driverPhone: '+244 9XX XXX XXX'
  },
  {
    id: 'flt_08', vehicleName: 'Hyundai Staria Executiva', plateNumber: 'LD-XX-12-CC', assignedTo: 'Transfer AIAAN (Demo)',
    status: 'em_circulacao', location: 'AIAAN — Terminal Internacional', fuelLevel: 91, mileageKm: 12640, driverName: 'Motorista Protocolar Charlie (Demo)', driverPhone: '+244 9XX XXX XXX'
  },
  {
    id: 'flt_09', vehicleName: 'Mercedes Sprinter 21L', plateNumber: 'LD-XX-13-DD', assignedTo: 'Conferência Internacional (Demo)',
    status: 'em_reserva', location: 'Sede Talatona — Higienização', fuelLevel: 100, mileageKm: 23800, driverName: 'Equipa de Escala Delta (Demo)', driverPhone: '+244 9XX XXX XXX'
  },
  {
    id: 'flt_10', vehicleName: 'Suzuki Swift', plateNumber: 'LD-XX-14-EE', assignedTo: 'Disponível para Entrega (Demo)',
    status: 'disponivel_talatona', location: 'Hub Central Talatona', fuelLevel: 100, mileageKm: 18820
  },
  {
    id: 'flt_11', vehicleName: 'Nissan Patrol V8', plateNumber: 'LD-XX-15-FF', assignedTo: 'Revisão Programada (Demo)',
    status: 'em_manutencao', location: 'Oficina Técnica Talatona', fuelLevel: 48, mileageKm: 36210
  },
  {
    id: 'flt_12', vehicleName: 'Toyota Coaster 30L', plateNumber: 'LD-XX-16-GG', assignedTo: 'Delegação Institucional (Demo)',
    status: 'em_circulacao', location: 'Marginal de Luanda (Demo)', fuelLevel: 77, mileageKm: 55420, driverName: 'Motorista de Pesados Eco (Demo)', driverPhone: '+244 9XX XXX XXX'
  }
];

export const DEMO_OPERATIONAL_RECORDS: OperationalRecord[] = [
  { id: 'op_01', type: 'reserva', reference: 'RSV-2026-1048', title: 'Transfer VIP AIAAN — Miramar', owner: 'Gestão de Reservas', location: 'Luanda', scheduledAt: '27/08/2026 · 08:30', status: 'confirmado', odooModel: 'sale.order', odooId: 'SO/DEMO/1048' },
  { id: 'op_02', type: 'despacho', reference: 'DSP-2026-0381', title: 'Comitiva executiva — 4 SUVs', owner: 'Central de Despacho', location: 'Talatona', scheduledAt: '27/08/2026 · 10:00', status: 'em_execucao', odooModel: 'fleet.vehicle.assignment', odooId: 'FVA/DEMO/0381' },
  { id: 'op_03', type: 'motorista', reference: 'DRV-2026-0217', title: 'Escala protocolar PT/EN', owner: 'Coordenação de Motoristas', location: 'AIAAN', scheduledAt: '27/08/2026 · 14:15', status: 'confirmado', odooModel: 'hr.employee', odooId: 'EMP/DEMO/0217' },
  { id: 'op_04', type: 'manutencao', reference: 'MNT-2026-0094', title: 'Revisão preventiva Nissan Patrol', owner: 'Oficina PEPEK', location: 'Talatona', scheduledAt: '28/08/2026 · 07:30', status: 'atencao', odooModel: 'fleet.vehicle.log.services', odooId: 'MNT/DEMO/0094' },
  { id: 'op_05', type: 'contrato', reference: 'CTR-2026-0062', title: 'Renovação de mobilidade corporativa', owner: 'Vendas & CRM', location: 'Luanda', scheduledAt: '29/08/2026 · 11:00', status: 'pendente', odooModel: 'sale.subscription', odooId: 'SUB/DEMO/0062' },
  { id: 'op_06', type: 'reserva', reference: 'RSV-2026-1052', title: 'Missão técnica Luanda — Huambo', owner: 'Gestão de Reservas', location: 'Huambo', scheduledAt: '30/08/2026 · 05:45', status: 'confirmado', odooModel: 'sale.order', odooId: 'SO/DEMO/1052' },
  { id: 'op_07', type: 'despacho', reference: 'DSP-2026-0388', title: 'Entrega executiva Toyota Prado', owner: 'Central de Despacho', location: 'Maianga', scheduledAt: '30/08/2026 · 09:20', status: 'concluido', odooModel: 'stock.picking', odooId: 'PICK/DEMO/0388' },
  { id: 'op_08', type: 'motorista', reference: 'DRV-2026-0223', title: 'Formação em condução defensiva', owner: 'Recursos Humanos', location: 'Talatona', scheduledAt: '31/08/2026 · 08:00', status: 'pendente', odooModel: 'hr.appraisal', odooId: 'APP/DEMO/0223' }
];

export const DEMO_ODOO_EVENTS: OdooSyncEvent[] = [
  { id: 'sync_01', model: 'res.partner', direction: 'PEPEK → Odoo', reference: 'Cliente corporativo DEMO-0291', timestamp: '16:18:04', status: 'success' },
  { id: 'sync_02', model: 'sale.order', direction: 'PEPEK → Odoo', reference: 'SO/DEMO/1052', timestamp: '16:17:42', status: 'success' },
  { id: 'sync_03', model: 'account.move', direction: 'Odoo → PEPEK', reference: 'INV/DEMO/0008', timestamp: '16:16:55', status: 'warning' },
  { id: 'sync_04', model: 'fleet.vehicle', direction: 'Odoo → PEPEK', reference: '12 estados actualizados', timestamp: '16:16:21', status: 'success' },
  { id: 'sync_05', model: 'fleet.vehicle.log.services', direction: 'PEPEK → Odoo', reference: 'MNT/DEMO/0094', timestamp: '16:15:48', status: 'success' }
];

// NOTA DE SEGURANÇA: nunca expor nome da BD real, protocolo ou contagens exactas ao front-end público.
// Estes dados devem vir de uma API autenticada no backend em produção.
// TODO: PLACEHOLDER — estado de sincronização Odoo fictício
export const DEMO_ODOO_SYNC: OdooSyncStatus = {
  lastSync: 'Sincronizado há 2 minutos (Demo)',
  odooDb: 'pepek_erp_demo',  // TODO: PLACEHOLDER — nunca usar nome de BD de produção aqui
  serverStatus: 'connected',
  totalVehiclesSynced: 51,
  openInvoicesCount: 4,
  pendingQuotesCount: 7,
  partnersSynced: 186,
  reservationsSynced: 34,
  driversSynced: 28,
  maintenanceOrdersOpen: 3,
  latencyMs: 184,
  environment: 'demo',
  lastJobStatus: 'success'
};
