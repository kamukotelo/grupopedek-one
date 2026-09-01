import { applyApiSecurity, takeRateLimit } from './_security.js';
import { authenticateSupabaseRequest, querySupabaseAdmin } from './_supabase-admin.js';

const FINANCE_ROLES = new Set(['contabilista', 'gestor_portugal', 'direcao']);
const FINANCE_VIEW_ROLES = new Set(['cliente_normal', 'cliente_vip', 'contabilista', 'gestor_portugal', 'direcao']);
const GLOBAL_FLEET_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao']);
const FLEET_VIEW_ROLES = new Set(['cliente_normal', 'cliente_vip', 'vendedor', 'gestor_reservas', 'diretor_frotas', 'motorista', 'gestor_portugal', 'direcao']);
const OPERATIONS_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao']);
const ODOO_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'contabilista', 'gestor_portugal', 'direcao']);

const ownOrAll = (userId, canReadAll) => canReadAll ? '' : `&user_id=eq.${encodeURIComponent(userId)}`;

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'portal-data', 60)) return res.status(429).json({ error: 'Muitos pedidos.' });

  try {
    const user = await authenticateSupabaseRequest(req);
    const role = user?.app_metadata?.role || 'cliente_normal';
    const invoicesPath = `invoices?select=*&order=created_at.desc${ownOrAll(user.id, FINANCE_ROLES.has(role))}`;
    const fleetPath = `fleet_assignments?select=*&order=created_at.desc${ownOrAll(user.id, GLOBAL_FLEET_ROLES.has(role))}`;

    const [invoices, fleetTelemetry, operationalRecords, odooEvents] = await Promise.all([
      FINANCE_VIEW_ROLES.has(role) ? querySupabaseAdmin(invoicesPath) : Promise.resolve([]),
      FLEET_VIEW_ROLES.has(role) ? querySupabaseAdmin(fleetPath) : Promise.resolve([]),
      OPERATIONS_ROLES.has(role)
        ? querySupabaseAdmin('operational_records?select=*&order=scheduled_at.desc&limit=100', { optional: true })
        : Promise.resolve([]),
      ODOO_ROLES.has(role)
        ? querySupabaseAdmin('odoo_sync_events?select=*&order=occurred_at.desc&limit=100', { optional: true })
        : Promise.resolve([]),
    ]);

    return res.status(200).json({ invoices, fleetTelemetry, operationalRecords, odooEvents });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível carregar o portal';
    const status = /Autenticação|Sessão/.test(message) ? 401 : 503;
    return res.status(status).json({ error: message });
  }
}
