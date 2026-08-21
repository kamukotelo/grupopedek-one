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
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amountAOA: number;
  amountUSD: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  paymentGateway: 'Multicaixa Express' | 'Stripe' | 'BAI Direto' | 'MB WAY' | 'Transferência SWIFT';
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
