import { applyApiSecurity, safeEqual, takeRateLimit } from './_security.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'crm-sync', 10)) return res.status(429).json({ error: 'Muitos pedidos.' });
  const expectedToken = process.env.CRM_SYNC_TOKEN;
  const suppliedToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!safeEqual(suppliedToken, expectedToken)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  if (!process.env.CRM_WEBHOOK_URL) return res.status(503).json({ error: 'CRM não configurado' });
  const body = req.body || {};
  if (!body.client?.name || (!body.client?.phone && !body.client?.email)) {
    return res.status(400).json({ error: 'Dados do cliente incompletos' });
  }
  try {
    const response = await fetch(process.env.CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pepek-Source': 'pepek-web' },
      body: JSON.stringify(body),
    });
    if (!response.ok) return res.status(502).json({ error: 'CRM indisponível' });
    const data = await response.json().catch(() => ({}));
    return res.status(200).json({ success: true, lead_id: data.lead_id });
  } catch {
    return res.status(503).json({ error: 'CRM indisponível' });
  }
}
