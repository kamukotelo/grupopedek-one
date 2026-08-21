export default async function handler(_req, res) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const authHeader = _req.headers.authorization || '';
  if (!supabaseUrl || !supabaseKey || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  const authCheck = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseKey, Authorization: authHeader },
  });
  if (!authCheck.ok) return res.status(401).json({ error: 'Sessão inválida' });
  if (!process.env.ODOO_STATUS_URL || !process.env.ODOO_API_TOKEN) {
    return res.status(503).json({ error: 'Odoo não configurado' });
  }
  try {
    const response = await fetch(process.env.ODOO_STATUS_URL, {
      headers: { Authorization: `Bearer ${process.env.ODOO_API_TOKEN}` },
    });
    if (!response.ok) throw new Error('Odoo indisponível');
    const data = await response.json();
    return res.status(200).json(data);
  } catch {
    return res.status(503).json({ error: 'Odoo indisponível' });
  }
}
