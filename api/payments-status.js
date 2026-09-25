import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import { authenticatePaymentUser, getPaymentDatabase } from './_payments.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'payments-status', 30, 60_000)) return res.status(429).json({ error: 'Muitas consultas.' });
  const sql = getPaymentDatabase();
  if (!sql) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req);
  if (!user) return res.status(401).json({ error: 'Sessão autenticada necessária.' });
  const orderId = cleanText(req.query?.id, 80);
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return res.status(400).json({ error: 'Ordem inválida.' });
  let order;
  try {
    [order] = await sql.query(
      `SELECT id, status, provider, currency, amount_minor, client_reference,
        paid_at, failure_message, created_at
       FROM public.payment_orders WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [orderId, user.id],
    );
  } catch {
    return res.status(502).json({ error: 'Não foi possível consultar o pagamento.' });
  }
  return order ? res.status(200).json(order) : res.status(404).json({ error: 'Pagamento não encontrado.' });
}
