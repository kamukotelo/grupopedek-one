import { applyApiSecurity, takeRateLimit } from './_security.js';
import { authenticatePaymentUser, getSupabaseAdmin, supabaseRequest } from './_payments.js';

const FINANCE_ROLES = new Set(['contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'payments-pending', 30, 60_000)) return res.status(429).json({ error: 'Muitas consultas.' });
  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req, admin);
  if (!user || !FINANCE_ROLES.has(user.app_metadata?.role)) return res.status(403).json({ error: 'Operação reservada à equipa financeira.' });
  const response = await supabaseRequest(admin, 'payment_orders?provider=eq.bank_transfer&status=eq.pending&select=id,invoice_id,client_reference,amount_minor,currency,created_at,invoices(invoice_number,description)&order=created_at.desc&limit=100');
  if (!response.ok) return res.status(502).json({ error: 'Não foi possível consultar as transferências.' });
  return res.status(200).json(await response.json());
}
