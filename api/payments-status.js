import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import { authenticatePaymentUser, getSupabaseAdmin, supabaseRequest } from './_payments.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'payments-status', 30, 60_000)) return res.status(429).json({ error: 'Muitas consultas.' });
  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req, admin);
  if (!user) return res.status(401).json({ error: 'Sessão autenticada necessária.' });
  const orderId = cleanText(req.query?.id, 80);
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return res.status(400).json({ error: 'Ordem inválida.' });
  const response = await supabaseRequest(admin, `payment_orders?id=eq.${orderId}&user_id=eq.${user.id}&select=id,status,provider,currency,amount_minor,client_reference,paid_at,failure_message,created_at`);
  if (!response.ok) return res.status(502).json({ error: 'Não foi possível consultar o pagamento.' });
  const [order] = await response.json();
  return order ? res.status(200).json(order) : res.status(404).json({ error: 'Pagamento não encontrado.' });
}

