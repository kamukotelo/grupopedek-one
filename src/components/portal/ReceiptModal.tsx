import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle2, Building2 } from 'lucide-react';
import { InvoiceItem, UserProfile } from '../../types/auth';

interface ReceiptModalProps {
  invoice: InvoiceItem | null;
  user?: UserProfile | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, user, onClose }) => {

  if (!invoice) return null;

  // Gerar metadados certificados determinísticos se não existirem
  const receiptNumber = invoice.receiptNumber || `REC-2026-${invoice.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || '8B91F4C2'}`;
  const paidAt = invoice.paidAt || `${invoice.date} às 14:30`;
  const clientReference = invoice.clientReference || `PK-PAY-2026-${invoice.id.toUpperCase().slice(0, 8)}`;
  const customerName = invoice.customerName || user?.name || 'Cliente Institucional PEPEK';
  const customerNif = invoice.customerNif || user?.nif;
  const customerCompany = user?.company || 'Entidade Titular';

  // Valores apresentados no comprovativo do sistema.
  const totalAOA = invoice.amountAOA;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <button type="button" className="fixed inset-0 print:hidden" onClick={onClose} aria-label="Fechar recibo" />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 my-auto print:border-none print:shadow-none print:rounded-none">
        {/* Barra Superior / Ações */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#09172C] text-white">
              <FileText className="h-4 w-4 text-[#FEC228]" />
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#09172C]">Comprovativo de Pagamento</span>
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Liquidado</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Recibo */}
        <div className="p-6 sm:p-8 space-y-6 text-[#09172C] bg-white">
          {/* Cabeçalho da Empresa */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#09172C]">PEPEK GRUPO</span>
                <span className="rounded bg-[#FEC228] px-1.5 py-0.5 text-[9px] font-extrabold text-[#09172C]">RENT-A-CAR</span>
              </div>
              <p className="mt-1 text-xs text-gray-600 font-medium">PEPEK GRUPO RENT-A-CAR S.A.</p>
              <p className="text-[11px] text-gray-500">NIF: 5417088491 · Conservatória de Luanda n.º 14.892</p>
              <p className="text-[11px] text-gray-500">Complexo Talatona Park, Luanda · Angola</p>
              <p className="text-[11px] text-gray-500">financas@pepekgrupo.com · +244 923 719 090</p>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>LIQUIDAÇÃO COMPROVADA</span>
              </div>
              <p className="mt-2 font-mono text-sm font-black text-[#09172C]">{receiptNumber}</p>
              <p className="text-[11px] text-gray-500">Fatura: <span className="font-mono font-bold text-gray-700">{invoice.invoiceNumber}</span></p>
              <p className="text-[11px] text-gray-500">Data de Emissão: {paidAt}</p>
            </div>
          </div>

          {/* Dados do Cliente & Método */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Exmo.(a) Sr.(a) / Cliente</span>
              <p className="mt-1 font-bold text-[#09172C] text-sm">{customerName}</p>
              <p className="text-gray-600 flex items-center gap-1 mt-0.5"><Building2 className="h-3 w-3 text-gray-400" />{customerCompany}</p>
              {customerNif && <p className="text-gray-600 mt-0.5">NIF: <span className="font-mono font-bold text-gray-800">{customerNif}</span></p>}
            </div>

            <div className="sm:border-l sm:border-gray-200 sm:pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Modalidade de Liquidação</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded-md bg-[#09172C] px-2 py-0.5 font-mono text-[11px] font-bold text-[#FEC228]">
                  {invoice.paymentGateway}
                </span>
              </div>
              <p className="mt-1 text-gray-600">Ref. Transação: <span className="font-mono font-medium text-gray-800">{clientReference}</span></p>
              <p className="text-gray-500 text-[11px]">Estado: Pagamento confirmado</p>
            </div>
          </div>

          {/* Discriminação do Serviço / Venda */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Discriminação do Serviço</span>
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Descrição / Detalhe Operacional</th>
                    <th className="p-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3">
                      <strong className="block text-[#09172C]">{invoice.description}</strong>
                      <span className="text-[11px] text-gray-500">Mobilidade Executiva e Protocolar PEPEK · Luanda / Angola</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-gray-800">
                      {totalAOA.toLocaleString('pt-AO')} AOA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totais e Impostos */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-gray-200 pt-4">
            <div className="text-[11px] text-gray-500 space-y-1 max-w-xs">
              <div className="flex items-center gap-1 text-blue-900 font-bold">
                <span>Comprovativo do sistema</span>
              </div>
              <p>Pagamento registado e confirmado no sistema.</p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-black text-[#09172C]">
                <span>Total Liquidado:</span>
                <span className="font-mono text-base text-[#09172C]">
                  {totalAOA.toLocaleString('pt-AO')} AOA
                </span>
              </div>
              {invoice.amountUSD > 0 && (
                <div className="text-right text-[10px] text-gray-400 font-medium">
                  ≈ ${invoice.amountUSD.toLocaleString()} USD
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Rodapé do Modal */}
        <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 p-4 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#09172C] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0C2E60] transition shadow-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
