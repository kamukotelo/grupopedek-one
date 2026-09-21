import assert from 'node:assert/strict';
import create from '../api/payments-create.js';
import reconcile from '../api/payments-reconcile.js';
import pending from '../api/payments-pending.js';

process.env.SUPABASE_URL = 'https://supabase.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
const customer = '11111111-1111-4111-8111-111111111111';
const invoiceId = '22222222-2222-4222-8222-222222222222';
const orderId = '33333333-3333-4333-8333-333333333333';
const key = '44444444-4444-4444-8444-444444444444';
const invoice = { id: invoiceId, invoice_number: 'FT-001', user_id: customer, amount_aoa: 25000.50, status: 'pending', description: 'Reserva' };
const order = { id: orderId, invoice_id: invoiceId, status: 'pending', amount_minor: 2500050, currency: 'AOA', provider: 'bank_transfer', client_reference: 'PK-PAY-TEST' };
let role = 'cliente_normal';
let writes = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, init = {}) => {
  const path = String(url);
  if (path.endsWith('/auth/v1/user')) return Response.json({ id: customer, email: 'test@example.com', app_metadata: { role } });
  if (path.includes('/rest/v1/invoices?')) return Response.json([invoice]);
  if (path.includes('/rest/v1/payment_orders?user_id=')) return Response.json([]);
  if (path.endsWith('/rest/v1/payment_orders') && init.method === 'POST') { writes.push(JSON.parse(init.body)); return Response.json([{ id: orderId }]); }
  if (path.includes('/rest/v1/payment_orders?id=eq.') && init.method === 'PATCH') { writes.push(JSON.parse(init.body)); return Response.json([]); }
  if (path.includes('/rest/v1/payment_orders?id=eq.99999999-9999-4999-8999-999999999999')) return Response.json([{ ...order, id: '99999999-9999-4999-8999-999999999999', provider: 'stripe' }]);
  if (path.includes('/rest/v1/payment_orders?id=eq.')) return Response.json([order]);
  if (path.includes('/rest/v1/payment_orders?provider=eq.bank_transfer&provider_reference=eq.REF-JA-UTILIZADA')) return Response.json([{ id: 'existing-used-order' }]);
  if (path.includes('/rest/v1/payment_orders?provider=eq.bank_transfer&provider_reference=')) return Response.json([]);
  if (path.includes('/rest/v1/payment_orders?provider=eq.bank_transfer&status=eq.pending')) return Response.json([order]);
  if (path.includes('/rest/v1/payment_events') && init.method === 'POST') { writes.push(JSON.parse(init.body)); return Response.json([]); }
  if (path.includes('/rest/v1/invoices?id=eq.') && init.method === 'PATCH') { writes.push(JSON.parse(init.body)); return Response.json([]); }
  if (path.includes('/rest/v1/payment_receipts') && init.method === 'POST') { writes.push(JSON.parse(init.body)); return Response.json([{ receipt_number: 'REC-TEST' }]); }
  throw new Error(`Unexpected request: ${path}`);
};
const invoke = async (handler, body = {}, method = 'POST') => {
  const req = { method, body, headers: { authorization: 'Bearer valid-test-token' }, socket: { remoteAddress: 'test' } };
  const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handler(req, res);
  return res;
};
try {
  const base = { invoiceId, provider: 'bank_transfer', currency: 'AOA', idempotencyKey: key, amountMinor: 1 };
  // 1. Rejeição de moeda diferente de AOA na criação da ordem
  assert.equal((await invoke(create, { ...base, currency: 'EUR' })).code, 400);
  assert.equal(writes.length, 0);

  // 2. Criação da ordem com montante em AOA fixado pelo servidor a partir da fatura
  const created = await invoke(create, base);
  assert.equal(created.code, 201);
  assert.equal(created.body.status, 'pending');
  assert.equal(created.body.amountMinor, 2500050);
  assert.equal(writes[0].amount_minor, 2500050);
  assert.equal(writes[0].status, 'created');
  assert.equal(writes[1].status, 'pending');
  writes = [];

  // 3. Consulta de pendentes restrita: utilizador normal recebe 403
  assert.equal((await invoke(pending, {}, 'GET')).code, 403);

  // 4. Baixa restrita: utilizador normal recebe 403
  const reconciliation = { orderId, providerReference: 'BANCO-123456', confirmedCurrency: 'AOA', confirmedAmountMinor: 2500050, idempotencyKey: key };
  assert.equal((await invoke(reconcile, reconciliation)).code, 403);

  // 5. Perfil financeiro autorizado a consultar pendentes
  role = 'contabilista';
  assert.equal((await invoke(pending, {}, 'GET')).body.length, 1);

  // 6. Rejeição de referência com menos de 6 caracteres
  assert.equal((await invoke(reconcile, { ...reconciliation, providerReference: '123' })).code, 400);

  // 7. Rejeição de montante discrepante da ordem
  assert.equal((await invoke(reconcile, { ...reconciliation, confirmedAmountMinor: 2500000 })).code, 409);

  // 8. Rejeição de moeda discrepante da ordem
  assert.equal((await invoke(reconcile, { ...reconciliation, confirmedCurrency: 'EUR' })).code, 409);

  // 9. Rejeição de referência bancária já utilizada
  assert.equal((await invoke(reconcile, { ...reconciliation, providerReference: 'REF-JA-UTILIZADA' })).code, 409);

  const stripeOrderId = '99999999-9999-4999-8999-999999999999';
  // 10. Rejeição de reconciliação manual em ordens que não sejam transferência bancária
  assert.equal((await invoke(reconcile, { ...reconciliation, orderId: stripeOrderId })).code, 409);
  assert.equal(writes.length, 0);

  // 11. Baixa bem-sucedida após validação de extrato, moeda e montante
  const settled = await invoke(reconcile, reconciliation);
  assert.equal(settled.code, 200);
  assert.equal(settled.body.status, 'paid');
  assert.ok(writes.some((write) => write.status === 'paid'));
  assert.ok(writes.some((write) => write.receipt_number));
  console.log('Transferência bancária: todas as 11 verificações de conformidade passaram.');
} finally { globalThis.fetch = originalFetch; }
