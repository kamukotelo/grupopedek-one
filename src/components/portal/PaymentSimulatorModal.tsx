import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, CreditCard, Landmark, Smartphone, Loader2, CheckCircle2, Clock3, ExternalLink, FileText, Copy, Check } from 'lucide-react';
import { InvoiceItem } from '../../types/auth';
import { createPaymentOrder, PROVIDER_LABELS as providerLabels, type PaymentProvider } from '../../lib/payments';
import { ReceiptModal } from './ReceiptModal';

interface PaymentSimulatorModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
  onSuccess: (invoiceId: string, gateway: string) => void;
}

export const PaymentSimulatorModal: React.FC<PaymentSimulatorModalProps> = ({ invoice, onClose, onSuccess }) => {
  const isDemo = import.meta.env.VITE_DEMO_MODE !== 'false';
  const [provider, setProvider] = useState<PaymentProvider>('bank_transfer');
  const [currency, setCurrency] = useState<'AOA' | 'USD' | 'EUR'>('AOA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [done, setDone] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const bankAccounts = [
    { name: 'BAI', account: '7100 6979 10001', iban: 'AO06 0040 0000 7100 69791011 9' },
    { name: 'Standard Bank', account: '1000 1107 29', iban: 'AO06 0060 0117 0100 0110 7297 3' },
    { name: 'Atlântico', account: '1887 8498 3100 01', iban: 'AO06 0055 0000 8878 4983 1010 6' },
    { name: 'BFA', account: '1413 8612 7300 01', iban: 'AO06 0006 0000 4138 6127 3010 7' },
  ];
  const [selectedBank, setSelectedBank] = useState('BAI');
  const activeBank = bankAccounts.find((bank) => bank.name === selectedBank) || bankAccounts[0];

  useEffect(() => {
    setError(''); setReference(''); setDone(false); setIsProcessing(false); setShowReceiptModal(false);
    setProvider('bank_transfer'); setCurrency('AOA'); setSelectedBank('BAI');
    setIdempotencyKey(crypto.randomUUID());
  }, [invoice?.id]);

  useEffect(() => {
    if (provider === 'multicaixa') setCurrency('AOA');
    else if (provider === 'mbway') setCurrency('EUR');
    else if (provider === 'stripe') setCurrency('EUR');
    else if (provider === 'bank_transfer') setCurrency('AOA');
  }, [provider]);

  if (!invoice) return null;

  const currentAmountDisplay = () => {
    if (currency === 'EUR') {
      const eur = invoice.amountEUR || (invoice.amountUSD ? Math.round(invoice.amountUSD * 0.92) : Math.round(invoice.amountAOA / 1100));
      return `${eur.toLocaleString('pt-PT')} € EUR`;
    }
    if (currency === 'USD') {
      const usd = invoice.amountUSD || Math.round(invoice.amountAOA / 1000);
      return `$${usd.toLocaleString('en-US')} USD`;
    }
    return `${invoice.amountAOA.toLocaleString('pt-AO')} AOA`;
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Falha silenciosa
    }
  };

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
    { id: 'bank_transfer', label: 'Transferência bancária', detail: 'Quatro bancos em Angola · AOA', Icon: Landmark },
    { id: 'stripe', label: 'Cartão internacional', detail: 'Visa / Mastercard · EUR ou USD (Stripe)', Icon: CreditCard },
    { id: 'multicaixa', label: 'Multicaixa Express', detail: 'AOA · Angola', Icon: Smartphone },
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
            <span className="text-xs text-white/65">Valor a liquidar ({currency})</span>
            <strong className="text-lg font-bold text-white">{currentAmountDisplay()}</strong>
          </div>
        </header>

        <div className="p-6">
          {done ? (
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-700"><Clock3 className="h-7 w-7" /></div>
              <h4 className="text-lg font-extrabold text-[#09172C]">{isDemo ? 'Simulação concluída' : 'Ordem de pagamento registada'}</h4>
              <p className="text-xs leading-relaxed text-gray-600">
                {isDemo
                  ? 'Nenhuma cobrança foi efetuada.'
                  : provider === 'bank_transfer'
                  ? 'Transfira exatamente o valor indicado em AOA, inclua a referência na descrição e aguarde a confirmação da equipa financeira após conferência do extrato bancário.'
                  : 'A fatura será liquidada automaticamente após confirmação assinada do provedor.'}
              </p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left text-xs space-y-1">
                <span className="block text-gray-500">Referência única da transação</span>
                <div className="flex items-center justify-between">
                  <strong className="font-mono text-sm text-[#09172C]">{reference}</strong>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(reference, 'ref')}
                    className="flex items-center gap-1 text-[11px] text-[#236199] hover:underline font-semibold"
                  >
                    {copiedKey === 'ref' ? <><Check className="h-3 w-3 text-green-600" /> Copiado</> : <><Copy className="h-3 w-3" /> Copiar</>}
                  </button>
                </div>
              </div>

              {provider === 'bank_transfer' && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5">
                    <strong className="text-[#09172C] font-bold">
                      Conta Bancária em Angola (AOA)
                    </strong>
                    <span className="text-[10px] font-bold uppercase text-[#236199]">{currency}</span>
                  </div>
                  <div className="text-[11px] space-y-1 text-gray-700">
                    <p><span className="text-gray-500">Banco:</span> <strong>{activeBank.name}</strong></p>
                    <p><span className="text-gray-500">Conta:</span> <strong>{activeBank.account}</strong></p>
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-blue-200">
                      <span className="font-mono text-[11px] text-gray-900 font-semibold">{activeBank.iban}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(activeBank.iban, 'iban_done')}
                        className="text-[#236199] hover:text-blue-900 ml-2"
                        title="Copiar IBAN"
                      >
                        {copiedKey === 'iban_done' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <p className="text-amber-800">A ordem fica pendente até a entrada do dinheiro ser confirmada no banco. Esta página não confirma a execução da transferência.</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {isDemo && (
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-3 text-xs font-bold text-[#09172C] hover:bg-gray-100 shadow-sm transition cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-[#236199]" />
                    <span>Ver Recibo Emitido</span>
                  </button>
                )}
                <button type="button" onClick={onClose} className="btn-primary flex-1 justify-center py-3 text-xs font-bold cursor-pointer">Fechar</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-[11px] leading-relaxed text-[#001E4A]">
                <ShieldCheck className="mr-2 inline h-4 w-4 text-[#236199]" />O valor é validado diretamente no servidor. A PEPEK não recolhe nem armazena o número do seu cartão ou PIN bancário.
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {methods.map(({ id, label, detail, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setProvider(id)}
                    className={`rounded-xl border-2 p-3 text-left transition cursor-pointer ${
                      provider === id ? 'border-[#236199] bg-blue-50/70 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-[#236199]" />
                    <strong className="mt-2 block text-xs text-[#09172C]">{label}</strong>
                    <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">{detail}</span>
                  </button>
                ))}
              </div>

              {/* O banco recebe apenas AOA; outras moedas dependem de provedores externos. */}
              {provider === 'stripe' && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Moeda de pagamento:</span>
                  <div className="flex gap-2 rounded-xl bg-gray-100 p-1.5" aria-label="Moeda do pagamento">
                    {(['EUR', 'USD'] as const).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCurrency(item)}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                            currency === item ? 'bg-[#09172C] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {item === 'EUR' ? 'EUR (€) - Europa' : 'USD ($) - Internacional'}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Informações da conta quando Transferência Bancária */}
              {provider === 'bank_transfer' && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#09172C]" htmlFor="payment-bank">Escolha o banco destinatário</label>
                  <select id="payment-bank" value={selectedBank} onChange={(event) => setSelectedBank(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs">
                    {bankAccounts.map((bank) => <option key={bank.name} value={bank.name}>{bank.name}</option>)}
                  </select>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#09172C] flex items-center gap-1">
                      <Landmark className="h-3.5 w-3.5 text-[#236199]" />
                      Dados da Conta em Angola
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">{currency}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 space-y-0.5">
                    <div>Banco: <strong className="text-gray-900">{activeBank.name}</strong></div>
                    <div>Conta: <strong className="text-gray-900">{activeBank.account}</strong></div>
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-gray-200 mt-1">
                      <span className="font-mono text-[11px] font-bold text-[#09172C]">{activeBank.iban}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(activeBank.iban, 'iban_prev')}
                        className="text-[#236199] hover:text-blue-900 ml-1 p-0.5"
                        title="Copiar IBAN"
                      >
                        {copiedKey === 'iban_prev' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] text-gray-500">Confirme os dados da conta no seu banco antes de autorizar. Valor e referência são fixados pela fatura.</div>
                  </div>
                </div>
              )}

              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="btn-primary w-full justify-center py-3.5 text-xs font-bold disabled:opacity-60 cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />A criar ordem segura…</>
                ) : (
                  <>
                    {provider === 'stripe' ? <ExternalLink className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {isDemo ? 'Simular' : provider === 'stripe' ? 'Ir para Checkout Seguro' : provider === 'bank_transfer' ? 'Gerar referência para' : 'Registar Pagamento com'} {providerLabels[provider]}
                  </>
                )}
              </button>
              <p className="text-center text-[9px] text-gray-500">A transferência só é dada como paga depois da conferência bancária pela equipa financeira.</p>
            </div>
          )}
        </div>
      </div>

      {showReceiptModal && (
        <ReceiptModal
          invoice={{
            ...invoice,
            status: 'paid',
            paymentGateway: providerLabels[provider],
            receiptNumber: `REC-2026-${reference.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'SIMULADO'}`,
            paidAt: `${invoice.date} (Hoje)`,
            clientReference: reference,
          }}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
