import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import {
  PAYMENT_CATEGORIES, PAYMENT_PROVIDERS, amountToMinor, authenticatePaymentUser,
  createStripeCheckout, getSupabaseAdmin, paymentReference, supabaseRequest,
} from './_payments.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'payments-create', 8, 60_000)) return res.status(429).json({ error: 'Muitos pedidos de pagamento. Aguarde um minuto.' });

  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req, admin);
  if (!user) return res.status(401).json({ error: 'Sessão autenticada necessária.' });

  const invoiceId = cleanText(req.body?.invoiceId, 80);
  const provider = cleanText(req.body?.provider, 30);
  const category = cleanText(req.body?.category, 40) || 'invoice';
  const idempotencyKey = cleanText(req.body?.idempotencyKey, 80);
  if (!/^[0-9a-f-]{36}$/i.test(invoiceId) || !/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return res.status(400).json({ error: 'Referência de pagamento inválida.' });
  if (!PAYMENT_PROVIDERS.has(provider) || !PAYMENT_CATEGORIES.has(category)) return res.status(400).json({ error: 'Método ou categoria inválida.' });

  const invoiceResponse = await supabaseRequest(admin, `invoices?id=eq.${encodeURIComponent(invoiceId)}&user_id=eq.${encodeURIComponent(user.id)}&select=id,invoice_number,amount_aoa,amount_usd,amount_eur,status,description,user_id`);
  if (!invoiceResponse.ok) return res.status(502).json({ error: 'Não foi possível validar a fatura.' });
  const [invoice] = await invoiceResponse.json();
  if (!invoice) return res.status(404).json({ error: 'Fatura não encontrada.' });
  if (invoice.status === 'paid') return res.status(409).json({ error: 'Esta fatura já está liquidada.' });

  const currency = provider === 'multicaixa' || provider === 'bank_transfer' ? 'AOA'
    : provider === 'mbway' ? 'EUR'
    : (cleanText(req.body?.currency, 3) || 'EUR').toUpperCase();
  if (!['AOA', 'USD', 'EUR'].includes(currency)) return res.status(400).json({ error: 'Moeda inválida.' });
  const sourceAmount = currency === 'AOA' ? invoice.amount_aoa : currency === 'USD' ? invoice.amount_usd : invoice.amount_eur;
  const amountMinor = amountToMinor(sourceAmount, currency);
  if (!amountMinor) return res.status(409).json({ error: `A fatura não possui valor autorizado em ${currency}.` });

  const existingResponse = await supabaseRequest(admin, `payment_orders?user_id=eq.${encodeURIComponent(user.id)}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=id,status,checkout_url,client_reference,provider,currency,amount_minor`);
  const [existing] = existingResponse.ok ? await existingResponse.json() : [];
  if (existing) return res.status(200).json(existing);

  const clientReference = paymentReference();
  const order = {
    invoice_id: invoice.id, user_id: user.id, category, provider, currency,
    amount_minor: amountMinor, status: 'created', idempotency_key: idempotencyKey,
    client_reference: clientReference, metadata: { invoice_number: invoice.invoice_number },
  };
  const insertResponse = await supabaseRequest(admin, 'payment_orders', {
    method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(order),
  });
  if (!insertResponse.ok) return res.status(502).json({ error: 'Não foi possível criar a ordem de pagamento.' });
  const [created] = await insertResponse.json();

  if (provider === 'stripe') {
    try {
      const session = await createStripeCheckout({ amountMinor, currency, description: invoice.description, paymentOrderId: created.id, clientReference, customerEmail: user.email });
      await supabaseRequest(admin, `payment_orders?id=eq.${created.id}`, {
        method: 'PATCH', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'pending', provider_reference: session.reference, checkout_url: session.checkoutUrl, expires_at: session.expiresAt, updated_at: new Date().toISOString() }),
      });
      return res.status(201).json({ id: created.id, status: 'pending', checkoutUrl: session.checkoutUrl, clientReference, provider, currency, amountMinor });
    } catch (error) {
      await supabaseRequest(admin, `payment_orders?id=eq.${created.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'failed', failure_code: error.message, updated_at: new Date().toISOString() }) });
      return res.status(503).json({ error: 'Pagamento por cartão ainda não está configurado.' });
    }
  }

  // EMIS/BAI/MB WAY require contracted provider APIs. Until credentials are
  // supplied, issue a traceable pending reference and never claim settlement.
  await supabaseRequest(admin, `payment_orders?id=eq.${created.id}`, {
    method: 'PATCH', body: JSON.stringify({ status: 'pending', expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() }),
  });
  return res.status(201).json({ id: created.id, status: 'pending', clientReference, provider, currency, amountMinor, requiresReconciliation: true });
}
