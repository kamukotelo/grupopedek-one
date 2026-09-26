import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import {
  PAYMENT_CATEGORIES, PAYMENT_PROVIDERS, amountToMinor, authenticatePaymentUser,
  createStripeCheckout, failureMessage, getPaymentDatabase, paymentReference,
} from './_payments.js';

const BANK_TRANSFER_DESTINATIONS = {
  bai: { name: 'BAI', account: '7100 6979 10001', iban: 'AO06 0040 0000 7100 69791011 9' },
  standard_bank: { name: 'Standard Bank', account: '1000 1107 29', iban: 'AO06 0060 0117 0100 0110 7297 3' },
  atlantico: { name: 'Atlântico', account: '1887 8498 3100 01', iban: 'AO06 0055 0000 8878 4983 1010 6' },
  bfa: { name: 'BFA', account: '1413 8612 7300 01', iban: 'AO06 0006 0000 4138 6127 3010 7' },
};

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'payments-create', 8, 60_000)) return res.status(429).json({ error: 'Muitos pedidos de pagamento. Aguarde um minuto.' });

  const sql = getPaymentDatabase();
  if (!sql) return res.status(503).json({ error: 'Pagamentos ainda não configurados.' });
  const user = await authenticatePaymentUser(req);
  if (!user) return res.status(401).json({ error: 'Sessão autenticada necessária.' });

  const invoiceId = cleanText(req.body?.invoiceId, 80);
  const provider = cleanText(req.body?.provider, 30);
  const category = cleanText(req.body?.category, 40) || 'invoice';
  const idempotencyKey = cleanText(req.body?.idempotencyKey, 80);
  const destinationBankId = cleanText(req.body?.destinationBank, 30).toLowerCase();
  if (!/^[0-9a-f-]{36}$/i.test(invoiceId) || !/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return res.status(400).json({ error: 'Referência de pagamento inválida.' });
  if (!PAYMENT_PROVIDERS.has(provider) || !PAYMENT_CATEGORIES.has(category)) return res.status(400).json({ error: 'Método ou categoria inválida.' });
  if (provider === 'bank_transfer' && cleanText(req.body?.currency, 3).toUpperCase() !== 'AOA') return res.status(400).json({ error: 'Transferência bancária disponível apenas em AOA.' });
  if (provider === 'bank_transfer' && !BANK_TRANSFER_DESTINATIONS[destinationBankId]) return res.status(400).json({ error: 'Selecione uma conta bancária válida.' });

  let invoice;
  try {
    [invoice] = await sql.query(
      `SELECT id, invoice_number, amount_aoa, amount_usd, amount_eur, status, description, user_id
       FROM public.invoices WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [invoiceId, user.id],
    );
  } catch {
    return res.status(502).json({ error: 'Não foi possível validar a fatura.' });
  }
  if (!invoice) return res.status(404).json({ error: 'Fatura não encontrada.' });
  if (!['pending', 'overdue'].includes(invoice.status)) return res.status(409).json({ error: 'Esta fatura não está disponível para pagamento.' });

  const currency = provider === 'multicaixa' ? 'AOA'
    : provider === 'mbway' ? 'EUR'
    : (cleanText(req.body?.currency, 3) || (provider === 'bank_transfer' ? 'AOA' : 'EUR')).toUpperCase();
  if (!['AOA', 'USD', 'EUR'].includes(currency)) return res.status(400).json({ error: 'Moeda inválida.' });
  let sourceAmount = currency === 'AOA' ? invoice.amount_aoa : currency === 'USD' ? invoice.amount_usd : invoice.amount_eur;
  if (!sourceAmount && currency === 'EUR' && invoice.amount_usd) {
    sourceAmount = Math.round(Number(invoice.amount_usd) * 0.92);
  }
  const amountMinor = amountToMinor(sourceAmount, currency);
  if (!amountMinor) return res.status(409).json({ error: `A fatura não possui valor autorizado em ${currency}.` });

  const [existing] = await sql.query(
    `SELECT id, status, checkout_url, client_reference, provider, currency, amount_minor
     FROM public.payment_orders WHERE user_id = $1 AND idempotency_key = $2 LIMIT 1`,
    [user.id, idempotencyKey],
  );
  if (existing) return res.status(200).json(existing);

  const clientReference = paymentReference();
  let created;
  try {
    [created] = await sql.query(
      `INSERT INTO public.payment_orders
        (invoice_id, user_id, category, provider, currency, amount_minor, status,
         idempotency_key, client_reference, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,'created',$7,$8,$9::jsonb)
       RETURNING id`,
      [invoice.id, user.id, category, provider, currency, amountMinor, idempotencyKey,
        clientReference, JSON.stringify({
          invoice_number: invoice.invoice_number,
          ...(provider === 'bank_transfer' ? { destination_bank: { id: destinationBankId, ...BANK_TRANSFER_DESTINATIONS[destinationBankId] } } : {}),
        })],
    );
  } catch {
    return res.status(502).json({ error: 'Não foi possível criar a ordem de pagamento.' });
  }

  if (provider === 'stripe') {
    try {
      const session = await createStripeCheckout({ amountMinor, currency, description: invoice.description, paymentOrderId: created.id, clientReference, customerEmail: user.email });
      await sql.query(
        `UPDATE public.payment_orders SET status = 'pending', provider_reference = $2,
         checkout_url = $3, expires_at = $4, updated_at = now() WHERE id = $1`,
        [created.id, session.reference, session.checkoutUrl, session.expiresAt],
      );
      return res.status(201).json({ id: created.id, status: 'pending', checkoutUrl: session.checkoutUrl, clientReference, provider, currency, amountMinor });
    } catch (error) {
      const failureCode = String(error.message || 'STRIPE_SESSION_FAILED').slice(0, 80);
      const message = failureMessage(failureCode);
      await sql.query(
        `UPDATE public.payment_orders SET status = 'failed', failure_code = $2,
         failure_message = $3, updated_at = now() WHERE id = $1`,
        [created.id, failureCode, message],
      );
      return res.status(503).json({ error: message });
    }
  }

  // EMIS/BAI/MB WAY require contracted provider APIs. Until credentials are
  // supplied, issue a traceable pending reference and never claim settlement.
  await sql.query(
    `UPDATE public.payment_orders SET status = 'pending', expires_at = $2, updated_at = now() WHERE id = $1`,
    [created.id, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()],
  );
  return res.status(201).json({ id: created.id, status: 'pending', clientReference, provider, currency, amountMinor, requiresReconciliation: true });
}
