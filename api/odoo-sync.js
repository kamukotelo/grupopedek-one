const ALLOWED_ROLES = new Set(['gestor_reservas', 'diretor_frotas', 'contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const authHeader = req.headers.authorization || '';
  if (!supabaseUrl || !supabaseKey || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const authCheck = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseKey, Authorization: authHeader },
  });
  if (!authCheck.ok) return res.status(401).json({ error: 'Sessão inválida' });
  const user = await authCheck.json();
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
