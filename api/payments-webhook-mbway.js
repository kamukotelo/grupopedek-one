import crypto from 'node:crypto';
import { applyApiSecurity } from './_security.js';
import { failureMessage, getSupabaseAdmin, providerLabel, sha256, supabaseRequest, verifyMbWaySignature } from './_payments.js';

export const config = { api: { bodyParser: false } };

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'PEPEK Payments MB WAY Webhook',
      status: 'online',
      message: 'Endpoint operacional. Envie eventos POST com assinatura no header x-mbway-signature.',
    });
  }
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  const rawBody = await readRawBody(req);
  const signature = req.headers['x-mbway-signature'] || req.headers['x-signature'];

  if (!verifyMbWaySignature(rawBody, signature)) {
    return res.status(400).json({ error: 'Assinatura MB WAY / SIBS inválida.' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Payload inválido.' });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Persistência indisponível.' });

  const orderId = event.payment_order_id || event.metadata?.payment_order_id || event.order_id;
  const eventId = event.operation_id || event.id || `mbway_${Date.now()}`;
  if (!eventId || !orderId) return res.status(200).json({ received: true, ignored: true });

  const eventInsert = await supabaseRequest(admin, 'payment_events', {
    method: 'POST',
    headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
    body: JSON.stringify({
      payment_order_id: orderId,
      provider: 'mbway',
      provider_event_id: String(eventId),
      event_type: event.status === '000' || event.status === 'paid' || event.status === 'SUCCESS' ? 'mbway.payment.success' : 'mbway.payment.failed',
      payload_hash: sha256(rawBody),
    }),
  });
  if (!eventInsert.ok && eventInsert.status !== 409) return res.status(502).json({ error: 'Falha de auditoria.' });

  let processingError = null;
  if (event.status === '000' || event.status === 'paid' || event.status === 'SUCCESS') {
    const orderResponse = await supabaseRequest(admin, `payment_orders?id=eq.${orderId}&select=id,invoice_id,status,amount_minor,currency,provider_reference`);
    const [order] = orderResponse.ok ? await orderResponse.json() : [];
    if (order && order.status !== 'paid') {
      const amountMatches = Number(event.amount_minor || Math.round(Number(event.amount) * 100)) === Number(order.amount_minor);
      const currencyMatches = String(event.currency || 'EUR').toUpperCase() === order.currency;

      if (amountMatches && currencyMatches) {
        const paidAt = new Date().toISOString();
        await supabaseRequest(admin, `payment_orders?id=eq.${order.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'paid', paid_at: paidAt, updated_at: paidAt, provider_reference: String(eventId) }),
        });
        await supabaseRequest(admin, `invoices?id=eq.${order.invoice_id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'paid', payment_gateway: providerLabel('mbway') }),
        });
        const receiptNumber = `REC-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const integrityHash = sha256(`${order.id}|${order.amount_minor}|${order.currency}|${eventId}|${paidAt}`);
        await supabaseRequest(admin, 'payment_receipts', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            payment_order_id: order.id,
            receipt_number: receiptNumber,
            amount_minor: order.amount_minor,
            currency: order.currency,
            provider_reference: String(eventId),
            integrity_hash: integrityHash,
          }),
        });
      } else {
        processingError = `amount/currency mismatch: got ${event.amount} ${event.currency}, expected ${order.amount_minor} ${order.currency}`;
        await supabaseRequest(admin, `payment_orders?id=eq.${order.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'failed', failure_code: 'AMOUNT_MISMATCH', failure_message: failureMessage('AMOUNT_MISMATCH'), updated_at: new Date().toISOString() }),
        });
      }
    }
  }

  await supabaseRequest(admin, `payment_events?provider=eq.mbway&provider_event_id=eq.${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ processed: true, processing_error: processingError }),
  });

  return res.status(200).json({ received: true });
}
