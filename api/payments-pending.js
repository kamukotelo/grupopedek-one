import { applyApiSecurity, takeRateLimit } from './_security.js';
import { authenticatePaymentUser, getPaymentDatabase } from './_payments.js';

const FINANCE_ROLES = new Set(['contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'payments-pending', 30, 60_000)) return res.status(429).json({ error: 'Muitas consultas.' });
  const sql = getPaymentDatabase();
  if (!sql) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req);
  if (!user || !FINANCE_ROLES.has(user.app_metadata?.role)) return res.status(403).json({ error: 'Operação reservada à equipa financeira.' });
  try {
    const rows = await sql.query(
      `SELECT po.id, po.invoice_id, po.client_reference, po.amount_minor,
        po.currency, po.created_at,
        json_build_object('invoice_number', i.invoice_number, 'description', i.description) AS invoices
       FROM public.payment_orders po
       JOIN public.invoices i ON i.id = po.invoice_id
       WHERE po.provider = 'bank_transfer' AND po.status = 'pending'
       ORDER BY po.created_at DESC LIMIT 100`,
    );
    return res.status(200).json(rows);
  } catch {
    return res.status(502).json({ error: 'Não foi possível consultar as transferências.' });
  }
}
