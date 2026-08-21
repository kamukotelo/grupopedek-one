import React, { useState } from 'react';
import {
  X,
  User,
  Building2,
  Car,
  CreditCard,
  FileText,
  Radio,
  RefreshCw,
  ShieldCheck,
  Phone,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  LogOut,
  Sliders,
  DollarSign,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { PaymentSimulatorModal } from './PaymentSimulatorModal';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const ClientPortalModal: React.FC = () => {
  const {
    currentUser,
    loginAs,
    logout,
    isPortalOpen,
    setIsPortalOpen,
    invoices,
    fleetTelemetry,
    odooSync,
    refreshOdooSync,
    selectedPaymentInvoice,
    setSelectedPaymentInvoice,
    payInvoice
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'fleet' | 'invoices' | 'odoo' | 'request'>('fleet');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isPortalOpen) return null;

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await refreshOdooSync();
    setIsSyncing(false);
  };

  const demoRoles: Array<{ role: UserRole; label: string; icon: string }> = [
    { role: 'cliente_vip', label: 'Cliente VIP (Embaixada)', icon: '👑' },
    { role: 'cliente_normal', label: 'Cliente PME / Normal', icon: '👤' },
    { role: 'vendedor', label: 'Vendedor CRM', icon: '💼' },
    { role: 'diretor_frotas', label: 'Director de Frotas', icon: '🚚' },
    { role: 'contabilista', label: 'Contabilista AGT', icon: '📊' },
    { role: 'direcao', label: 'Direcção Executiva', icon: '🏛️' }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-gray-200 animate-scaleUp flex flex-col max-h-[92vh]">
          {/* Top Demo Persona Switcher Bar */}
          <div className="bg-[#030D1F] text-white px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold">
              <Sliders className="w-3.5 h-3.5 text-[#0B45D8]" />
              <span>Trocar Persona Demo (1-Clique):</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {demoRoles.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => loginAs(d.role)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                    currentUser?.role === d.role
                      ? 'bg-[#0B45D8] text-white shadow-xs'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span>{d.icon}</span>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Header */}
          <div className="bg-gradient-to-r from-[#06142F] to-[#0A1E42] p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-extrabold text-[#0B45D8] shadow-inner">
                {currentUser?.role === 'cliente_vip' ? '👑' : currentUser?.role === 'direcao' ? '🏛️' : '👤'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-inter">
                    {currentUser?.name || 'Portal de Mobilidade PEPEK'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0B45D8] text-white">
                    {currentUser?.tier || 'Acreditado'}
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  {currentUser?.company} · {currentUser?.roleLabel} {currentUser?.nif ? `· NIF: ${currentUser.nif}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Odoo Status Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Odoo ERP v17 Conectado</span>
              </div>

              <button
                onClick={() => setIsPortalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Fechar portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-100 px-5 border-b border-gray-200 flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('fleet')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'fleet'
                    ? 'border-[#0B45D8] text-[#0B45D8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Minhas Viaturas & Telemetria</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('invoices')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'border-[#0B45D8] text-[#0B45D8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Faturas AGT & Pagamentos</span>
                {invoices.some(i => i.status === 'pending') && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('odoo')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'odoo'
                    ? 'border-[#0B45D8] text-[#0B45D8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Integração Odoo ERP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('request')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'request'
                    ? 'border-[#0B45D8] text-[#0B45D8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#0B45D8]" />
                <span>Nova Requisição 1-Clique</span>
              </button>
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer py-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>

          {/* Modal Tab Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-gray-50 text-xs">
            {/* Tab 1: Fleet & Telemetry */}
            {activeTab === 'fleet' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#06142F]">
                      Viaturas Alocadas & Monitorização em Tempo Real
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Acompanhamento telemétrico GPS, consumo e motoristas credenciados.
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0B45D8] font-bold text-xs">
                    {fleetTelemetry.filter(f => f.status === 'em_circulacao').length} em circulação
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fleetTelemetry.map((flt) => (
                    <div
                      key={flt.id}
                      className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 hover:border-[#0B45D8]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800 border">
                            {flt.plateNumber}
                          </span>
                          <h5 className="text-sm font-bold text-[#06142F] mt-1">{flt.vehicleName}</h5>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          flt.status === 'em_circulacao' ? 'bg-emerald-100 text-emerald-800' :
                          flt.status === 'disponivel_talatona' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {flt.status === 'em_circulacao' ? 'Em Circulação' :
                           flt.status === 'disponivel_talatona' ? 'Em Talatona' : 'Em Manutenção'}
                        </span>
                      </div>

                      <div className="text-gray-600 space-y-1 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0B45D8]" />
                          <span>{flt.location}</span>
                        </div>
                        {flt.driverName && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>Motorista: <strong className="text-gray-900">{flt.driverName}</strong> ({flt.driverPhone})</span>
                          </div>
                        )}
                      </div>

                      {/* Fuel & Km */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span>Combustível:</span>
                          <div className="w-20 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${flt.fuelLevel}%` }} />
                          </div>
                          <span className="font-bold text-gray-800">{flt.fuelLevel}%</span>
                        </div>

                        <span className="text-gray-500 font-mono">{flt.mileageKm.toLocaleString()} km</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Invoices & Payments */}
            {activeTab === 'invoices' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#06142F]">
                      Extrato de Faturas AGT & Pagamentos Eletrónicos
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Liquidável via Multicaixa Express, Stripe Internacional, BAI Direto ou MB WAY.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-900">{inv.invoiceNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'paid' ? 'Liquidada' : 'Pendente de Pagamento'}
                            </span>
                            {inv.odooInvoiceId && (
                              <span className="text-[10px] text-gray-400 font-mono">Odoo: {inv.odooInvoiceId}</span>
                            )}
                          </div>
                          <p className="text-gray-600">{inv.description}</p>
                          <div className="text-gray-400 text-[11px]">Emissão: {inv.date} · Vencimento: {inv.dueDate}</div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div className="text-right">
                            <div className="text-sm font-black text-[#06142F]">
                              {inv.amountAOA.toLocaleString('pt-AO')} AOA
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              ≈ ${inv.amountUSD.toLocaleString()} USD
                            </div>
                          </div>

                          {inv.status === 'pending' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentInvoice(inv)}
                              className="btn-primary py-2 px-4 text-xs font-bold cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pagar Agora</span>
                            </button>
                          ) : (
                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{inv.paymentGateway}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Odoo ERP Integration */}
            {activeTab === 'odoo' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#06142F]">
                      Conector Odoo v17 Enterprise (Produção)
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Sincronização bidirecional de reservas, clientes (res.partner), frotas e contabilidade.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncClick}
                    disabled={isSyncing}
                    className="btn-outline text-[#06142F] border-gray-300 hover:bg-gray-200 py-2 px-4 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0B45D8]' : ''}`} />
                    <span>{isSyncing ? 'A Sincronizar...' : 'Forçar Sincronização'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Viaturas no Odoo Fleet:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.totalVehiclesSynced} Veículos</strong>
                    <span className="text-[10px] text-emerald-600 block">100% Sincronizado</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Faturas em Aberto:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.openInvoicesCount} Documentos</strong>
                    <span className="text-[10px] text-blue-600 block">Módulo account.move</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Cotações Pendentes:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.pendingQuotesCount} Cotações</strong>
                    <span className="text-[10px] text-amber-600 block">Módulo sale.order</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 text-[11px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Última Sincronização:</span>
                    <strong className="text-gray-900">{odooSync.lastSync}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Base de Dados:</span>
                    <strong className="text-gray-900 font-mono">{odooSync.odooDb}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Protocolo API:</span>
                    <strong className="text-[#0B45D8] font-mono">XML-RPC / REST JSON v2</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Quick 1-Click Request */}
            {activeTab === 'request' && (
              <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 max-w-lg mx-auto">
                <h4 className="text-base font-bold text-[#06142F] text-center">
                  Solicitação Rápida para a Direcção
                </h4>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Como cliente acreditado ({currentUser?.name}), o seu pedido tem prioridade imediata na central de despacho.
                </p>

                <div className="space-y-2 pt-2">
                  <a
                    href={generateQuickWhatsAppUrl(`Requisição Prioritária VIP: ${currentUser?.name} (${currentUser?.company})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center text-xs py-3 font-bold"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Pedir Viatura Adicional em 1-Clique</span>
                  </a>

                  <a
                    href={generateQuickWhatsAppUrl(`Viatura de Substituição Urgente: ${currentUser?.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 font-bold text-xs text-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Solicitar Viatura de Substituição</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Simulator Gateway Modal */}
      <PaymentSimulatorModal
        invoice={selectedPaymentInvoice}
        onClose={() => setSelectedPaymentInvoice(null)}
        onSuccess={(id, gw) => {
          payInvoice(id, gw);
        }}
      />
    </>
  );
};
