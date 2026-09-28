import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccessToken } from '../../lib/neon';

type PendingTransfer = {
  id: string;
  client_reference: string;
  amount_minor: number;
  currency: string;
  created_at: string;
  destination_bank?: { id?: string; name?: string; account?: string; iban?: string } | null;
  invoices?: { invoice_number: string; description: string } | null;
};

export function BankTransferBackoffice({ onReconciled }: { onReconciled: () => Promise<void> }) {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<PendingTransfer[]>([]);
  const [references, setReferences] = useState<Record<string, string>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const auth = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) throw new Error(t('backoffice.signInAgain'));
    return { Authorization: `Bearer ${token}` };
  }, [t]);
  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/payments-pending', { headers: await auth() });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || t('backoffice.loadError'));
      setOrders(body);
      setError('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : t('backoffice.queryError')); }
  }, [auth, t]);
  useEffect(() => { void load(); }, [load]);
  const reconcile = async (order: PendingTransfer) => {
    const reference = references[order.id]?.trim();
    const amount = amounts[order.id]?.trim();
    if (!reference || reference.length < 6 || !amount || !/^\d+(?:[,.]\d{1,2})?$/.test(amount)) { setError(t('backoffice.missingData')); return; }
    const amountMinor = Math.round(Number(amount.replace(',', '.')) * 100);
    if (amountMinor !== Number(order.amount_minor)) { setError(t('backoffice.amountMismatch')); return; }
    if (!window.confirm(t('backoffice.confirmPrompt', { amount, reference: order.client_reference }))) return;
    setBusy(order.id); setError('');
    try {
      const response = await fetch('/api/payments-reconcile', {
        method: 'POST', headers: { ...(await auth()), 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, providerReference: reference, confirmedAmountMinor: amountMinor, confirmedCurrency: 'AOA', idempotencyKey: crypto.randomUUID() }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || t('backoffice.reconcileError'));
      await load(); await onReconciled();
    } catch (cause) { setError(cause instanceof Error ? cause.message : t('backoffice.reconcileFail')); }
    finally { setBusy(null); }
  };
  return <section className="rounded-2xl border border-gray-200 bg-white p-4">
    <div className="flex items-center justify-between gap-3"><div><h4 className="font-bold text-[#09172C]">{t('backoffice.title')}</h4><p className="text-xs text-gray-600">{t('backoffice.subtitle')}</p></div><button type="button" onClick={() => void load()} className="rounded-lg border px-3 py-2 text-xs">{t('backoffice.refresh')}</button></div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    {orders.length === 0 && <p className="mt-3 text-sm text-gray-500">{t('backoffice.none')}</p>}
    <div className="mt-3 space-y-3">{orders.map((order) => <div key={order.id} className="rounded-xl border border-gray-200 p-3 text-xs">
      <p className="font-bold">{order.invoices?.invoice_number || order.id} · {(Number(order.amount_minor) / 100).toLocaleString(i18n.language, { minimumFractionDigits: 2 })} {order.currency}</p>
      <p className="text-gray-600">{t('backoffice.clientReference')} <strong>{order.client_reference}</strong> · {new Date(order.created_at).toLocaleString(i18n.language)}</p>
      {order.destination_bank && <p className="mt-1 text-gray-600">{t('backoffice.destination')} <strong>{order.destination_bank.name}</strong> · IBAN <strong className="font-mono">{order.destination_bank.iban}</strong></p>}
      <div className="mt-2 flex flex-wrap gap-2"><input aria-label={t('backoffice.bankRefAria')} placeholder={t('backoffice.bankRefPlaceholder')} value={references[order.id] || ''} onChange={(e) => setReferences((prev) => ({ ...prev, [order.id]: e.target.value }))} className="rounded-lg border p-2" /><input aria-label={t('backoffice.amountAria')} placeholder={t('backoffice.amountPlaceholder')} inputMode="decimal" value={amounts[order.id] || ''} onChange={(e) => setAmounts((prev) => ({ ...prev, [order.id]: e.target.value }))} className="rounded-lg border p-2" /><button type="button" disabled={busy === order.id} onClick={() => void reconcile(order)} className="rounded-lg bg-[#09172C] px-3 py-2 font-bold text-white disabled:opacity-50">{t('backoffice.confirmButton')}</button></div>
    </div>)}</div>
  </section>;
}
