import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole, InvoiceItem, FleetTelemetryItem, OdooSyncStatus } from '../types/auth';
import { DEMO_USERS, DEMO_INVOICES, DEMO_FLEET_TELEMETRY, DEMO_ODOO_SYNC } from '../data/demoUsers';
import { neonClient } from '../lib/neon';
import { getPortalPermissions } from '../lib/portalPermissions';
import { fetchProtectedPortalData } from '../lib/portalData';
import { authRedirectUrl, type SocialProvider } from '../lib/auth';

type AuthUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

// Modo Demo ativo para navegação demonstrativa sem exigência de senhas
const IS_DEMO_MODE = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE !== 'false';

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

const safeTier = (value: unknown): UserProfile['tier'] => {
  const tiers: NonNullable<UserProfile['tier']>[] = ['Diplomático', 'Corporativo Gold', 'Standard', 'Administrativo'];
  return tiers.includes(value as NonNullable<UserProfile['tier']>) ? value as NonNullable<UserProfile['tier']> : 'Standard';
};

const getStoredDemoUser = (): UserProfile | null => {
  if (!IS_DEMO_MODE) return null;
  const saved = localStorage.getItem('pepek_demo_user');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as UserProfile;
    return Object.values(DEMO_USERS).find((user) => user.id === parsed.id) ?? null;
  } catch {
    return null;
  }
};

const mapAuthUser = async (user: AuthUser): Promise<UserProfile> => {
  const metadata = user.user_metadata || {};
  const { data: profile } = await neonClient
    .from('profiles')
    .select('full_name,phone,company,nif,role,tier')
    .eq('id', user.id)
    .maybeSingle();
  const row = profile as Record<string, unknown> | null;
  // Business roles live in the protected profiles table. Neon Auth's JWT role
  // only distinguishes authenticated from anonymous users.
  const role = safeRole(row?.role);
  return {
    id: user.id,
    name: String(row?.full_name || metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Cliente PEPEK'),
    email: user.email || '',
    phone: String(row?.phone || user.phone || metadata.phone || ''),
    role,
    roleLabel: ROLE_LABELS[role],
    company: row?.company ? String(row.company) : undefined,
    nif: row?.nif ? String(row.nif) : undefined,
    tier: safeTier(row?.tier),
  };
};

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthReady: boolean;
  isDemoMode: boolean;
  loginAs: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  requestPhoneOtp: (phone: string) => Promise<{ error?: string; phone?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error?: string }>;
  signInWithSocial: (provider: SocialProvider) => Promise<{ error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  isPasswordRecovery: boolean;
  logout: () => Promise<void>;
  isPortalOpen: boolean;
  setIsPortalOpen: (open: boolean) => void;
  invoices: InvoiceItem[];
  payInvoice: (invoiceId: string, gateway: string) => void;
  refreshInvoices: () => Promise<void>;
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
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
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
    const demoUser = getStoredDemoUser();
    if (demoUser) {
      setIsAuthReady(true);
      return;
    }
    let mounted = true;
    neonClient.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setCurrentUser(data.session?.user ? await mapAuthUser(data.session.user as AuthUser) : null);
      setIsAuthReady(true);
    });
    const { data: listener } = neonClient.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setCurrentUser(session?.user ? await mapAuthUser(session.user as AuthUser) : null);
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_IN' && session?.user) setIsPortalOpen(true);
      setIsAuthReady(true);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadPortalData = useCallback(async () => {
    if (isDemoSession) {
      setInvoices(DEMO_INVOICES);
      setFleetTelemetry(DEMO_FLEET_TELEMETRY);
      setOdooSync(DEMO_ODOO_SYNC);
      return;
    }
    if (!currentUser) {
      setInvoices([]);
      setFleetTelemetry([]);
      return;
    }

    const permissions = getPortalPermissions(currentUser.role);
    try {
      const protectedData = await fetchProtectedPortalData();
      setInvoices((permissions.finances ? protectedData.invoices : []).map((row: any) => ({
      id: row.id,
      invoiceNumber: row.invoice_number,
      date: row.issue_date,
      dueDate: row.due_date,
      amountAOA: Number(row.amount_aoa),
      amountUSD: Number(row.amount_usd || 0),
      amountEUR: Number(row.amount_eur || 0),
      status: row.status,
      description: row.description,
      paymentGateway: row.payment_gateway || 'Transferência SWIFT',
      odooInvoiceId: row.odoo_invoice_id,
      })));
      setFleetTelemetry((permissions.fleet ? protectedData.fleetTelemetry : []).map((row: any) => ({
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
    } catch {
      // Fail closed: protected records are never replaced with embedded data
      // when the authenticated server endpoint is unavailable.
      setInvoices([]);
      setFleetTelemetry([]);
    }
  }, [currentUser, isDemoSession]);

  useEffect(() => {
    void loadPortalData();
  }, [loadPortalData]);

  const loginAs = (role: UserRole) => {
    if (!IS_DEMO_MODE) return;
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
    const { error } = await neonClient.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { error: error.message } : {};
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { data, error } = await neonClient.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: authRedirectUrl(),
        data: { full_name: name.trim() },
      },
    });
    if (!error && data.user) {
      await neonClient.from('profiles').insert({
        id: data.user.id,
        full_name: name.trim(),
        role: 'cliente_normal',
        tier: 'Standard',
      });
    }
    return error ? { error: error.message } : {};
  };

  const requestPhoneOtp = async (_input: string) => {
    return { error: 'O acesso por SMS está temporariamente indisponível. Utilize o e-mail.' };
  };

  const verifyPhoneOtp = async (_input: string, _token: string) => {
    return { error: 'O acesso por SMS está temporariamente indisponível. Utilize o e-mail.' };
  };

  const signInWithSocial = async (provider: SocialProvider) => {
    const { error } = await neonClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: authRedirectUrl(),
        scopes: provider === 'azure' ? 'email openid profile' : undefined,
      },
    });
    return error ? { error: error.message } : {};
  };

  const requestPasswordReset = async (email: string) => {
    const redirectTo = authRedirectUrl();
    const { error } = await neonClient.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    return error ? { error: error.message } : {};
  };

  const updatePassword = async (password: string) => {
    if (password.length < 10) return { error: 'A palavra-passe deve ter pelo menos 10 caracteres.' };
    const { error } = await neonClient.auth.updateUser({ password });
    if (!error) setIsPasswordRecovery(false);
    return error ? { error: error.message } : {};
  };

  const logout = async () => {
    if (!isDemoSession) await neonClient.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('pepek_demo_user');
    setInvoices(IS_DEMO_MODE ? DEMO_INVOICES : []);
    setFleetTelemetry(IS_DEMO_MODE ? DEMO_FLEET_TELEMETRY : []);
    setIsPortalOpen(false);
  };

  const payInvoice = (invoiceId: string, gateway: string) => {
    if (!isDemoSession) return;
    setInvoices(prev => prev.map(inv => inv.id === invoiceId
      ? { ...inv, status: 'paid' as const, paymentGateway: gateway as InvoiceItem['paymentGateway'] }
      : inv));
  };

  const refreshOdooSync = async () => {
    if (isDemoSession) {
      setOdooSync(prev => ({ ...prev, serverStatus: 'syncing' }));
      await new Promise(resolve => setTimeout(resolve, 800));
      setOdooSync({ ...DEMO_ODOO_SYNC, lastSync: `Demo actualizado (${new Date().toLocaleTimeString('pt-AO')})` });
      return;
    }
    setOdooSync(prev => ({ ...prev, serverStatus: 'syncing' }));
    try {
      const { data } = await neonClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão necessária');
      const syncResponse = await fetch('/api/odoo-sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!syncResponse.ok && syncResponse.status !== 202) throw new Error('Sincronização recusada');
      const response = await fetch('/api/odoo-status', { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Odoo indisponível');
      setOdooSync(await response.json());
    } catch {
      setOdooSync(prev => ({ ...prev, serverStatus: 'offline', lastSync: 'Integração Odoo não configurada' }));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser, isAuthReady, isDemoMode: IS_DEMO_MODE, loginAs, signIn, signUp,
      requestPhoneOtp, verifyPhoneOtp, signInWithSocial, requestPasswordReset, updatePassword, isPasswordRecovery,
      logout, isPortalOpen, setIsPortalOpen, invoices, payInvoice, refreshInvoices: loadPortalData,
      fleetTelemetry, odooSync, refreshOdooSync, selectedPaymentInvoice, setSelectedPaymentInvoice,
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
