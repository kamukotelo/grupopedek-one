import { supabase } from './supabase';

export interface ProtectedPortalData {
  invoices: Record<string, unknown>[];
  fleetTelemetry: Record<string, unknown>[];
  operationalRecords: Record<string, unknown>[];
  odooEvents: Record<string, unknown>[];
}

export const fetchProtectedPortalData = async (): Promise<ProtectedPortalData> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Sessão necessária');
  const response = await fetch('/api/portal-data', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Dados protegidos indisponíveis');
  return response.json();
};
