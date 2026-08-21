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
  Sparkles,
  ShieldAlert,
  BarChart3,
  Server,
  Activity,
  CalendarCheck,
  Database,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { PaymentSimulatorModal } from './PaymentSimulatorModal';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { ClientAreaModal } from '../ui/ClientAreaModal';
import { DEMO_OPERATIONAL_RECORDS, DEMO_ODOO_EVENTS } from '../../data/demoUsers';

export const ClientPortalModal: React.FC = () => {
  const {
    currentUser,
    isDemoMode,
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

  const [activeTab, setActiveTab] = useState<'fleet' | 'invoices' | 'operations' | 'odoo' | 'request'>('fleet');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isPortalOpen) return null;

  if (!isDemoMode && !currentUser) {
    return <ClientAreaModal isOpen={isPortalOpen} onClose={() => setIsPortalOpen(false)} />;
  }

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await refreshOdooSync();
    setIsSyncing(false);
  };

  // Role categorization: Client vs Staff/Admin
  const isAdminOrStaff = !!currentUser && !['cliente_vip', 'cliente_normal'].includes(currentUser.role);
  const isVipOrClient = currentUser?.role === 'cliente_vip' || currentUser?.role === 'cliente_normal';
  const isDemoSession = currentUser?.id.startsWith('demo_') ?? false;
  const canViewFinances = isVipOrClient || ['contabilista', 'gestor_portugal', 'direcao'].includes(currentUser?.role || '');
  const canViewOdoo = isAdminOrStaff;

  const demoRoles: Array<{ role: UserRole; label: string; icon: string; category: 'Cliente' | 'Administrativo' }> = [
    { role: 'cliente_vip', label: 'Cliente VIP Diplomático', icon: '👑', category: 'Cliente' },
    { role: 'cliente_normal', label: 'Cliente PME / Normal', icon: '👤', category: 'Cliente' },
    { role: 'vendedor', label: 'Vendedor CRM', icon: '💼', category: 'Administrativo' },
    { role: 'gestor_reservas', label: 'Gestor de Reservas', icon: '🎫', category: 'Administrativo' },
    { role: 'diretor_frotas', label: 'Director de Frotas', icon: '🚚', category: 'Administrativo' },
    { role: 'motorista', label: 'Motorista Protocolar', icon: '🧑🏾‍✈️', category: 'Administrativo' },
    { role: 'contabilista', label: 'Contabilista AGT', icon: '📊', category: 'Administrativo' },
    { role: 'gestor_portugal', label: 'Gestor Portugal', icon: '🇵🇹', category: 'Administrativo' },
    { role: 'direcao', label: 'Direcção Executiva', icon: '🏛️', category: 'Administrativo' }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
        <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-gray-200 animate-scaleUp flex flex-col max-h-[94vh]">
          {/* Barra de Troca de Personas Demo — APENAS em ambiente de desenvolvimento */}
          {isDemoMode && (
            <div className="bg-[#030D1F] text-white px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold">
                <Sliders className="w-3.5 h-3.5" />
                <span>🛠 Modo Demo (Desenvolvimento) — Trocar Perfil:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {demoRoles.map((d) => (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => { loginAs(d.role); setActiveTab('fleet'); }}
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
          )}

          {/* Main Header */}
          <div className="bg-gradient-to-r from-[#06142F] to-[#0A1E42] p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-extrabold text-[#0B45D8] shadow-inner">
                {currentUser?.role === 'cliente_vip' ? '👑' : currentUser?.role === 'direcao' ? '🏛️' : isAdminOrStaff ? '💼' : '👤'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-inter">
                    {currentUser ? `Bem-vindo ao espaço ${currentUser.roleLabel}` : 'Portal de Mobilidade PEPEK'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isAdminOrStaff ? 'bg-amber-600 text-white' : 'bg-[#0B45D8] text-white'
                  }`}>
                    {currentUser?.tier || 'Acreditado'}
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  {currentUser?.company} · Experiência personalizada {currentUser?.nif ? `· NIF: ${currentUser.nif}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Internal ERP Status: Only visible if Admin / Staff */}
              {isAdminOrStaff && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-bold">
                  <Server className="w-3.5 h-3.5" />
                  <span>Painel Administrativo Interno</span>
                </div>
              )}

              {canViewFinances && <button
                onClick={() => setIsPortalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Fechar portal"
              >
                <X className="w-5 h-5" />
              </button>}
            </div>
          </div>

          {/* Role-Sensitive Navigation Tabs */}
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
                <span>{isAdminOrStaff ? 'Gestão da Frota Global' : 'Minhas Viaturas Alocadas'}</span>
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
                <span>{isAdminOrStaff ? 'Faturamento & Finanças AGT' : 'Minhas Faturas & Recibos'}</span>
                {invoices.some(i => i.status === 'pending') && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>

              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => setActiveTab('operations')}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'operations'
                      ? 'border-[#0B45D8] text-[#0B45D8]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Centro de Operações</span>
                </button>
              )}

              {/* Odoo ERP & Admin Controls: ONLY for Admins / Staff */}
              {canViewOdoo && (
                <button
                  type="button"
                  onClick={() => setActiveTab('odoo')}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'odoo'
                      ? 'border-[#0B45D8] text-[#0B45D8]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 text-amber-600" />
                  <span>ERP Odoo (Admin)</span>
                </button>
              )}

              {/* Client Quick Request: For Clients */}
              {isVipOrClient && (
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
                  <span>Requisição Prioritária</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer py-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Sessão</span>
            </button>
          </div>

          {/* Modal Tab Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-gray-50 text-xs">
            {/* Tab 1: Fleet View */}
            {activeTab === 'fleet' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#06142F]">
                      {isAdminOrStaff
                        ? 'Controlo Operacional de Toda a Frota PEPEK'
                        : `Viaturas Activas em Nome de ${currentUser?.company || currentUser?.name}`}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {isAdminOrStaff
                        ? 'Telemetria GPS, motoristas e estado de manutenção da operação nacional.'
                        : 'Viaturas de protocolo e rent-a-car alocadas ao seu contrato.'}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0B45D8] font-bold text-xs">
                    {fleetTelemetry.filter(f => f.status === 'em_circulacao').length} em circulação
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(isVipOrClient ? fleetTelemetry.slice(0, 2) : fleetTelemetry).map((flt) => (
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
                          flt.status === 'em_reserva' ? 'bg-violet-100 text-violet-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {flt.status === 'em_circulacao' ? 'Em Circulação' :
                           flt.status === 'disponivel_talatona' ? 'Em Talatona' :
                           flt.status === 'em_reserva' ? 'Em Preparação' : 'Em Manutenção'}
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
            {activeTab === 'invoices' && canViewFinances && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#06142F]">
                      Extrato de Faturas Certificadas AGT
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Liquidável via Multicaixa Express, Stripe Internacional, BAI Direto ou MB WAY.
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex" aria-label="Moedas disponíveis">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#07133F] text-[11px] font-black text-[#D2A820]">Kz</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700">$</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-700">€</span>
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
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'paid' ? 'Liquidada' : inv.status === 'overdue' ? 'Vencida' : 'Pendente de Pagamento'}
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
                            <div className="flex items-center justify-end gap-1.5 text-sm font-black text-[#06142F]">
                              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#07133F] px-1 text-[8px] text-[#D2A820]">Kz</span>
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

            {activeTab === 'operations' && isAdminOrStaff && (
              <div className="space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B68D13]">Excelência operacional PEPEK</span>
                    <h4 className="mt-1 text-lg font-extrabold text-[#06142F]">Centro Nacional de Mobilidade & Despacho</h4>
                    <p className="text-xs text-gray-500">Reserva, protocolo, motorista, manutenção e contrato numa única linha de controlo.</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-800">Operação 24/7 · Demo</span>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                  {[
                    ['Reservas activas', '34', CalendarCheck, 'text-blue-700 bg-blue-50'],
                    ['Em execução', '6', Activity, 'text-emerald-700 bg-emerald-50'],
                    ['Motoristas escalados', '28', User, 'text-violet-700 bg-violet-50'],
                    ['Manutenções abertas', '3', Wrench, 'text-amber-700 bg-amber-50'],
                    ['SLA no prazo', '96,8%', ShieldCheck, 'text-[#07133F] bg-[#FFF7D6]'],
                  ].map(([label, value, Icon, tone]) => (
                    <div key={label as string} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></div>
                      <strong className="block text-xl font-black text-[#07133F]">{value as string}</strong>
                      <span className="text-[10px] font-bold text-gray-500">{label as string}</span>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <strong className="text-xs text-[#07133F]">Agenda operacional integrada</strong>
                    <span className="text-[10px] text-gray-400">Referências sincronizáveis com Odoo</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {DEMO_OPERATIONAL_RECORDS.map((record) => (
                      <div key={record.id} className="grid gap-3 px-4 py-3 hover:bg-gray-50 sm:grid-cols-[150px_1fr_150px_130px] sm:items-center">
                        <div><span className="font-mono text-[10px] font-black text-[#0B45D8]">{record.reference}</span><span className="block text-[9px] uppercase text-gray-400">{record.type}</span></div>
                        <div><strong className="block text-xs text-[#07133F]">{record.title}</strong><span className="text-[10px] text-gray-500">{record.owner} · {record.location}</span></div>
                        <div><Clock className="mr-1 inline h-3 w-3 text-gray-400" /><span className="text-[10px] text-gray-600">{record.scheduledAt}</span></div>
                        <div className="text-right"><span className={`rounded-full px-2 py-1 text-[9px] font-black ${record.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : record.status === 'atencao' ? 'bg-red-100 text-red-700' : record.status === 'em_execucao' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'}`}>{record.status.replace('_', ' ')}</span><span className="mt-1 block font-mono text-[8px] text-gray-400">{record.odooId}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Odoo ERP Integration (Admin / Staff Exclusive) */}
            {activeTab === 'odoo' && canViewOdoo && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#06142F]">
                      Ponte Operacional Odoo Enterprise
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Viaturas no Odoo Fleet:</span>
                    <strong className="text-xl font-bold text-[#06142F]">
                      {odooSync.totalVehiclesSynced > 0 ? `${odooSync.totalVehiclesSynced} Veículos` : 'A carregar...'}
                    </strong>
                    <span className="text-[10px] text-emerald-600 block">Módulo fleet.vehicle</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Faturas em Aberto:</span>
                    <strong className="text-xl font-bold text-[#06142F]">
                      {odooSync.openInvoicesCount > 0 ? `${odooSync.openInvoicesCount} Documentos` : 'Sincronizado'}
                    </strong>
                    <span className="text-[10px] text-blue-600 block">Módulo account.move</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Cotações Pendentes:</span>
                    <strong className="text-xl font-bold text-[#06142F]">
                      {odooSync.pendingQuotesCount > 0 ? `${odooSync.pendingQuotesCount} Cotações` : 'Sem pendentes'}
                    </strong>
                    <span className="text-[10px] text-amber-600 block">Módulo sale.order</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Clientes & Entidades:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.partnersSynced ?? 0}</strong>
                    <span className="text-[10px] text-violet-600 block">Módulo res.partner</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Reservas Sincronizadas:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.reservationsSynced ?? 0}</strong>
                    <span className="text-[10px] text-emerald-600 block">sale.order / calendar.event</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Motoristas:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.driversSynced ?? 0}</strong>
                    <span className="text-[10px] text-cyan-600 block">Módulo hr.employee</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Ordens de Manutenção:</span>
                    <strong className="text-xl font-bold text-[#06142F]">{odooSync.maintenanceOrdersOpen ?? 0}</strong>
                    <span className="text-[10px] text-red-600 block">fleet.vehicle.log.services</span>
                  </div>
                </div>

                {isDemoSession && (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <span className="flex items-center gap-2 text-xs font-black text-[#07133F]"><Database className="h-4 w-4 text-[#0B45D8]" />Fila de integração demonstrativa</span>
                      <span className="text-[10px] font-bold text-emerald-600">Latência {odooSync.latencyMs ?? 0} ms</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {DEMO_ODOO_EVENTS.map((event) => (
                        <div key={event.id} className="grid grid-cols-[95px_1fr_90px] items-center gap-3 px-4 py-2.5 text-[10px] sm:grid-cols-[150px_130px_1fr_90px]">
                          <span className="font-mono font-bold text-[#0B45D8]">{event.model}</span>
                          <span className="hidden text-gray-500 sm:block">{event.direction}</span>
                          <span className="truncate text-gray-700">{event.reference}</span>
                          <span className={`text-right font-bold ${event.status === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>{event.timestamp} · {event.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detalhes técnicos: apenas em modo demo para a equipa */}
                {(isDemoMode || isDemoSession) && (
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Última Sincronização:</span>
                      <strong className="text-gray-900">{odooSync.lastSync}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Instância (Demo):</span>
                      <strong className="text-gray-900 font-mono">{odooSync.odooDb}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Protocolo API:</span>
                      <strong className="text-[#0B45D8] font-mono">XML-RPC / REST JSON v2</strong>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px]">
                      ⚠ Estes dados técnicos só são visíveis em modo de desenvolvimento (staging).
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Quick Request (Client Only) */}
            {activeTab === 'request' && isVipOrClient && (
              <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 max-w-lg mx-auto">
                <h4 className="text-base font-bold text-[#06142F] text-center">
                  Solicitação Prioritária à Direcção
                </h4>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Como cliente acreditado ({currentUser?.name}), o seu pedido tem prioridade máxima na central de despacho em Talatona.
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
