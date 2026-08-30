import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, CreditCard, Landmark, Smartphone, Loader2, CheckCircle2, Clock3, ExternalLink } from 'lucide-react';
import { InvoiceItem } from '../../types/auth';
import { createPaymentOrder, PROVIDER_LABELS as providerLabels, type PaymentProvider } from '../../lib/payments';

interface PaymentSimulatorModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
  onSuccess: (invoiceId: string, gateway: string) => void;
}

export const PaymentSimulatorModal: React.FC<PaymentSimulatorModalProps> = ({ invoice, onClose, onSuccess }) => {
  const isDemo = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true';
  const [provider, setProvider] = useState<PaymentProvider>('multicaixa');
  const [currency, setCurrency] = useState<'AOA' | 'USD' | 'EUR'>('AOA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [done, setDone] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  useEffect(() => {
    setError(''); setReference(''); setDone(false); setIsProcessing(false);
    setProvider('multicaixa'); setCurrency('AOA');
    setIdempotencyKey(crypto.randomUUID());
  }, [invoice?.id]);

  useEffect(() => {
    // Multicaixa e transferência liquidam sempre em AOA; MB WAY só em EUR.
    // Apenas o cartão internacional (Stripe) permite escolher EUR ou USD.
    if (provider === 'multicaixa' || provider === 'bank_transfer') setCurrency('AOA');
    else setCurrency('EUR');
  }, [provider]);

  if (!invoice) return null;

  const handlePay = async () => {
    setError(''); setIsProcessing(true);
    try {
      if (isDemo) {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        setReference(`DEMO-${invoice.id.toUpperCase()}`); setDone(true);
        onSuccess(invoice.id, providerLabels[provider]);
        return;
      }
      const order = await createPaymentOrder({ invoiceId: invoice.id, provider, currency, idempotencyKey });
      setReference(order.clientReference);
      if (order.checkoutUrl) { window.location.assign(order.checkoutUrl); return; }
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível iniciar o pagamento.');
    } finally { setIsProcessing(false); }
  };

  const methods: Array<{ id: PaymentProvider; label: string; detail: string; Icon: typeof CreditCard }> = [
    { id: 'multicaixa', label: 'Multicaixa Express', detail: 'AOA · Angola', Icon: Smartphone },
    { id: 'stripe', label: 'Cartão internacional', detail: 'Visa / Mastercard · EUR ou USD', Icon: CreditCard },
    { id: 'bank_transfer', label: 'Transferência bancária', detail: 'AOA · Reconciliação financeira', Icon: Landmark },
    { id: 'mbway', label: 'MB WAY', detail: 'EUR · Portugal', Icon: Smartphone },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Fechar pagamento" />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="relative bg-gradient-to-r from-[#09172C] to-[#0C2E60] p-6 text-white">
          <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Fechar"><X className="h-5 w-5" /></button>
          <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#FEC228]">{isDemo ? 'Ambiente de demonstração' : 'Pagamento seguro PEPEK'}</span>
          <h3 className="mt-1 text-xl font-extrabold">Liquidar {invoice.invoiceNumber}</h3>
          <p className="mt-1 pr-8 text-xs text-white/65">{invoice.description}</p>
          <div className="mt-4 flex items-end justify-between rounded-xl border border-white/10 bg-white/10 p-3">
            <span className="text-xs text-white/65">Valor da fatura</span>
            <strong className="text-lg">{invoice.amountAOA.toLocaleString('pt-AO')} AOA</strong>
          </div>
        </header>

        <div className="p-6">
          {done ? (
            <div className="space-y-4 py-3 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-700"><Clock3 className="h-7 w-7" /></div>
              <h4 className="text-lg font-extrabold text-[#09172C]">{isDemo ? 'Simulação concluída' : 'Pagamento aguardando confirmação'}</h4>
              <p className="text-xs leading-relaxed text-gray-600">{isDemo ? 'Nenhuma cobrança foi efetuada.' : 'A fatura só será marcada como paga após confirmação assinada do provedor ou reconciliação pela equipa financeira.'}</p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left text-xs"><span className="block text-gray-500">Referência segura</span><strong className="font-mono text-[#09172C]">{reference}</strong></div>
              <button type="button" onClick={onClose} className="btn-primary w-full justify-center py-3 text-xs font-bold">Fechar</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-[11px] leading-relaxed text-[#0C3D73]">
                <ShieldCheck className="mr-2 inline h-4 w-4" />O valor é validado no servidor. A PEPEK não recolhe nem armazena o número do seu cartão ou PIN bancário.
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {methods.map(({ id, label, detail, Icon }) => (
                  <button key={id} type="button" onClick={() => setProvider(id)} className={`rounded-xl border-2 p-3 text-left transition ${provider === id ? 'border-[#236199] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Icon className="h-4 w-4 text-[#236199]" /><strong className="mt-2 block text-xs text-[#09172C]">{label}</strong><span className="text-[9px] text-gray-500">{detail}</span>
                  </button>
                ))}
              </div>
              {provider === 'stripe' && (
                <div className="flex gap-2 rounded-xl bg-gray-50 p-2" aria-label="Moeda do pagamento">
                  {(['EUR', 'USD'] as const).map((item) => <button key={item} type="button" onClick={() => setCurrency(item)} className={`flex-1 rounded-lg py-2 text-xs font-bold ${currency === item ? 'bg-[#09172C] text-white' : 'text-gray-600'}`}>{item}</button>)}
                </div>
              )}
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}
              <button type="button" disabled={isProcessing} onClick={handlePay} className="btn-primary w-full justify-center py-3.5 text-xs font-bold disabled:opacity-60">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" />A criar ordem segura…</> : <>{provider === 'stripe' ? <ExternalLink className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{isDemo ? 'Simular' : 'Continuar com'} {providerLabels[provider]}</>}
              </button>
              <p className="text-center text-[9px] text-gray-400">Nunca partilhe PIN, CVV ou código de confirmação com a PEPEK.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
