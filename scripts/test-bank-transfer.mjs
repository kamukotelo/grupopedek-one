import assert from 'node:assert/strict';
import create from '../api/payments-create.js';
import reconcile from '../api/payments-reconcile.js';
import pending from '../api/payments-pending.js';

process.env.NODE_ENV = 'test';
const customer = '11111111-1111-4111-8111-111111111111';
const invoiceId = '22222222-2222-4222-8222-222222222222';
const orderId = '33333333-3333-4333-8333-333333333333';
const key = '44444444-4444-4444-8444-444444444444';
const stripeOrderId = '99999999-9999-4999-8999-999999999999';
const invoice = { id: invoiceId, invoice_number: 'FT-001', user_id: customer, amount_aoa: 25000.50, amount_usd: 0, amount_eur: 0, status: 'pending', description: 'Reserva' };
const order = { id: orderId, invoice_id: invoiceId, status: 'pending', amount_minor: 2500050, currency: 'AOA', provider: 'bank_transfer', client_reference: 'PK-PAY-TEST' };
let role = 'cliente_normal';
let writes = [];

const sql = (strings, ...params) => ({ strings, params });
sql.query = async (text, params = []) => {
  if (text.includes('FROM public.invoices WHERE id = $1 AND user_id = $2')) return [invoice];
  if (text.includes('FROM public.payment_orders WHERE user_id = $1 AND idempotency_key')) return [];
  if (text.includes('INSERT INTO public.payment_orders')) {
    writes.push({ status: 'created', amount_minor: params[5] });
    return [{ id: orderId }];
  }
  if (text.includes("SET status = 'pending'")) { writes.push({ status: 'pending' }); return []; }
  if (text.includes('FROM public.payment_orders WHERE id = $1 LIMIT 1')) {
    return [{ ...order, id: params[0], provider: params[0] === stripeOrderId ? 'stripe' : 'bank_transfer' }];
  }
  if (text.includes('SELECT id, status FROM public.invoices')) return [{ id: invoiceId, status: 'pending' }];
  if (text.includes("provider = 'bank_transfer' AND provider_reference")) return params[0] === 'REF-JA-UTILIZADA' ? [{ id: 'used' }] : [];
  if (text.includes('INSERT INTO public.payment_events')) { writes.push({ audit: true }); return [{ id: 'event' }]; }
  if (text.includes('FROM public.payment_orders po')) return [order];
  throw new Error(`Unexpected query: ${text.replace(/\s+/g, ' ').trim()}`);
};
sql.transaction = async (queries) => {
  for (const query of queries) {
    const statement = query.strings.join(' ');
    if (statement.includes('UPDATE public.payment_orders')) writes.push({ status: 'paid' });
    if (statement.includes('INSERT INTO public.payment_receipts')) writes.push({ receipt_number: 'REC-TEST' });
  }
  return [[], [], [{ receipt_number: 'REC-TEST' }]];
};

globalThis.__PEPEK_NEON_TEST_DATABASE__ = sql;
globalThis.__PEPEK_NEON_TEST_USER__ = {
  id: customer,
  email: 'test@example.com',
  get app_metadata() { return { role }; },
};

const invoke = async (handler, body = {}, method = 'POST') => {
  const req = { method, body, query: body, headers: { authorization: 'Bearer valid-test-token' }, socket: { remoteAddress: 'test' } };
  const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handler(req, res);
  return res;
};

try {
  const base = { invoiceId, provider: 'bank_transfer', currency: 'AOA', idempotencyKey: key, amountMinor: 1 };
  assert.equal((await invoke(create, { ...base, currency: 'EUR' })).code, 400);
  assert.equal(writes.length, 0);

  const created = await invoke(create, base);
  assert.equal(created.code, 201);
  assert.equal(created.body.status, 'pending');
  assert.equal(created.body.amountMinor, 2500050);
  assert.equal(writes[0].amount_minor, 2500050);
  assert.equal(writes[0].status, 'created');
  assert.equal(writes[1].status, 'pending');
  writes = [];

  assert.equal((await invoke(pending, {}, 'GET')).code, 403);
  const reconciliation = { orderId, providerReference: 'BANCO-123456', confirmedCurrency: 'AOA', confirmedAmountMinor: 2500050, idempotencyKey: key };
  assert.equal((await invoke(reconcile, reconciliation)).code, 403);

  role = 'contabilista';
  assert.equal((await invoke(pending, {}, 'GET')).body.length, 1);
  assert.equal((await invoke(reconcile, { ...reconciliation, providerReference: '123' })).code, 400);
  assert.equal((await invoke(reconcile, { ...reconciliation, confirmedAmountMinor: 2500000 })).code, 409);
  assert.equal((await invoke(reconcile, { ...reconciliation, confirmedCurrency: 'EUR' })).code, 409);
  assert.equal((await invoke(reconcile, { ...reconciliation, providerReference: 'REF-JA-UTILIZADA' })).code, 409);
  assert.equal((await invoke(reconcile, { ...reconciliation, orderId: stripeOrderId })).code, 409);
  assert.equal(writes.length, 0);

  const settled = await invoke(reconcile, reconciliation);
  assert.equal(settled.code, 200);
  assert.equal(settled.body.status, 'paid');
  assert.ok(writes.some((write) => write.status === 'paid'));
  assert.ok(writes.some((write) => write.receipt_number));
  console.log('Transferência bancária no Neon: todas as 11 verificações de conformidade passaram.');
} finally {
  delete globalThis.__PEPEK_NEON_TEST_DATABASE__;
  delete globalThis.__PEPEK_NEON_TEST_USER__;
}
