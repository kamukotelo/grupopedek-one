import crypto from 'node:crypto';
import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import { authenticatePaymentUser, getPaymentDatabase, providerLabel, sha256 } from './_payments.js';
import { isUniqueViolation } from './_neon.js';

const FINANCE_ROLES = new Set(['contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'payments-reconcile', 20, 60_000)) return res.status(429).json({ error: 'Muitas operações de reconciliação.' });
  const sql = getPaymentDatabase();
  if (!sql) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req);
  const role = user?.app_metadata?.role;
  if (!user || !FINANCE_ROLES.has(role)) return res.status(403).json({ error: 'Operação reservada à equipa financeira.' });

  const orderId = cleanText(req.body?.orderId, 80);
  const providerReference = cleanText(req.body?.providerReference, 180);
  const confirmedAmountMinor = Number(req.body?.confirmedAmountMinor);
  const confirmedCurrency = cleanText(req.body?.confirmedCurrency, 3).toUpperCase();
  const idempotencyKey = cleanText(req.body?.idempotencyKey, 80);
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || !/^[0-9a-f-]{36}$/i.test(idempotencyKey) || providerReference.length < 6) {
    return res.status(400).json({ error: 'Ordem, idempotência e comprovativo bancário são obrigatórios.' });
  }

  const [order] = await sql.query(
    `SELECT id, invoice_id, status, amount_minor, currency, provider, client_reference
     FROM public.payment_orders WHERE id = $1 LIMIT 1`,
    [orderId],
  );
  if (!order) return res.status(404).json({ error: 'Ordem não encontrada.' });
  if (order.provider === 'stripe') return res.status(409).json({ error: 'Pagamentos Stripe só podem ser liquidados pelo webhook assinado.' });
  if (order.provider !== 'bank_transfer') return res.status(409).json({ error: 'Esta baixa manual está disponível apenas para transferências bancárias.' });
  if (order.status === 'paid') return res.status(200).json({ id: order.id, status: 'paid', alreadyReconciled: true });
  if (!['created', 'pending', 'authorized'].includes(order.status)) return res.status(409).json({ error: `A ordem está no estado ${order.status}.` });
  if (!Number.isSafeInteger(confirmedAmountMinor) || confirmedAmountMinor !== Number(order.amount_minor) || confirmedCurrency !== order.currency) return res.status(409).json({ error: 'Valor ou moeda não corresponde à ordem. Confirme o extrato bancário.' });
  const [invoice] = await sql.query('SELECT id, status FROM public.invoices WHERE id = $1 LIMIT 1', [order.invoice_id]);
  if (!invoice || !['pending', 'overdue'].includes(invoice.status)) return res.status(409).json({ error: 'A fatura não está pendente.' });
  const duplicates = await sql.query(
    `SELECT id FROM public.payment_orders WHERE provider = 'bank_transfer' AND provider_reference = $1 LIMIT 1`,
    [providerReference],
  );
  if (duplicates.length) return res.status(409).json({ error: 'Esta referência bancária já foi utilizada.' });

  const providerEventId = `manual:${idempotencyKey}`;
  const auditPayload = JSON.stringify({ orderId, providerReference, operatorId: user.id, amountMinor: order.amount_minor, currency: order.currency });
  try {
    await sql.query(
      `INSERT INTO public.payment_events
        (payment_order_id, provider, provider_event_id, event_type, payload_hash, processed)
       VALUES ($1,$2,$3,'finance.reconciled',$4,true)`,
      [order.id, order.provider, providerEventId, sha256(auditPayload)],
    );
  } catch (error) {
    if (isUniqueViolation(error)) return res.status(200).json({ id: order.id, status: order.status, duplicate: true });
    return res.status(502).json({ error: 'Não foi possível registar a auditoria.' });
  }

  const paidAt = new Date().toISOString();
  const receiptNumber = `REC-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const integrityHash = sha256(`${order.id}|${order.amount_minor}|${order.currency}|${providerReference}|${paidAt}`);
  const [, , receipts] = await sql.transaction([
    sql`UPDATE public.payment_orders SET status = 'paid', provider_reference = ${providerReference},
      paid_at = ${paidAt}, updated_at = ${paidAt}, metadata = metadata || ${JSON.stringify({ reconciled_by: user.id })}::jsonb
      WHERE id = ${order.id}`,
    sql`UPDATE public.invoices SET status = 'paid', payment_gateway = ${providerLabel(order.provider)}
      WHERE id = ${order.invoice_id}`,
    sql`INSERT INTO public.payment_receipts
      (payment_order_id, receipt_number, amount_minor, currency, provider_reference, integrity_hash)
      VALUES (${order.id}, ${receiptNumber}, ${order.amount_minor}, ${order.currency}, ${providerReference}, ${integrityHash})
      RETURNING receipt_number`,
  ]);
  const [receipt] = receipts;
  return res.status(200).json({ id: order.id, status: 'paid', paidAt, receiptNumber: receipt?.receipt_number || receiptNumber });
}
