import { applyApiSecurity } from './_security.js';
import {
  failPaymentOrder, findPaymentOrder, finishPaymentEvent, getPaymentDatabase,
  recordPaymentEvent, settlePaymentOrder, sha256, verifyMulticaixaSignature,
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
      service: 'PEPEK Payments Multicaixa Webhook',
      status: 'online',
      message: 'Endpoint operacional. Envie eventos POST com assinatura no header x-emis-signature.',
    });
  }
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  const rawBody = await readRawBody(req);
  const signature = req.headers['x-emis-signature'] || req.headers['x-signature'];

  if (!verifyMulticaixaSignature(rawBody, signature)) {
    return res.status(400).json({ error: 'Assinatura EMIS inválida.' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Payload inválido.' });
  }

  const sql = getPaymentDatabase();
  if (!sql) return res.status(503).json({ error: 'Persistência indisponível.' });

  const orderId = event.payment_order_id || event.metadata?.payment_order_id;
  const eventId = event.transaction_id || event.id || `emis_${Date.now()}`;
  if (!eventId || !orderId) return res.status(200).json({ received: true, ignored: true });

  try {
    await recordPaymentEvent(sql, {
      paymentOrderId: orderId, provider: 'multicaixa', providerEventId: String(eventId),
      eventType: event.status === 'SUCCESS' || event.status === 'paid' ? 'emis.payment.success' : 'emis.payment.failed',
      payloadHash: sha256(rawBody),
    });
  } catch {
    return res.status(502).json({ error: 'Falha de auditoria.' });
  }

  let processingError = null;
  if (event.status === 'SUCCESS' || event.status === 'paid') {
    const order = await findPaymentOrder(sql, orderId);
    if (order && order.status !== 'paid') {
      const amountMatches = Number(event.amount_minor || (Number(event.amount) * 100)) === Number(order.amount_minor);
      const currencyMatches = String(event.currency || 'AOA').toUpperCase() === order.currency;

      if (amountMatches && currencyMatches) {
        await settlePaymentOrder(sql, order, {
          provider: 'multicaixa', providerReference: String(eventId),
          paidAt: new Date().toISOString(),
        });
      } else {
        processingError = `amount/currency mismatch: got ${event.amount} ${event.currency}, expected ${order.amount_minor} ${order.currency}`;
        await failPaymentOrder(sql, order.id, 'AMOUNT_MISMATCH');
      }
    }
  }

  await finishPaymentEvent(sql, 'multicaixa', eventId, processingError);

  return res.status(200).json({ received: true });
}
