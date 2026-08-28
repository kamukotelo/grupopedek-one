import crypto from 'node:crypto';
import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import { authenticatePaymentUser, getSupabaseAdmin, sha256, supabaseRequest } from './_payments.js';

const FINANCE_ROLES = new Set(['contabilista', 'gestor_portugal', 'direcao']);

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'payments-reconcile', 20, 60_000)) return res.status(429).json({ error: 'Muitas operações de reconciliação.' });
  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req, admin);
  const role = user?.app_metadata?.role;
  if (!user || !FINANCE_ROLES.has(role)) return res.status(403).json({ error: 'Operação reservada à equipa financeira.' });

  const orderId = cleanText(req.body?.orderId, 80);
  const providerReference = cleanText(req.body?.providerReference, 180);
  const idempotencyKey = cleanText(req.body?.idempotencyKey, 80);
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || !/^[0-9a-f-]{36}$/i.test(idempotencyKey) || providerReference.length < 6) {
    return res.status(400).json({ error: 'Ordem, idempotência e comprovativo bancário são obrigatórios.' });
  }

  const orderResponse = await supabaseRequest(admin, `payment_orders?id=eq.${orderId}&select=id,invoice_id,status,amount_minor,currency,provider,client_reference`);
  const [order] = orderResponse.ok ? await orderResponse.json() : [];
  if (!order) return res.status(404).json({ error: 'Ordem não encontrada.' });
  if (order.provider === 'stripe') return res.status(409).json({ error: 'Pagamentos Stripe só podem ser liquidados pelo webhook assinado.' });
  if (order.status === 'paid') return res.status(200).json({ id: order.id, status: 'paid', alreadyReconciled: true });
  if (!['created', 'pending', 'authorized'].includes(order.status)) return res.status(409).json({ error: `A ordem está no estado ${order.status}.` });

  const providerEventId = `manual:${idempotencyKey}`;
  const auditPayload = JSON.stringify({ orderId, providerReference, operatorId: user.id, amountMinor: order.amount_minor, currency: order.currency });
  const eventResponse = await supabaseRequest(admin, 'payment_events', {
    method: 'POST', headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ payment_order_id: order.id, provider: order.provider, provider_event_id: providerEventId, event_type: 'finance.reconciled', payload_hash: sha256(auditPayload), processed: true }),
  });
  if (!eventResponse.ok) {
    if (eventResponse.status === 409) return res.status(200).json({ id: order.id, status: order.status, duplicate: true });
    return res.status(502).json({ error: 'Não foi possível registar a auditoria.' });
  }

  const paidAt = new Date().toISOString();
  await supabaseRequest(admin, `payment_orders?id=eq.${order.id}`, {
    method: 'PATCH', body: JSON.stringify({ status: 'paid', provider_reference: providerReference, paid_at: paidAt, updated_at: paidAt, metadata: { reconciled_by: user.id } }),
  });
  await supabaseRequest(admin, `invoices?id=eq.${order.invoice_id}`, {
    method: 'PATCH', body: JSON.stringify({ status: 'paid', payment_gateway: order.provider }),
  });
  const receiptNumber = `REC-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const integrityHash = sha256(`${order.id}|${order.amount_minor}|${order.currency}|${providerReference}|${paidAt}`);
  const receiptResponse = await supabaseRequest(admin, 'payment_receipts', {
    method: 'POST', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ payment_order_id: order.id, receipt_number: receiptNumber, amount_minor: order.amount_minor, currency: order.currency, provider_reference: providerReference, integrity_hash: integrityHash }),
  });
  const [receipt] = receiptResponse.ok ? await receiptResponse.json() : [];
  return res.status(200).json({ id: order.id, status: 'paid', paidAt, receiptNumber: receipt?.receipt_number || receiptNumber });
}
