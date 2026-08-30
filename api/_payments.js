import crypto from 'node:crypto';
import { safeEqual } from './_security.js';

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

export const getSupabaseAdmin = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
};

export const supabaseRequest = async (admin, path, init = {}) => fetch(`${admin.url}/rest/v1/${path}`, {
  ...init,
  headers: {
    apikey: admin.key,
    Authorization: `Bearer ${admin.key}`,
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  },
});

export const authenticatePaymentUser = async (req, admin) => {
  const authorization = String(req.headers.authorization || '');
  if (!authorization.startsWith('Bearer ')) return null;
  const token = authorization.slice(7).trim();
  if (!token) return null;
  const response = await fetch(`${admin.url}/auth/v1/user`, {
    headers: { apikey: admin.key, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
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
  const siteUrl = process.env.SITE_URL;
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
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const parts = Object.fromEntries(String(signatureHeader).split(',').map((part) => part.split('=', 2)));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  return safeEqual(expected, parts.v1);
};

export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

