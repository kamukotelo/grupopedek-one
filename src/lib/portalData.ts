import i18n from '../i18n';
import { getAccessToken } from './neon';

export interface ProtectedPortalData {
  invoices: Record<string, unknown>[];
  fleetTelemetry: Record<string, unknown>[];
  operationalRecords: Record<string, unknown>[];
  odooEvents: Record<string, unknown>[];
}

export const fetchProtectedPortalData = async (): Promise<ProtectedPortalData> => {
  const token = await getAccessToken();
  if (!token) throw new Error(i18n.t('system.sessionRequired'));
  const response = await fetch('/api/portal-data', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(i18n.t('system.protectedDataUnavailable'));
  return response.json();
};
