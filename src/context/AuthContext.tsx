import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { UserProfile, UserRole, InvoiceItem, FleetTelemetryItem, OdooSyncStatus } from '../types/auth';
import { DEMO_USERS, DEMO_INVOICES, DEMO_FLEET_TELEMETRY, DEMO_ODOO_SYNC, DEMO_LOGIN_ROLES, DEMO_PASSWORD } from '../data/demoUsers';
import { supabase } from '../lib/supabase';

// Demo can be enabled explicitly in an isolated staging deployment. Keep the
// public production project without VITE_DEMO_MODE to protect staff personas.
const IS_DEMO_MODE = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true';

const ROLE_LABELS: Record<UserRole, string> = {
  cliente_vip: 'Cliente VIP',
  cliente_normal: 'Cliente',
  vendedor: 'Vendedor CRM',
  gestor_reservas: 'Gestor de Reservas',
  diretor_frotas: 'Director de Frotas',
  motorista: 'Motorista Protocolar',
  contabilista: 'Contabilista',
  gestor_portugal: 'Gestor Portugal',
  direcao: 'Direcção Executiva',
};

const safeRole = (value: unknown): UserRole => {
  const roles = Object.keys(ROLE_LABELS) as UserRole[];
  return roles.includes(value as UserRole) ? value as UserRole : 'cliente_normal';
};

const getStoredDemoUser = (): UserProfile | null => {
  const saved = localStorage.getItem('pepek_demo_user');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as UserProfile;
    return Object.values(DEMO_USERS).find((user) => user.id === parsed.id) ?? null;
  } catch {
    return null;
  }
};

const mapAuthUser = (user: User): UserProfile => {
  const metadata = user.user_metadata || {};
  // Privileged roles are controlled by server-managed app_metadata. A client
  // cannot promote itself by editing its public user_metadata.
  const role = user.app_metadata?.role ? safeRole(user.app_metadata.role) : 'cliente_normal';
  return {
    id: user.id,
    name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Cliente PEPEK',
    email: user.email || '',
    phone: user.phone || metadata.phone || '',
    role,
    roleLabel: ROLE_LABELS[role],
    company: metadata.company,
    nif: metadata.nif,
    tier: metadata.tier || 'Standard',
  };
};

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthReady: boolean;
  isDemoMode: boolean;
  loginAs: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isPortalOpen: boolean;
  setIsPortalOpen: (open: boolean) => void;
  invoices: InvoiceItem[];
  payInvoice: (invoiceId: string, gateway: string) => void;
  fleetTelemetry: FleetTelemetryItem[];
  odooSync: OdooSyncStatus;
  refreshOdooSync: () => Promise<void>;
  selectedPaymentInvoice: InvoiceItem | null;
  setSelectedPaymentInvoice: (inv: InvoiceItem | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getStoredDemoUser();
  });
  const [isAuthReady, setIsAuthReady] = useState(IS_DEMO_MODE);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(IS_DEMO_MODE ? DEMO_INVOICES : []);
  const [fleetTelemetry, setFleetTelemetry] = useState<FleetTelemetryItem[]>(IS_DEMO_MODE ? DEMO_FLEET_TELEMETRY : []);
  const [odooSync, setOdooSync] = useState<OdooSyncStatus>(IS_DEMO_MODE ? DEMO_ODOO_SYNC : {
    lastSync: 'Aguardando ligação autorizada',
    odooDb: '[PROTEGIDO]',
    serverStatus: 'offline',
    totalVehiclesSynced: 0,
    openInvoicesCount: 0,
    pendingQuotesCount: 0,
  });
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceItem | null>(null);
  const isDemoSession = currentUser?.id.startsWith('demo_') ?? false;

  useEffect(() => {
    if (IS_DEMO_MODE || getStoredDemoUser()) {
      setIsAuthReady(true);
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setCurrentUser(data.session?.user ? mapAuthUser(data.session.user) : null);
      setIsAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setCurrentUser(session?.user ? mapAuthUser(session.user) : null);
      setIsAuthReady(true);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (IS_DEMO_MODE || isDemoSession || !currentUser) {
      if (IS_DEMO_MODE || isDemoSession) {
        setInvoices(DEMO_INVOICES);
        setFleetTelemetry(DEMO_FLEET_TELEMETRY);
        setOdooSync(DEMO_ODOO_SYNC);
      }
      if (!IS_DEMO_MODE) {
        if (!isDemoSession) {
          setInvoices([]);
          setFleetTelemetry([]);
        }
      }
      return;
    }

    const loadProtectedData = async () => {
      const [invoiceResult, fleetResult] = await Promise.all([
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('fleet_assignments').select('*').order('created_at', { ascending: false }),
      ]);
      if (!invoiceResult.error) setInvoices((invoiceResult.data || []).map((row: any) => ({
        id: row.id,
        invoiceNumber: row.invoice_number,
        date: row.issue_date,
        dueDate: row.due_date,
        amountAOA: Number(row.amount_aoa),
        amountUSD: Number(row.amount_usd || 0),
        status: row.status,
        description: row.description,
        paymentGateway: row.payment_gateway || 'Transferência SWIFT',
        odooInvoiceId: row.odoo_invoice_id,
      })));
      if (!fleetResult.error) setFleetTelemetry((fleetResult.data || []).map((row: any) => ({
        id: row.id,
        vehicleName: row.vehicle_name,
        plateNumber: row.plate_number,
        assignedTo: row.assigned_to || '',
        status: row.status,
        location: row.location || '',
        fuelLevel: Number(row.fuel_level || 0),
        mileageKm: Number(row.mileage_km || 0),
        driverName: row.driver_name,
        driverPhone: row.driver_phone,
      })));
    };
    void loadProtectedData();
  }, [currentUser, isDemoSession]);

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (!user) return;
    setInvoices(DEMO_INVOICES);
    setFleetTelemetry(DEMO_FLEET_TELEMETRY);
    setOdooSync(DEMO_ODOO_SYNC);
    setCurrentUser(user);
    localStorage.setItem('pepek_demo_user', JSON.stringify(user));
    setIsPortalOpen(true);
  };

  const signIn = async (email: string, password: string) => {
    const demoLogin = email.trim().toLowerCase() as keyof typeof DEMO_LOGIN_ROLES;
    const demoRole = DEMO_LOGIN_ROLES[demoLogin];
    if (demoRole) {
      if (password !== DEMO_PASSWORD) return { error: 'Credenciais de demonstração inválidas' };
      const user = DEMO_USERS[demoRole];
      setCurrentUser(user);
      setInvoices(DEMO_INVOICES);
      setFleetTelemetry(DEMO_FLEET_TELEMETRY);
      setOdooSync(DEMO_ODOO_SYNC);
      localStorage.setItem('pepek_demo_user', JSON.stringify(user));
      return {};
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { error: error.message } : {};
  };

  const requestPasswordReset = async (email: string) => {
    if (email.trim().toLowerCase() in DEMO_LOGIN_ROLES) {
      return { error: 'As contas demo não utilizam recuperação de senha' };
    }
    const redirectTo = `${window.location.origin}/painel`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    return error ? { error: error.message } : {};
  };

  const logout = async () => {
    if (!IS_DEMO_MODE && !isDemoSession) await supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('pepek_demo_user');
    setInvoices(IS_DEMO_MODE ? DEMO_INVOICES : []);
    setFleetTelemetry(IS_DEMO_MODE ? DEMO_FLEET_TELEMETRY : []);
    setIsPortalOpen(false);
  };

  const payInvoice = (invoiceId: string, gateway: string) => {
    if (!IS_DEMO_MODE && !isDemoSession) return;
    setInvoices(prev => prev.map(inv => inv.id === invoiceId
      ? { ...inv, status: 'paid' as const, paymentGateway: gateway as InvoiceItem['paymentGateway'] }
      : inv));
  };

  const refreshOdooSync = async () => {
    if (IS_DEMO_MODE || isDemoSession) {
      setOdooSync(prev => ({ ...prev, serverStatus: 'syncing' }));
      await new Promise(resolve => setTimeout(resolve, 800));
      setOdooSync({ ...DEMO_ODOO_SYNC, lastSync: `Demo actualizado (${new Date().toLocaleTimeString('pt-AO')})` });
      return;
    }
    setOdooSync(prev => ({ ...prev, serverStatus: 'syncing' }));
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão necessária');
      const response = await fetch('/api/odoo-status', { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Odoo indisponível');
      setOdooSync(await response.json());
    } catch {
      setOdooSync(prev => ({ ...prev, serverStatus: 'offline', lastSync: 'Integração Odoo não configurada' }));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser, isAuthReady, isDemoMode: IS_DEMO_MODE, loginAs, signIn, requestPasswordReset,
      logout, isPortalOpen, setIsPortalOpen, invoices, payInvoice, fleetTelemetry, odooSync,
      refreshOdooSync, selectedPaymentInvoice, setSelectedPaymentInvoice,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
