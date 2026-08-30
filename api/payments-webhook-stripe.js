import crypto from 'node:crypto';
import { applyApiSecurity } from './_security.js';
import { failureMessage, getSupabaseAdmin, providerLabel, sha256, supabaseRequest, verifyStripeSignature } from './_payments.js';

export const config = { api: { bodyParser: false } };

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  const rawBody = await readRawBody(req);
  if (!verifyStripeSignature(rawBody, req.headers['stripe-signature'])) return res.status(400).json({ error: 'Assinatura inválida.' });
  let event;
  try { event = JSON.parse(rawBody); } catch { return res.status(400).json({ error: 'Evento inválido.' }); }
  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Persistência indisponível.' });

  const orderId = event.data?.object?.metadata?.payment_order_id;
  if (!event.id || !orderId) return res.status(200).json({ received: true, ignored: true });
  const eventInsert = await supabaseRequest(admin, 'payment_events', {
    method: 'POST', headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
    body: JSON.stringify({ payment_order_id: orderId, provider: 'stripe', provider_event_id: event.id, event_type: event.type, payload_hash: sha256(rawBody) }),
  });
  if (!eventInsert.ok && eventInsert.status !== 409) return res.status(502).json({ error: 'Falha de auditoria.' });

  let processingError = null;
  if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
    const orderResponse = await supabaseRequest(admin, `payment_orders?id=eq.${orderId}&select=id,invoice_id,status,amount_minor,currency,provider_reference`);
    const [order] = orderResponse.ok ? await orderResponse.json() : [];
    if (order && order.status !== 'paid') {
      const amountMatches = Number(event.data.object.amount_total) === Number(order.amount_minor);
      const currencyMatches = String(event.data.object.currency).toUpperCase() === order.currency;
      if (amountMatches && currencyMatches) {
        const paidAt = new Date().toISOString();
        await supabaseRequest(admin, `payment_orders?id=eq.${order.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'paid', paid_at: paidAt, updated_at: paidAt }) });
        await supabaseRequest(admin, `invoices?id=eq.${order.invoice_id}`, { method: 'PATCH', body: JSON.stringify({ status: 'paid', payment_gateway: providerLabel('stripe') }) });
        const receiptNumber = `REC-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const integrityHash = sha256(`${order.id}|${order.amount_minor}|${order.currency}|${event.data.object.id}|${paidAt}`);
        await supabaseRequest(admin, 'payment_receipts', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates' }, body: JSON.stringify({ payment_order_id: order.id, receipt_number: receiptNumber, amount_minor: order.amount_minor, currency: order.currency, provider_reference: event.data.object.id, integrity_hash: integrityHash }) });
      } else {
        // Stripe reports the session as paid but the amount or currency does not
        // match the server-owned order. Never settle the invoice; flag for the
        // finance team and record why the callback was not honoured.
        processingError = `amount/currency mismatch: got ${event.data.object.amount_total} ${String(event.data.object.currency).toUpperCase()}, expected ${order.amount_minor} ${order.currency}`;
        await supabaseRequest(admin, `payment_orders?id=eq.${order.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'failed', failure_code: 'AMOUNT_MISMATCH', failure_message: failureMessage('AMOUNT_MISMATCH'), updated_at: new Date().toISOString() }),
        });
      }
    }
  }
  await supabaseRequest(admin, `payment_events?provider=eq.stripe&provider_event_id=eq.${encodeURIComponent(event.id)}`, { method: 'PATCH', body: JSON.stringify({ processed: true, processing_error: processingError }) });
  return res.status(200).json({ received: true });
}
