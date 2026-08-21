import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, InvoiceItem, FleetTelemetryItem, OdooSyncStatus } from '../types/auth';
import { DEMO_USERS, DEMO_INVOICES, DEMO_FLEET_TELEMETRY, DEMO_ODOO_SYNC } from '../data/demoUsers';

interface AuthContextType {
  currentUser: UserProfile | null;
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
  // Start with cliente_vip as active demo user by default or null
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pepek_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.cliente_vip;
      }
    }
    return DEMO_USERS.cliente_vip;
  });

  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(DEMO_INVOICES);
  const [fleetTelemetry] = useState<FleetTelemetryItem[]>(DEMO_FLEET_TELEMETRY);
  const [odooSync, setOdooSync] = useState<OdooSyncStatus>(DEMO_ODOO_SYNC);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceItem | null>(null);

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('pepek_auth_user', JSON.stringify(user));
      setIsPortalOpen(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pepek_auth_user');
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
    setOdooSync({
      lastSync: `Sincronizado agora (${new Date().toLocaleTimeString('pt-AO')})`,
      odooDb: 'pepek_erp_production_ao',
      serverStatus: 'connected',
      totalVehiclesSynced: 48,
      openInvoicesCount: invoices.filter(i => i.status === 'pending').length,
      pendingQuotesCount: 5
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
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
