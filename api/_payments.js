import crypto from 'node:crypto';
import { safeEqual } from './_security.js';
import { authenticateNeonRequest, getDatabase } from './_neon.js';

export const PAYMENT_PROVIDERS = new Set(['stripe', 'multicaixa', 'bank_transfer', 'mbway']);
export const PAYMENT_CATEGORIES = new Set(['rent_a_car', 'transfer', 'route', 'chauffeur', 'event', 'corporate', 'invoice', 'other']);

// Human labels shown on invoices/receipts. Mirrors src/lib/payments.ts so a
// gateway never surfaces as a raw identifier like "bank_transfer" in the portal.
export const PROVIDER_LABELS = {
  stripe: 'Cartão / Stripe',
  multicaixa: 'Multicaixa Express',
  bank_transfer: 'Transferência Bancária',
  mbway: 'MB WAY',
};
export const providerLabel = (provider) => PROVIDER_LABELS[provider] || 'Transferência Bancária';

// Maps internal failure codes to a message safe to show the client.
export const FAILURE_MESSAGES = {
  STRIPE_NOT_CONFIGURED: 'Pagamento por cartão ainda não está disponível. Utilize Multicaixa Express ou transferência bancária.',
  SITE_URL_NOT_CONFIGURED: 'Configuração do servidor incompleta para pagamentos por cartão. Contacte o apoio.',
  STRIPE_SESSION_FAILED: 'O provedor de cartão recusou a criação da sessão de pagamento. Tente novamente.',
  AMOUNT_MISMATCH: 'O valor confirmado pelo provedor não corresponde à fatura. A equipa financeira está a rever — nenhuma fatura foi marcada como paga.',
};
export const failureMessage = (code) => FAILURE_MESSAGES[code] || 'Não foi possível concluir o pagamento. Nenhum valor foi cobrado.';

export const getPaymentDatabase = () => {
  try {
    return getDatabase();
  } catch {
    return null;
  }
};

export const authenticatePaymentUser = async (req) => {
  try {
    return await authenticateNeonRequest(req);
  } catch {
    return null;
  }
};

export const amountToMinor = (amount, currency) => {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  // AOA is represented with two decimal minor units by payment providers too.
  return Math.round(numeric * 100);
};

export const paymentReference = () => `PK-PAY-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

export const createStripeCheckout = async ({ amountMinor, currency, description, paymentOrderId, clientReference, customerEmail }) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error('STRIPE_NOT_CONFIGURED');
  const siteUrl = process.env.SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  if (!siteUrl) throw new Error('SITE_URL_NOT_CONFIGURED');
  const body = new URLSearchParams({
    mode: 'payment',
    success_url: `${siteUrl}/painel?payment=success&order=${encodeURIComponent(paymentOrderId)}`,
    cancel_url: `${siteUrl}/painel?payment=cancelled&order=${encodeURIComponent(paymentOrderId)}`,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': currency.toLowerCase(),
    'line_items[0][price_data][unit_amount]': String(amountMinor),
    'line_items[0][price_data][product_data][name]': description.slice(0, 120),
    'metadata[payment_order_id]': paymentOrderId,
    'metadata[client_reference]': clientReference,
    'payment_intent_data[metadata][payment_order_id]': paymentOrderId,
  });
  if (customerEmail) body.set('customer_email', customerEmail);
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const result = await response.json();
  if (!response.ok || !result.id || !result.url) throw new Error('STRIPE_SESSION_FAILED');
  return { reference: result.id, checkoutUrl: result.url, expiresAt: result.expires_at ? new Date(result.expires_at * 1000).toISOString() : null };
};

export const verifyStripeSignature = (rawBody, signatureHeader) => {
  const secret = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const parts = Object.fromEntries(String(signatureHeader).split(',').map((part) => part.split('=', 2)));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const expected = crypto.createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${rawBody}`).digest('hex');
  return safeEqual(expected, parts.v1);
};

export const verifyMulticaixaSignature = (rawBody, signatureHeader) => {
  const secret = process.env.EMIS_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqual(expected, signatureHeader.trim());
};

export const verifyMbWaySignature = (rawBody, signatureHeader) => {
  const secret = process.env.MBWAY_WEBHOOK_SECRET || process.env.SIBS_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqual(expected, signatureHeader.trim());
};

export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export const recordPaymentEvent = async (sql, event) => {
  const rows = await sql.query(
    `INSERT INTO public.payment_events
      (payment_order_id, provider, provider_event_id, event_type, payload_hash)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (provider, provider_event_id) DO NOTHING
     RETURNING id`,
    [event.paymentOrderId, event.provider, event.providerEventId, event.eventType, event.payloadHash],
  );
  return rows.length > 0;
};

export const findPaymentOrder = async (sql, orderId) => {
  const [order] = await sql.query(
    `SELECT id, invoice_id, status, amount_minor, currency, provider_reference
     FROM public.payment_orders WHERE id = $1 LIMIT 1`,
    [orderId],
  );
  return order || null;
};

export const settlePaymentOrder = async (sql, order, { provider, providerReference, paidAt }) => {
  const receiptNumber = `REC-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const integrityHash = sha256(`${order.id}|${order.amount_minor}|${order.currency}|${providerReference}|${paidAt}`);
  await sql.transaction([
    sql`UPDATE public.payment_orders SET status = 'paid', paid_at = ${paidAt},
      updated_at = ${paidAt}, provider_reference = COALESCE(${providerReference}, provider_reference)
      WHERE id = ${order.id} AND status <> 'paid'`,
    sql`UPDATE public.invoices SET status = 'paid', payment_gateway = ${providerLabel(provider)}
      WHERE id = ${order.invoice_id}`,
    sql`INSERT INTO public.payment_receipts
      (payment_order_id, receipt_number, amount_minor, currency, provider_reference, integrity_hash)
      VALUES (${order.id}, ${receiptNumber}, ${order.amount_minor}, ${order.currency}, ${providerReference}, ${integrityHash})
      ON CONFLICT (payment_order_id) DO NOTHING`,
  ]);
};

export const failPaymentOrder = (sql, orderId, code) => sql.query(
  `UPDATE public.payment_orders SET status = 'failed', failure_code = $2,
   failure_message = $3, updated_at = now() WHERE id = $1`,
  [orderId, code, failureMessage(code)],
);

export const finishPaymentEvent = (sql, provider, eventId, processingError) => sql.query(
  `UPDATE public.payment_events SET processed = true, processing_error = $3
   WHERE provider = $1 AND provider_event_id = $2`,
  [provider, String(eventId), processingError],
);
