import { applyApiSecurity } from './_security.js';
import {
  failPaymentOrder, findPaymentOrder, finishPaymentEvent, getPaymentDatabase,
  recordPaymentEvent, settlePaymentOrder, sha256, verifyStripeSignature,
} from './_payments.js';

export const config = { api: { bodyParser: false } };

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'PEPEK Payments Stripe Webhook',
      status: 'online',
      message: 'Endpoint operacional. Envie eventos POST com assinatura Stripe no header stripe-signature.',
    });
  }
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  const rawBody = await readRawBody(req);
  if (!verifyStripeSignature(rawBody, req.headers['stripe-signature'])) return res.status(400).json({ error: 'Assinatura inválida.' });
  let event;
  try { event = JSON.parse(rawBody); } catch { return res.status(400).json({ error: 'Evento inválido.' }); }
  const sql = getPaymentDatabase();
  if (!sql) return res.status(503).json({ error: 'Persistência indisponível.' });

  const orderId = event.data?.object?.metadata?.payment_order_id;
  if (!event.id || !orderId) return res.status(200).json({ received: true, ignored: true });
  try {
    await recordPaymentEvent(sql, {
      paymentOrderId: orderId, provider: 'stripe', providerEventId: event.id,
      eventType: event.type, payloadHash: sha256(rawBody),
    });
  } catch {
    return res.status(502).json({ error: 'Falha de auditoria.' });
  }

  let processingError = null;
  if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
    const order = await findPaymentOrder(sql, orderId);
    if (order && order.status !== 'paid') {
      const amountMatches = Number(event.data.object.amount_total) === Number(order.amount_minor);
      const currencyMatches = String(event.data.object.currency).toUpperCase() === order.currency;
      if (amountMatches && currencyMatches) {
        await settlePaymentOrder(sql, order, {
          provider: 'stripe', providerReference: event.data.object.id,
          paidAt: new Date().toISOString(),
        });
      } else {
        // Stripe reports the session as paid but the amount or currency does not
        // match the server-owned order. Never settle the invoice; flag for the
        // finance team and record why the callback was not honoured.
        processingError = `amount/currency mismatch: got ${event.data.object.amount_total} ${String(event.data.object.currency).toUpperCase()}, expected ${order.amount_minor} ${order.currency}`;
        await failPaymentOrder(sql, order.id, 'AMOUNT_MISMATCH');
      }
    }
  }
  await finishPaymentEvent(sql, 'stripe', event.id, processingError);
  return res.status(200).json({ received: true });
}
