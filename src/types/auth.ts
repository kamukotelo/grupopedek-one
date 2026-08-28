export type UserRole = 
  | 'cliente_vip'
  | 'cliente_normal'
  | 'vendedor'
  | 'gestor_reservas'
  | 'diretor_frotas'
  | 'motorista'
  | 'contabilista'
  | 'gestor_portugal'
  | 'direcao';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleLabel: string;
  company?: string;
  nif?: string;
  avatarUrl?: string;
  tier?: 'Diplomático' | 'Corporativo Gold' | 'Standard' | 'Administrativo';
  creditLimitAOA?: number;
  activeRentalsCount?: number;
}

export interface OdooSyncStatus {
  lastSync: string;
  odooDb: string;
  serverStatus: 'connected' | 'syncing' | 'offline';
  totalVehiclesSynced: number;
  openInvoicesCount: number;
  pendingQuotesCount: number;
  partnersSynced?: number;
  reservationsSynced?: number;
  driversSynced?: number;
  maintenanceOrdersOpen?: number;
  latencyMs?: number;
  environment?: 'demo' | 'staging' | 'production';
  lastJobStatus?: 'success' | 'warning' | 'failed';
}

export interface OperationalRecord {
  id: string;
  type: 'reserva' | 'despacho' | 'motorista' | 'manutencao' | 'contrato';
  reference: string;
  title: string;
  owner: string;
  location: string;
  scheduledAt: string;
  status: 'confirmado' | 'em_execucao' | 'pendente' | 'concluido' | 'atencao';
  odooModel: string;
  odooId: string;
}

export interface OdooSyncEvent {
  id: string;
  model: string;
  direction: 'PEPEK → Odoo' | 'Odoo → PEPEK';
  reference: string;
  timestamp: string;
  status: 'success' | 'warning';
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amountAOA: number;
  amountUSD: number;
  amountEUR?: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  paymentGateway: 'Multicaixa Express' | 'Stripe' | 'Cartão / Stripe' | 'BAI Direto' | 'MB WAY' | 'MB WAY / Portugal' | 'Transferência Bancária' | 'Transferência SWIFT';
  odooInvoiceId?: string;
}

export interface FleetTelemetryItem {
  id: string;
  vehicleName: string;
  plateNumber: string;
  assignedTo: string;
  status: 'em_circulacao' | 'disponivel_talatona' | 'em_manutencao' | 'em_reserva';
  location: string;
  fuelLevel: number;
  mileageKm: number;
  driverName?: string;
  driverPhone?: string;
}
