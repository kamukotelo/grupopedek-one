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
  Wrench,
  LayoutDashboard,
  Mail,
  BadgeCheck,
  Newspaper,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { canManageBlog } from '../../lib/blog';
import { useAuth } from '../../context/AuthContext';
import { UserRole, InvoiceItem } from '../../types/auth';
import { PaymentSimulatorModal } from './PaymentSimulatorModal';
import { BankTransferBackoffice } from './BankTransferBackoffice';
import { ReceiptModal } from './ReceiptModal';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { ClientAreaModal } from '../ui/ClientAreaModal';
import { DEMO_OPERATIONAL_RECORDS, DEMO_ODOO_EVENTS } from '../../data/demoUsers';
import { getPortalPermissions } from '../../lib/portalPermissions';
import { useTranslation } from 'react-i18next';

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
    payInvoice,
    refreshInvoices
  } = useAuth();
  const { t } = useTranslation();
  const roleLabel = currentUser ? t(`portal.roles.${currentUser.role}`, { defaultValue: currentUser.roleLabel }) : '';
  const tierLabel = currentUser?.tier ? t(`portal.tiers.${currentUser.tier}`, { defaultValue: currentUser.tier }) : t('portal.accredited');

  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'invoices' | 'operations' | 'odoo' | 'request'>('overview');
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<InvoiceItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isPortalOpen) return null;

  if (!currentUser) {
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
  const permissions = getPortalPermissions(currentUser?.role);
  const canViewFinances = permissions.finances;
  const canViewOdoo = permissions.odoo;
  const pendingInvoices = invoices.filter((invoice) => invoice.status === 'pending' || invoice.status === 'overdue');
  const activeVehicles = fleetTelemetry.filter((vehicle) => ['em_circulacao', 'em_reserva'].includes(vehicle.status));

  const demoRoles: Array<{ role: UserRole; icon: string }> = [
    { role: 'cliente_vip', icon: '👑' },
    { role: 'cliente_normal', icon: '👤' },
    { role: 'vendedor', icon: '💼' },
    { role: 'gestor_reservas', icon: '🎫' },
    { role: 'diretor_frotas', icon: '🚚' },
    { role: 'motorista', icon: '🧑🏾‍✈️' },
    { role: 'contabilista', icon: '📊' },
    { role: 'gestor_portugal', icon: '🇵🇹' },
    { role: 'direcao', icon: '🏛️' }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
        <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto border border-gray-200 animate-scaleUp flex flex-col max-h-[94vh]">
          {/* Barra de Troca de Personas Demo — APENAS em ambiente de desenvolvimento */}
          {isDemoMode && (
            <div className="bg-[#09172C] text-white px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-[#E4AD28] font-bold">
                <Sliders className="w-3.5 h-3.5" />
                <span>🛠 {t('portal.demoSwitch')}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {demoRoles.map((d) => (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => { loginAs(d.role); setActiveTab('overview'); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      currentUser?.role === d.role
                        ? 'bg-[#236199] text-white shadow-xs'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span>{d.icon}</span>
                    <span>{t(`portal.roles.${d.role}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Header */}
          <div className="bg-gradient-to-r from-[#09172C] to-[#0C2E60] p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-extrabold text-[#236199] shadow-inner">
                {currentUser?.role === 'cliente_vip' ? '👑' : currentUser?.role === 'direcao' ? '🏛️' : isAdminOrStaff ? '💼' : '👤'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-inter">
                    {currentUser ? t('portal.welcome', { role: roleLabel }) : t('portal.portalTitle')}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isAdminOrStaff ? 'bg-[#FEC228] text-white' : 'bg-[#236199] text-white'
                  }`}>
                    {tierLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  {currentUser?.company} · {t('portal.personalised')} {currentUser?.nif ? `· NIF: ${currentUser.nif}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Internal ERP Status: Only visible if Admin / Staff */}
              {isAdminOrStaff && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FEC228]/20 border border-[#E4AD28]/30 text-xs text-[#E4AD28] font-bold">
                  <Server className="w-3.5 h-3.5" />
                  <span>{t('portal.internalPanel')}</span>
                </div>
              )}

              {permissions.fleet && <button
                onClick={() => setIsPortalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={t('portal.closePortal')}
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
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#236199] text-[#236199]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('portal.tabOverview')}</span>
              </button>
              {canViewFinances && <button
                type="button"
                onClick={() => setActiveTab('fleet')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'fleet'
                    ? 'border-[#236199] text-[#236199]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>{isAdminOrStaff ? t('portal.tabFleetAdmin') : t('portal.tabFleetClient')}</span>
              </button>}

              <button
                type="button"
                onClick={() => setActiveTab('invoices')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'border-[#236199] text-[#236199]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{isAdminOrStaff ? t('portal.tabInvoicesAdmin') : t('portal.tabInvoicesClient')}</span>
                {invoices.some(i => i.status === 'pending' || i.status === 'overdue') && (
                  <span className="w-2 h-2 rounded-full bg-[#FEC228]"></span>
                )}
              </button>

              {permissions.operations && (
                <button
                  type="button"
                  onClick={() => setActiveTab('operations')}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'operations'
                      ? 'border-[#236199] text-[#236199]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-[#236199]" />
                  <span>{t('portal.tabOperations')}</span>
                </button>
              )}

              {/* Odoo ERP & Admin Controls: ONLY for Admins / Staff */}
              {canViewOdoo && (
                <button
                  type="button"
                  onClick={() => setActiveTab('odoo')}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'odoo'
                      ? 'border-[#236199] text-[#236199]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 text-[#E4AD28]" />
                  <span>{t('portal.tabOdoo')}</span>
                </button>
              )}

              {/* Client Quick Request: For Clients */}
              {permissions.priorityRequest && (
                <button
                  type="button"
                  onClick={() => setActiveTab('request')}
                  className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'request'
                      ? 'border-[#236199] text-[#236199]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#236199]" />
                  <span>{t('portal.tabRequest')}</span>
                </button>
              )}

              {/* Gestão do blogue e da newsletter: página própria, fora do modal */}
              {canManageBlog(currentUser?.role) && (
                <Link
                  to="/painel/blogue"
                  onClick={() => setIsPortalOpen(false)}
                  className="pb-3 px-4 text-xs font-bold transition-all border-b-2 border-transparent text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <Newspaper className="w-4 h-4 text-[#236199]" />
                  <span>{t('portal.tabBlog')}</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-xs font-bold text-[#E4AD28] hover:text-[#E4AD28] flex items-center gap-1 cursor-pointer py-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('portal.logout')}</span>
            </button>
          </div>

          {/* Modal Tab Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-gray-50 text-xs">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E4AD28]">{t('portal.accountSummary')}</span>
                    <h4 className="mt-1 text-xl font-extrabold text-[#09172C]">{t('portal.hello', { name: currentUser?.name || t('portal.defaultUser') })}</h4>
                    <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
                      {isAdminOrStaff ? t('portal.overviewStaff') : t('portal.overviewClient')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-[#236199] bg-[#236199] px-3 py-2 text-[10px] font-bold text-white">
                    <ShieldCheck className="h-4 w-4" /> {t('portal.authenticated')}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button type="button" disabled={!permissions.fleet} onClick={() => permissions.fleet && setActiveTab('fleet')} className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition enabled:hover:-translate-y-0.5 enabled:hover:border-[#236199]/40 disabled:opacity-60">
                    <Car className="h-5 w-5 text-[#236199]" />
                    <strong className="mt-3 block text-2xl text-[#09172C]">{permissions.fleet ? (permissions.globalFleet ? activeVehicles.length : Math.min(activeVehicles.length, 2)) : '—'}</strong>
                    <span className="text-[10px] font-bold text-gray-500">{permissions.globalFleet ? t('portal.activeVehicles') : t('portal.linkedVehicles')}</span>
                  </button>
                  <button type="button" disabled={!canViewFinances} onClick={() => canViewFinances && setActiveTab('invoices')} className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition enabled:hover:-translate-y-0.5 enabled:hover:border-[#236199]/40 disabled:opacity-60">
                    <FileText className="h-5 w-5 text-[#E4AD28]" />
                    <strong className="mt-3 block text-2xl text-[#09172C]">{canViewFinances ? pendingInvoices.length : '—'}</strong>
                    <span className="text-[10px] font-bold text-gray-500">{t('portal.pendingDocs')}</span>
                  </button>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <Clock className="h-5 w-5 text-[#236199]" />
                    <strong className="mt-3 block text-2xl text-[#09172C]">24/7</strong>
                    <span className="text-[10px] font-bold text-gray-500">{t('portal.support247')}</span>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <BadgeCheck className="h-5 w-5 text-[#236199]" />
                    <strong className="mt-3 block truncate text-sm text-[#09172C]">{tierLabel}</strong>
                    <span className="text-[10px] font-bold text-gray-500">{t('portal.serviceLevel')}</span>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
                  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 px-5 py-4">
                      <h5 className="font-extrabold text-[#09172C]">{t('portal.accountIdTitle')}</h5>
                      <p className="mt-1 text-[10px] text-gray-500">{t('portal.accountIdText')}</p>
                    </div>
                    <dl className="grid gap-px bg-gray-100 sm:grid-cols-2">
                      {[
                        [t('portal.fieldUser'), currentUser?.name || t('portal.notProvided'), User],
                        [t('portal.fieldAccess'), roleLabel || t('portal.client'), ShieldCheck],
                        [t('portal.fieldOrganisation'), currentUser?.company || t('portal.privateAccount'), Building2],
                        ['E-mail', currentUser?.email || t('portal.notProvided'), Mail],
                        [t('portal.fieldPhone'), currentUser?.phone || t('portal.notProvided'), Phone],
                        [t('portal.fieldNif'), currentUser?.nif || t('portal.notLinked'), FileText],
                      ].map(([label, value, Icon]) => (
                        <div key={label as string} className="bg-white p-4">
                          <dt className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-400"><Icon className="h-3.5 w-3.5 text-[#236199]" />{label as string}</dt>
                          <dd className="mt-1 truncate text-xs font-bold text-[#09172C]">{value as string}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  <section className="rounded-2xl border border-gray-200 bg-[#09172C] p-5 text-white">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#FEC228]">{t('portal.quickActions')}</span>
                    <div className="mt-4 space-y-2">
                      {permissions.fleet && <button type="button" onClick={() => setActiveTab('fleet')} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"><span><strong className="block text-xs text-white">{t('portal.qaVehicles')}</strong><small className="text-[9px] text-white/55">{t('portal.qaVehiclesSub')}</small></span><ArrowUpRight className="h-4 w-4 text-[#FEC228]" /></button>}
                      {canViewFinances && <button type="button" onClick={() => setActiveTab('invoices')} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"><span><strong className="block text-xs text-white">{t('portal.qaInvoices')}</strong><small className="text-[9px] text-white/55">{t('portal.qaInvoicesSub')}</small></span><ArrowUpRight className="h-4 w-4 text-[#FEC228]" /></button>}
                      {permissions.priorityRequest && <button type="button" onClick={() => setActiveTab('request')} className="flex w-full items-center justify-between rounded-xl border border-[#FEC228]/30 bg-[#FEC228]/10 p-3 text-left hover:bg-[#FEC228]/15"><span><strong className="block text-xs text-white">{t('portal.qaRequest')}</strong><small className="text-[9px] text-white/55">{t('portal.qaRequestSub')}</small></span><ArrowUpRight className="h-4 w-4 text-[#FEC228]" /></button>}
                      {permissions.operations && <button type="button" onClick={() => setActiveTab('operations')} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"><span><strong className="block text-xs text-white">{t('portal.qaOperations')}</strong><small className="text-[9px] text-white/55">{t('portal.qaOperationsSub')}</small></span><ArrowUpRight className="h-4 w-4 text-[#FEC228]" /></button>}
                    </div>
                    <a href={generateQuickWhatsAppUrl(t('portal.supportTopic', { name: currentUser?.name, company: currentUser?.company || t('portal.private') }))} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#236199] px-4 py-3 text-[10px] font-extrabold text-white hover:bg-[#236199]"><Phone className="h-4 w-4" />{t('portal.talkToSupport')}</a>
                  </section>
                </div>
              </div>
            )}

            {/* Tab 1: Fleet View */}
            {activeTab === 'fleet' && permissions.fleet && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#09172C]">
                      {isAdminOrStaff
                        ? permissions.globalFleet ? t('portal.fleetTitleGlobal') : t('portal.fleetTitleProfile')
                        : t('portal.fleetTitleClient', { name: currentUser?.company || currentUser?.name })}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {isAdminOrStaff
                        ? permissions.globalFleet ? t('portal.fleetTextGlobal') : t('portal.fleetTextProfile')
                        : t('portal.fleetTextClient')}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-[#236199] font-bold text-xs">
                    {t('portal.inCirculation', { count: fleetTelemetry.filter(f => f.status === 'em_circulacao').length })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(permissions.globalFleet ? fleetTelemetry : fleetTelemetry.slice(0, 2)).map((flt) => (
                    <div
                      key={flt.id}
                      className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 hover:border-[#236199]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800 border">
                            {flt.plateNumber}
                          </span>
                          <h5 className="text-sm font-bold text-[#09172C] mt-1">{flt.vehicleName}</h5>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          flt.status === 'em_circulacao' ? 'bg-[#236199] text-white' :
                          flt.status === 'disponivel_talatona' ? 'bg-blue-100 text-blue-800' :
                          flt.status === 'em_reserva' ? 'bg-[#236199] text-white' : 'bg-[#FEC228] text-[#09172C]'
                        }`}>
                          {t(`portal.fleetStatus.${flt.status}`, { defaultValue: t('portal.fleetStatus.em_manutencao') })}
                        </span>
                      </div>

                      <div className="text-gray-600 space-y-1 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#236199]" />
                          <span>{flt.location}</span>
                        </div>
                        {flt.driverName && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{t('portal.driver')} <strong className="text-gray-900">{flt.driverName}</strong> ({flt.driverPhone})</span>
                          </div>
                        )}
                      </div>

                      {/* Fuel & Km */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span>{t('portal.fuel')}</span>
                          <div className="w-20 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-[#236199]" style={{ width: `${flt.fuelLevel}%` }} />
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
                {!isDemoSession && ['contabilista', 'gestor_portugal', 'direcao'].includes(currentUser?.role || '') && <BankTransferBackoffice onReconciled={refreshInvoices} />}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-[#09172C]">
                      {t('portal.invoicesTitle')}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {t('portal.invoicesText')}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex" aria-label={t('portal.currencies')}>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#09172C] text-[11px] font-extrabold text-[#FEC228]">Kz</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#236199] text-sm font-extrabold text-white">$</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">€</span>
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
                              inv.status === 'paid' ? 'bg-[#236199] text-white' : inv.status === 'overdue' ? 'bg-[#FEC228] text-[#09172C]' : 'bg-[#FEC228] text-[#09172C]'
                            }`}>
                              {inv.status === 'paid' ? t('portal.statusPaid') : inv.status === 'overdue' ? t('portal.statusOverdue') : t('portal.statusPending')}
                            </span>
                            {inv.odooInvoiceId && (
                              <span className="text-[10px] text-gray-400 font-mono">Odoo: {inv.odooInvoiceId}</span>
                            )}
                          </div>
                          <p className="text-gray-600">{inv.description}</p>
                          <div className="text-gray-400 text-[11px]">{t('portal.issuedDue', { issued: inv.date, due: inv.dueDate })}</div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1.5 text-sm font-extrabold text-[#09172C]">
                              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#09172C] px-1 text-[8px] text-[#FEC228]">Kz</span>
                              {inv.amountAOA.toLocaleString('pt-AO')} AOA
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              ≈ ${inv.amountUSD.toLocaleString()} USD
                            </div>
                          </div>

                          {inv.status === 'pending' || inv.status === 'overdue' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentInvoice(inv)}
                              className="btn-primary py-2 px-4 text-xs font-bold cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{inv.status === 'overdue' ? t('portal.settle') : t('portal.payNow')}</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-xl bg-[#236199] text-white font-bold flex items-center gap-1 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{inv.paymentGateway ? t(`payment.gatewayLabels.${inv.paymentGateway}`, { defaultValue: inv.paymentGateway }) : ''}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedReceiptInvoice(inv)}
                                className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-[#09172C] hover:border-[#236199] hover:bg-blue-50/50 transition cursor-pointer shadow-sm"
                                title={t('portal.receiptTitle')}
                              >
                                <FileText className="w-3.5 h-3.5 text-[#236199]" />
                                <span>{t('portal.receipt')}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'operations' && permissions.operations && (
              <div className="space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E4AD28]">{t('portal.opsEyebrow')}</span>
                    <h4 className="mt-1 text-lg font-extrabold text-[#09172C]">{t('portal.opsTitle')}</h4>
                    <p className="text-xs text-gray-500">{t('portal.opsText')}</p>
                  </div>
                  <span className="rounded-full bg-[#236199] px-3 py-1 text-[10px] font-extrabold text-white">{t('portal.opsBadge')}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                  {[
                    [t('portal.kpiBookings'), '34', CalendarCheck, 'text-blue-700 bg-blue-50'],
                    [t('portal.kpiInProgress'), '6', Activity, 'text-white bg-[#236199]'],
                    [t('portal.kpiDrivers'), '28', User, 'text-white bg-[#236199]'],
                    [t('portal.kpiMaintenance'), '3', Wrench, 'text-[#E4AD28] bg-[#FEC228]'],
                    [t('portal.kpiSla'), '96,8%', ShieldCheck, 'text-[#09172C] bg-[#FFF7D6]'],
                  ].map(([label, value, Icon, tone]) => (
                    <div key={label as string} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></div>
                      <strong className="block text-xl font-extrabold text-[#09172C]">{value as string}</strong>
                      <span className="text-[10px] font-bold text-gray-500">{label as string}</span>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <strong className="text-xs text-[#09172C]">{t('portal.agenda')}</strong>
                    <span className="text-[10px] text-gray-400">{t('portal.agendaSync')}</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {DEMO_OPERATIONAL_RECORDS.map((record) => (
                      <div key={record.id} className="grid gap-3 px-4 py-3 hover:bg-gray-50 sm:grid-cols-[150px_1fr_150px_130px] sm:items-center">
                        <div><span className="font-mono text-[10px] font-extrabold text-[#236199]">{record.reference}</span><span className="block text-[9px] uppercase text-gray-400">{t(`portal.recordType.${record.type}`, { defaultValue: record.type })}</span></div>
                        <div><strong className="block text-xs text-[#09172C]">{record.title}</strong><span className="text-[10px] text-gray-500">{record.owner} · {record.location}</span></div>
                        <div><Clock className="mr-1 inline h-3 w-3 text-gray-400" /><span className="text-[10px] text-gray-600">{record.scheduledAt}</span></div>
                        <div className="text-right"><span className={`rounded-full px-2 py-1 text-[9px] font-extrabold ${record.status === 'concluido' ? 'bg-[#236199] text-white' : record.status === 'atencao' ? 'bg-[#FEC228] text-[#09172C]' : record.status === 'em_execucao' ? 'bg-[#F5F6F6] text-[#236199]' : 'bg-[#FEC228] text-[#09172C]'}`}>{t(`portal.recordStatus.${record.status}`, { defaultValue: record.status.replace('_', ' ') })}</span><span className="mt-1 block font-mono text-[8px] text-gray-400">{record.odooId}</span></div>
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
                    <h4 className="text-base font-extrabold text-[#09172C]">
                      {t('portal.odooTitle')}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {t('portal.odooText')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncClick}
                    disabled={isSyncing}
                    className="btn-outline text-[#09172C] border-gray-300 hover:bg-gray-200 py-2 px-4 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#236199]' : ''}`} />
                    <span>{isSyncing ? t('portal.syncing') : t('portal.forceSync')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooVehicles')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">
                      {odooSync.totalVehiclesSynced > 0 ? t('portal.vehiclesCount', { count: odooSync.totalVehiclesSynced }) : t('portal.loading')}
                    </strong>
                    <span className="text-[10px] text-[#236199] block">{t('portal.module')} fleet.vehicle</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooOpenInvoices')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">
                      {odooSync.openInvoicesCount > 0 ? t('portal.documentsCount', { count: odooSync.openInvoicesCount }) : t('portal.synced')}
                    </strong>
                    <span className="text-[10px] text-blue-600 block">{t('portal.module')} account.move</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooQuotes')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">
                      {odooSync.pendingQuotesCount > 0 ? t('portal.quotesCount', { count: odooSync.pendingQuotesCount }) : t('portal.noPending')}
                    </strong>
                    <span className="text-[10px] text-[#E4AD28] block">{t('portal.module')} sale.order</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooPartners')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">{odooSync.partnersSynced ?? 0}</strong>
                    <span className="text-[10px] text-[#236199] block">{t('portal.module')} res.partner</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooReservations')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">{odooSync.reservationsSynced ?? 0}</strong>
                    <span className="text-[10px] text-[#236199] block">sale.order / calendar.event</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooDrivers')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">{odooSync.driversSynced ?? 0}</strong>
                    <span className="text-[10px] text-[#236199] block">{t('portal.module')} hr.employee</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-gray-400 text-[11px] block">{t('portal.odooMaintenance')}</span>
                    <strong className="text-xl font-bold text-[#09172C]">{odooSync.maintenanceOrdersOpen ?? 0}</strong>
                    <span className="text-[10px] text-[#E4AD28] block">fleet.vehicle.log.services</span>
                  </div>
                </div>

                {isDemoSession && (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <span className="flex items-center gap-2 text-xs font-extrabold text-[#09172C]"><Database className="h-4 w-4 text-[#236199]" />{t('portal.demoQueue')}</span>
                      <span className="text-[10px] font-bold text-[#236199]">{t('portal.latency', { ms: odooSync.latencyMs ?? 0 })}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {DEMO_ODOO_EVENTS.map((event) => (
                        <div key={event.id} className="grid grid-cols-[95px_1fr_90px] items-center gap-3 px-4 py-2.5 text-[10px] sm:grid-cols-[150px_130px_1fr_90px]">
                          <span className="font-mono font-bold text-[#236199]">{event.model}</span>
                          <span className="hidden text-gray-500 sm:block">{event.direction}</span>
                          <span className="truncate text-gray-700">{event.reference}</span>
                          <span className={`text-right font-bold ${event.status === 'success' ? 'text-[#236199]' : 'text-[#E4AD28]'}`}>{event.timestamp} · {t(`portal.eventStatus.${event.status}`, { defaultValue: event.status })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detalhes técnicos: apenas em modo demo para a equipa */}
                {(isDemoMode || isDemoSession) && (
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('portal.lastSync')}</span>
                      <strong className="text-gray-900">{odooSync.lastSync}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('portal.instance')}</span>
                      <strong className="text-gray-900 font-mono">{odooSync.odooDb}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('portal.apiProtocol')}</span>
                      <strong className="text-[#236199] font-mono">XML-RPC / REST JSON v2</strong>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#FEC228] border border-[#E4AD28] text-[#09172C] text-[10px]">
                      {t('portal.stagingNote')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Quick Request (Client Only) */}
            {activeTab === 'request' && permissions.priorityRequest && (
              <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 max-w-lg mx-auto">
                <h4 className="text-base font-bold text-[#09172C] text-center">
                  {t('portal.priorityTitle')}
                </h4>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  {t('portal.priorityText', { name: currentUser?.name })}
                </p>

                <div className="space-y-2 pt-2">
                  <a
                    href={generateQuickWhatsAppUrl(t('portal.vipRequestTopic', { name: currentUser?.name, company: currentUser?.company }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center text-xs py-3 font-bold"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('portal.extraVehicle')}</span>
                  </a>

                  <a
                    href={generateQuickWhatsAppUrl(t('portal.replacementTopic', { name: currentUser?.name }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 font-bold text-xs text-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{t('portal.replacementVehicle')}</span>
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

      {/* Payment receipt modal */}
      <ReceiptModal
        invoice={selectedReceiptInvoice}
        user={currentUser}
        onClose={() => setSelectedReceiptInvoice(null)}
      />
    </>
  );
};
