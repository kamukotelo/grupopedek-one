import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole, InvoiceItem, FleetTelemetryItem, OdooSyncStatus } from '../types/auth';
import { DEMO_USERS, DEMO_INVOICES, DEMO_FLEET_TELEMETRY, DEMO_ODOO_SYNC } from '../data/demoUsers';

// ─────────────────────────────────────────────────────────────────────────────
// SEGURANÇA: O painel de demo e a troca de personas só está activo em
// modo de desenvolvimento (import.meta.env.DEV = true).
// Em produção (PROD), todos os visitantes começam como anónimos.
// TODO: implementar autenticação real (Firebase Auth / Supabase / OAuth)
//       antes do lançamento público em pepekgrupo.com
// ─────────────────────────────────────────────────────────────────────────────
const IS_DEMO_MODE = import.meta.env.DEV;

interface AuthContextType {
  currentUser: UserProfile | null;
  isDemoMode: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
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
  // SEGURANÇA: Em produção, arrancar sempre como anónimo (null).
  // Em modo de desenvolvimento, permitir restauro da sessão demo do localStorage.
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (!IS_DEMO_MODE) return null; // Produção → sempre anónimo
    const saved = localStorage.getItem('pepek_demo_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null; // Não pré-carregar nenhuma persona — utilizador escolhe
  });

  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(DEMO_INVOICES);
  const [fleetTelemetry] = useState<FleetTelemetryItem[]>(DEMO_FLEET_TELEMETRY);
  const [odooSync, setOdooSync] = useState<OdooSyncStatus>(DEMO_ODOO_SYNC);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceItem | null>(null);

  // loginAs: apenas disponível em modo demo (DEV). Em produção, usar auth real.
  const loginAs = (role: UserRole) => {
    if (!IS_DEMO_MODE) {
      console.warn('[PEPEK] loginAs() desactivado em produção. Usar autenticação real.');
      return;
    }
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('pepek_demo_user', JSON.stringify(user)); // key diferente de sessão real
      setIsPortalOpen(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pepek_demo_user');
    setIsPortalOpen(false);
  };

  const payInvoice = (invoiceId: string, gateway: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: 'paid' as const, paymentGateway: gateway as any }
          : inv
      )
    );
  };

  const refreshOdooSync = async () => {
    setOdooSync(prev => ({ ...prev, serverStatus: 'syncing' }));
    await new Promise(r => setTimeout(r, 1200));
    // TODO: PLACEHOLDER — substituir com chamada real à API Odoo autenticada
    setOdooSync({
      lastSync: `Sincronizado agora (${new Date().toLocaleTimeString('pt-AO')})`,
      odooDb: IS_DEMO_MODE ? 'pepek_erp_demo' : '[REDACTED]', // nunca expor BD real ao front-end
      serverStatus: 'connected',
      totalVehiclesSynced: 0, // TODO: PLACEHOLDER — valor real via API
      openInvoicesCount: invoices.filter(i => i.status === 'pending').length,
      pendingQuotesCount: 0   // TODO: PLACEHOLDER
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isDemoMode: IS_DEMO_MODE,
        loginAs,
        logout,
        isPortalOpen,
        setIsPortalOpen,
        invoices,
        payInvoice,
        fleetTelemetry,
        odooSync,
        refreshOdooSync,
        selectedPaymentInvoice,
        setSelectedPaymentInvoice
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
