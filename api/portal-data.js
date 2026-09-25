import { applyApiSecurity, takeRateLimit } from './_security.js';
import { authenticateNeonRequest, getDatabase } from './_neon.js';

const FINANCE_ROLES = new Set(['contabilista', 'gestor_portugal', 'direcao']);
const FINANCE_VIEW_ROLES = new Set(['cliente_normal', 'cliente_vip', 'contabilista', 'gestor_portugal', 'direcao']);
const GLOBAL_FLEET_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao']);
const FLEET_VIEW_ROLES = new Set(['cliente_normal', 'cliente_vip', 'vendedor', 'gestor_reservas', 'diretor_frotas', 'motorista', 'gestor_portugal', 'direcao']);
const OPERATIONS_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao']);
const ODOO_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'portal-data', 60)) return res.status(429).json({ error: 'Muitos pedidos.' });

  try {
    const user = await authenticateNeonRequest(req);
    const sql = getDatabase();
    const role = user?.app_metadata?.role || 'cliente_normal';

    const [invoices, fleetTelemetry, operationalRecords, odooEvents] = await Promise.all([
      FINANCE_VIEW_ROLES.has(role)
        ? sql.query('SELECT * FROM public.invoices WHERE ($2::boolean OR user_id = $1) ORDER BY created_at DESC', [user.id, FINANCE_ROLES.has(role)])
        : Promise.resolve([]),
      FLEET_VIEW_ROLES.has(role)
        ? sql.query('SELECT * FROM public.fleet_assignments WHERE ($2::boolean OR user_id = $1) ORDER BY created_at DESC', [user.id, GLOBAL_FLEET_ROLES.has(role)])
        : Promise.resolve([]),
      OPERATIONS_ROLES.has(role)
        ? sql.query('SELECT * FROM public.operational_records ORDER BY scheduled_at DESC LIMIT 100')
        : Promise.resolve([]),
      ODOO_ROLES.has(role)
        ? sql.query('SELECT * FROM public.odoo_sync_events ORDER BY occurred_at DESC LIMIT 100')
        : Promise.resolve([]),
    ]);

    return res.status(200).json({ invoices, fleetTelemetry, operationalRecords, odooEvents });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível carregar o portal';
    const status = /Autenticação|Sessão/.test(message) ? 401 : 503;
    return res.status(status).json({ error: message });
  }
}
