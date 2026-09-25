import { applyApiSecurity, takeRateLimit } from './_security.js';
import { authenticateNeonRequest } from './_neon.js';

const ALLOWED_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'odoo-sync', 5)) return res.status(429).json({ error: 'Muitos pedidos.' });

  let user;
  try {
    user = await authenticateNeonRequest(req);
  } catch {
    return res.status(401).json({ error: 'Sessão inválida' });
  }
  const role = user?.app_metadata?.role;
  if (!ALLOWED_ROLES.has(role)) return res.status(403).json({ error: 'Perfil sem autorização para sincronizar' });

  if (!process.env.ODOO_SYNC_URL || !process.env.ODOO_API_TOKEN) {
    return res.status(503).json({ error: 'Ponte Odoo não configurada' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(process.env.ODOO_SYNC_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ODOO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scope: 'pepek_operational_sync',
        initiatedBy: user.id,
        requestedAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Odoo recusou a sincronização');
    const data = await response.json();
    return res.status(202).json({ accepted: true, jobId: data.jobId || data.id || null });
  } catch {
    return res.status(503).json({ error: 'Sincronização Odoo indisponível' });
  } finally {
    clearTimeout(timeout);
  }
}
