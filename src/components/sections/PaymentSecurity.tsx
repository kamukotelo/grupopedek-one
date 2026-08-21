import React from 'react';
import { ShieldCheck, CreditCard, Landmark, CheckCircle2, Lock } from 'lucide-react';

export const PaymentSecurity: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="container-pepek">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left info */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B45D8] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparência & Conformidade Fiscal</span>
            </div>
            <h3 className="text-xl font-bold text-[#06142F]">
              Métodos de Pagamento Oficiais Aceites
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Facturação electrónica certificada em conformidade com as regras da Administração Geral Tributária (AGT).
            </p>
          </div>

          {/* Right badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#0B45D8] shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 block">Multicaixa & Express</span>
                <span className="text-[10px] text-gray-500">Rede EMIS Angola</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <Landmark className="w-5 h-5 text-[#0B45D8] shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 block">Banca Nacional</span>
                <span className="text-[10px] text-gray-500">BFA · BAI · Atlântico</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#0B45D8] shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 block">Cartões Globais</span>
                <span className="text-[10px] text-gray-500">Visa · Mastercard</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 block">SWIFT Internacional</span>
                <span className="text-[10px] text-gray-500">USD & EUR Facturados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
