import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, CreditCard, Landmark, Smartphone, ArrowRight, Loader2, FileText, QrCode } from 'lucide-react';
import { InvoiceItem } from '../../types/auth';

interface PaymentSimulatorModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
  onSuccess: (invoiceId: string, gateway: string) => void;
}

export const PaymentSimulatorModal: React.FC<PaymentSimulatorModalProps> = ({
  invoice,
  onClose,
  onSuccess
}) => {
  // This remains deliberately explicit until an audited payment callback is connected.
  const isSimulation = true;
  const [gateway, setGateway] = useState<'multicaixa' | 'bai' | 'stripe' | 'mbway'>('multicaixa');
  const [phoneNumber, setPhoneNumber] = useState('923 881 100');
  const [ptPhone, setPtPhone] = useState('912 345 678');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [completedGateway, setCompletedGateway] = useState('');
  const [receiptCode, setReceiptCode] = useState('');

  useEffect(() => {
    setIsProcessing(false);
    setIsDone(false);
    setCompletedGateway('');
    setReceiptCode('');
  }, [invoice?.id]);

  if (!invoice) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      const gatewayName = 
        gateway === 'multicaixa' ? 'Multicaixa Express' :
        gateway === 'bai' ? 'BAI Direto' :
        gateway === 'stripe' ? 'Stripe (Visa/Mastercard)' : 'MB WAY (Portugal)';
      setCompletedGateway(gatewayName);
      setReceiptCode(`REC-DEMO-${new Date().getFullYear()}-${invoice.id.toUpperCase()}`);
      onSuccess(invoice.id, gatewayName);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#09172C] to-[#0C2E60] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#236199] block mb-1">
            {isSimulation ? 'Simulador de Pagamento — Ambiente de Demonstração' : 'Gateway PEPEK / Odoo Finance'}
          </span>
          <h3 className="text-xl font-extrabold text-white">
            Liquidação de Fatura AGT
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Fatura Ref: <strong className="text-white">{invoice.invoiceNumber}</strong> · {invoice.description}
          </p>

          <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-300">Valor a Liquidar:</span>
              <div className="mt-2 flex gap-1.5" aria-label="Moedas da fatura"><span className="grid h-7 min-w-7 place-items-center rounded-full bg-[#FEC228] px-1 text-[9px] font-extrabold text-[#09172C]">Kz</span><span className="grid h-7 w-7 place-items-center rounded-full bg-[#236199]/20 text-xs font-extrabold text-[#236199]">$</span><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500/20 text-xs font-extrabold text-blue-200">€</span></div>
            </div>
            <div className="text-right">
              <div className="text-lg font-extrabold text-white">{invoice.amountAOA.toLocaleString('pt-AO')} AOA</div>
              <div className="text-[11px] text-[#8899BB] font-bold">≈ ${invoice.amountUSD.toLocaleString()} USD / €{(invoice.amountUSD * 0.92).toFixed(0)} EUR</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          {isSimulation && (
            <div className="mb-5 rounded-xl border border-[#E4AD28] bg-[#FEC228] p-3 text-xs font-semibold text-[#E4AD28]">
              Nenhuma cobrança bancária será realizada. Este módulo preserva os dados fictícios para demonstração até a ativação dos gateways oficiais.
            </div>
          )}
          {!isDone ? (
            <form onSubmit={handlePay} className="space-y-5">
              {/* Payment Methods Selection */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2.5">
                  Selecione a Modalidade de Pagamento
                </label>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* Multicaixa Express (Angola) */}
                  <div
                    onClick={() => setGateway('multicaixa')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      gateway === 'multicaixa'
                        ? 'border-[#236199] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#09172C] mb-1">
                      <Smartphone className="w-4 h-4 text-[#236199]" />
                      <span>Multicaixa Express</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Angola (EMIS / Telemóvel)</p>
                  </div>

                  {/* Stripe (Internacional) */}
                  <div
                    onClick={() => setGateway('stripe')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      gateway === 'stripe'
                        ? 'border-[#236199] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#09172C] mb-1">
                      <CreditCard className="w-4 h-4 text-[#236199]" />
                      <span>Stripe / Apple Pay</span>
                    </div>
                    <p className="text-[10px] text-gray-500">USD / EUR / Visa / Master</p>
                  </div>

                  {/* BAI Direto / BFA Net */}
                  <div
                    onClick={() => setGateway('bai')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      gateway === 'bai'
                        ? 'border-[#236199] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#09172C] mb-1">
                      <Landmark className="w-4 h-4 text-[#236199]" />
                      <span>BAI Direto / BFA</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Internet Banking Imediato</p>
                  </div>

                  {/* MB WAY (Portugal) */}
                  <div
                    onClick={() => setGateway('mbway')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      gateway === 'mbway'
                        ? 'border-[#236199] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#09172C] mb-1">
                      <Smartphone className="w-4 h-4 text-[#236199]" />
                      <span>MB WAY / Portugal</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Ref. Multibanco / SEPA</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Gateway Inputs */}
              {gateway === 'multicaixa' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <label className="block font-bold text-gray-700">
                    Número de Telemóvel Associado ao Multicaixa Express
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9XX XXX XXX"
                      className="form-input pl-9 text-xs"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Ao confirmar, receberá de imediato uma notificação na sua app Multicaixa Express para validar com o seu PIN.
                  </p>
                </div>
              )}

              {gateway === 'stripe' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <label className="block font-bold text-gray-700">
                    Cartão de Crédito / Débito Internacional ou Apple Pay
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="form-input pl-9 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#236199] font-semibold pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Processamento Stripe Segurado 256-bit com Recibo Fiscal</span>
                  </div>
                </div>
              )}

              {gateway === 'bai' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <label className="block font-bold text-gray-700">
                    Débito Directo via BAI Direto / BFA Net
                  </label>
                  <input
                    type="text"
                    defaultValue="AO06.0040.0000.8812.9901.1018.9"
                    className="form-input text-xs font-mono bg-gray-100"
                    readOnly
                  />
                  <p className="text-[10px] text-gray-500">
                    {isSimulation ? 'Demonstração visual sem ligação bancária ou emissão fiscal.' : 'Reconciliação automática imediata via API bancária com emissão de recibo no Odoo.'}
                  </p>
                </div>
              )}

              {gateway === 'mbway' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <label className="block font-bold text-gray-700">
                    Número de Telemóvel MB WAY (Portugal +351)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={ptPhone}
                      onChange={(e) => setPtPhone(e.target.value)}
                      placeholder="91X XXX XXX"
                      className="form-input pl-9 text-xs"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Receberá o pedido de autorização na app MB WAY em euros (€{(invoice.amountUSD * 0.92).toFixed(0)} EUR).
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full justify-center text-xs font-bold py-3.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A Processar com a Gateway...</span>
                  </span>
                ) : (
                  <span>{isSimulation ? 'Simular' : 'Autorizar'} Pagamento de {invoice.amountAOA.toLocaleString('pt-AO')} AOA</span>
                )}
              </button>
            </form>
          ) : (
            /* Success Receipt */
            <div className="text-center py-5 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#236199] text-[#236199] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-[#09172C]">
                {isSimulation ? 'Simulação Concluída' : 'Pagamento Liquidado com Sucesso!'}
              </h4>

              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                {isSimulation
                  ? <>A fatura <strong className="text-gray-900">{invoice.invoiceNumber}</strong> não foi cobrada. O resultado existe apenas nesta sessão demonstrativa.</>
                  : <>A fatura <strong className="text-gray-900">{invoice.invoiceNumber}</strong> foi reconciliada e sincronizada no ERP Odoo.</>}
              </p>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-700 text-left space-y-1">
                <div>Estado: <strong className="text-[#236199]">Fatura fechada / liquidada na demonstração</strong></div>
                <div>Código demonstrativo: <strong className="text-gray-900 font-mono">{receiptCode}</strong></div>
                <div>Canal: <strong className="text-[#236199]">{completedGateway}</strong></div>
                <div>Data/Hora: <strong className="text-gray-900">{new Date().toLocaleString('pt-AO')}</strong></div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-primary w-full justify-center text-xs font-bold py-3 cursor-pointer"
              >
                Fechar & Voltar ao Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
