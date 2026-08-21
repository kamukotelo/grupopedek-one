import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Car, 
  Send, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Plane, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  Check,
  Bot,
  ArrowRight,
  Clock
} from 'lucide-react';
import { BookingData, ServiceType, ProvinceLocation } from '../../types';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/dexie';
import { generateWhatsAppBookingUrl } from '../../lib/whatsapp';
import { syncBookingToCRM } from '../../lib/odoo';

interface BookingWidgetProps {
  initialVehicle?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ initialVehicle }) => {
  const { t } = useTranslation();

  // Mode: 'concierge' (Interactive AI qualification flow) vs 'form' (direct manual form)
  const [activeMode, setActiveMode] = useState<'concierge' | 'form'>('concierge');

  // Concierge wizard step (1 to 4)
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Booking fields
  const [service, setService] = useState<ServiceType>('rent-a-car');
  const [location, setLocation] = useState<ProvinceLocation>('Luanda');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [withDriver, setWithDriver] = useState(true);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [passengersCount, setPassengersCount] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState(initialVehicle || 'SUV Executiva — Land Cruiser Prado / LC300');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCompleteDispatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    const bookingPayload: BookingData = {
      service,
      location,
      destination: destination.trim() || undefined,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || undefined,
      vehicleCategory,
      withDriver,
      clientName: clientName.trim() || 'Cliente Executivo',
      clientPhone: clientPhone.trim() || '+244',
      clientEmail: clientEmail.trim() || undefined,
      companyName: companyName.trim() || undefined,
      flightNumber: service === 'transfer' ? flightNumber.trim() || undefined : undefined,
      passengersCount,
      notes: notes.trim() || undefined,
      status: 'pending',
      source: activeMode === 'concierge' ? 'ai_concierge_qualification' : 'web_smart_booking',
      createdAt: new Date().toISOString()
    };

    // 1. Salvar no IndexedDB local para resiliência offline
    try {
      await db.bookings.add(bookingPayload);
    } catch (err) {
      console.warn('Dexie save error:', err);
    }

    // 2. Salvar no Supabase (se acessível)
    try {
      await supabase.from('bookings').insert([
        {
          service: bookingPayload.service,
          location: bookingPayload.location,
          start_date: bookingPayload.startDate,
          end_date: bookingPayload.endDate,
          client_name: bookingPayload.clientName,
          client_phone: bookingPayload.clientPhone,
          client_email: bookingPayload.clientEmail,
          company_name: bookingPayload.companyName,
          status: 'pending',
          source: bookingPayload.source
        }
      ]);
    } catch (err) {
      console.warn('Supabase insert fallback:', err);
    }

    // 3. Sincronizar CRM / ERP
    await syncBookingToCRM(bookingPayload);

    setLoading(false);
    setSuccess(true);

    // 4. Redirecionar imediatamente para o canal WhatsApp dinâmico com mensagem formatada
    const waUrl = generateWhatsAppBookingUrl(bookingPayload);
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <section id="reserva" className="relative -mt-12 z-30 pb-24">
      <div className="container-pepek">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#06142F] via-[#0A1E42] to-[#06142F] p-7 sm:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B45D8] tracking-widest uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Central de Qualificação & Despacho Executivo</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-inter">
                Solicitação de Reserva & Experiência VIP
              </h2>
              <p className="text-sm text-gray-300 mt-2 max-w-2xl">
                O nosso assistente qualifica a sua necessidade com total discrição e encaminha a sua solicitação com prioridade para a central de operações no WhatsApp.
              </p>
            </div>

            {/* Mode Toggle Pills */}
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveMode('concierge')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeMode === 'concierge'
                    ? 'bg-[#0B45D8] text-white shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Assistente Concierge</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('form')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeMode === 'form'
                    ? 'bg-[#0B45D8] text-white shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Formulário Directo</span>
              </button>
            </div>
          </div>

          {/* MODE 1: Interactive AI Concierge Wizard */}
          {activeMode === 'concierge' ? (
            <div className="p-7 sm:p-10 lg:p-12 space-y-8">
              {/* Wizard Step Progress */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                {[
                  { step: 1, label: '1. Natureza do Serviço' },
                  { step: 2, label: '2. Datas & Local' },
                  { step: 3, label: '3. Viatura & Modalidade' },
                  { step: 4, label: '4. Contacto & Despacho' },
                ].map((item) => (
                  <div
                    key={item.step}
                    onClick={() => item.step < wizardStep && setWizardStep(item.step)}
                    className={`flex items-center gap-2 text-xs font-bold cursor-pointer transition-colors ${
                      wizardStep === item.step
                        ? 'text-[#0B45D8]'
                        : item.step < wizardStep
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                      wizardStep === item.step
                        ? 'bg-[#0B45D8] text-white'
                        : item.step < wizardStep
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.step < wizardStep ? '✓' : item.step}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Wizard Step 1: Service Type */}
              {wizardStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B45D8]">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#06142F]">
                        Qual é o objectivo principal da sua deslocação?
                      </h3>
                      <p className="text-xs text-gray-500">
                        Seleccione a modalidade para ajustarmos os parâmetros de atendimento.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: 'rent-a-car', title: 'Rent a Car de Luxo', desc: 'Aluguer flexível diário ou mensal de SUVs e 4x4' },
                      { id: 'executive', title: 'Apoio Executivo & Protocolo', desc: 'Motorista bilingue treinado para direcção e comitivas' },
                      { id: 'transfer', title: 'Transfer Aeroporto VIP', desc: 'Recepção Meet & Greet personalizada nos aeroportos de Luanda' },
                      { id: 'corporate', title: 'Solução Corporativa', desc: 'Gestão de frotas e contratos outsourcing para empresas' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setService(opt.id as ServiceType);
                          setWizardStep(2);
                        }}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:border-[#0B45D8] hover:shadow-lg ${
                          service === opt.id
                            ? 'border-[#0B45D8] bg-blue-50/40 ring-1 ring-[#0B45D8]'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[#0B45D8] mb-4">
                            ➔
                          </div>
                          <h4 className="text-base font-bold text-[#06142F] mb-2">{opt.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
                        </div>
                        <span className="text-xs font-bold text-[#0B45D8] mt-6 block">Seleccionar ➔</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wizard Step 2: Location & Dates */}
              {wizardStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B45D8]">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#06142F]">
                          Onde e quando terá início o serviço?
                        </h3>
                        <p className="text-xs text-gray-500">
                          Indique o ponto de partida e as datas previstas.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="text-xs font-bold text-gray-500 hover:text-[#06142F]"
                    >
                      ← Voltar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Ponto de Partida / Província
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value as ProvinceLocation)}
                        className="form-select"
                      >
                        <option value="Luanda">Luanda (Sede / Aeroporto / Talatona)</option>
                        <option value="Huambo">Huambo (Pólo Planalto)</option>
                        <option value="Bengo">Bengo (Caxito / Litoral)</option>
                        <option value="Benguela">Benguela / Lobito</option>
                        <option value="Cabinda">Cabinda</option>
                        <option value="Outra Província">Outra Província de Angola</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Data de Início
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Data de Término
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="btn-primary py-4 px-8 text-xs font-bold flex items-center gap-2"
                    >
                      <span>Avançar para Escolha de Viatura</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Step 3: Vehicle & Driving Mode */}
              {wizardStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B45D8]">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#06142F]">
                          Preferência de Viatura e Modalidade de Condução
                        </h3>
                        <p className="text-xs text-gray-500">
                          Escolha o veículo e se necessita de chauffeur protocolar.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="text-xs font-bold text-gray-500 hover:text-[#06142F]"
                    >
                      ← Voltar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Categoria de Viatura
                      </label>
                      <select
                        value={vehicleCategory}
                        onChange={(e) => setVehicleCategory(e.target.value)}
                        className="form-select"
                      >
                        <option value="SUV Executiva — Land Cruiser Prado / LC300">SUV Executiva (Prado / LC300)</option>
                        <option value="4x4 Todo-Terreno — Toyota Hilux / Fortuner">4x4 Todo-Terreno (Hilux / Fortuner)</option>
                        <option value="Van Executiva VIP — Toyota Hiace / Quantum">Van Executiva VIP (Hiace / Quantum)</option>
                        <option value="Minibus Comitiva (Coaster)">Minibus Comitiva (Coaster)</option>
                        <option value="Sedan Executivo de Luxo">Sedan Executivo de Luxo</option>
                        <option value="Comboio Protocolar & Segurança Especial">Comboio Protocolar & Escolta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Modalidade de Condução
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setWithDriver(true)}
                          className={`p-4 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                            withDriver
                              ? 'border-[#0B45D8] bg-blue-50/50 text-[#06142F]'
                              : 'border-gray-200 text-gray-600'
                          }`}
                        >
                          ✓ Com Motorista Protocolar
                        </button>
                        <button
                          type="button"
                          onClick={() => setWithDriver(false)}
                          className={`p-4 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                            !withDriver
                              ? 'border-[#0B45D8] bg-blue-50/50 text-[#06142F]'
                              : 'border-gray-200 text-gray-600'
                          }`}
                        >
                          Livre Condução (Self-Drive)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="btn-primary py-4 px-8 text-xs font-bold flex items-center gap-2"
                    >
                      <span>Finalizar & Obter Despacho Imediato</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Step 4: Contact & Dispatch to WhatsApp */}
              {wizardStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#06142F]">
                          Resumo da Sua Solicitação & Identificação
                        </h3>
                        <p className="text-xs text-gray-500">
                          Preencha os seus dados para gerar o despacho com prioridade no WhatsApp.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="text-xs font-bold text-gray-500 hover:text-[#06142F]"
                    >
                      ← Voltar
                    </button>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block font-semibold">Serviço:</span>
                      <span className="font-bold text-gray-900">{service.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-semibold">Local / Província:</span>
                      <span className="font-bold text-gray-900">{location}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-semibold">Viatura:</span>
                      <span className="font-bold text-[#0B45D8] truncate block">{vehicleCategory}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-semibold">Motorista:</span>
                      <span className="font-bold text-gray-900">{withDriver ? 'Com Chauffeur' : 'Auto'}</span>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">O Seu Nome</label>
                      <input
                        type="text"
                        placeholder="Ex: Dr. Manuel Silva"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">WhatsApp / Telemóvel</label>
                      <input
                        type="tel"
                        placeholder="+244 9XX XXX XXX"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">E-mail Corporativo</label>
                      <input
                        type="email"
                        placeholder="direccao@empresa.ao"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Instituição / Empresa</label>
                      <input
                        type="text"
                        placeholder="Ex: Embaixada / Sonangol"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4 text-[#0B45D8]" />
                      <span>Despacho imediato por gestor de operações PEPEK</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCompleteDispatch()}
                      disabled={loading}
                      className="btn-whatsapp w-full sm:w-auto text-sm font-bold py-4 px-10 flex items-center justify-center gap-3 cursor-pointer shadow-xl"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{loading ? 'A processar...' : 'Despachar para o WhatsApp Oficial'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: Manual Direct Booking Form */
            <form onSubmit={handleCompleteDispatch} className="p-7 sm:p-10 lg:p-12 space-y-8 animate-fadeIn">
              {/* Form Content */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  1. {t('booking.serviceLabel')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'rent-a-car', label: 'Rent a Car de Luxo', desc: 'Livre condução ou com motorista' },
                    { id: 'executive', label: 'Apoio Executivo & Protocolo', desc: 'Chauffeur protocolar e discrição' },
                    { id: 'transfer', label: 'Transfer Aeroporto VIP', desc: 'Recepção VIP no Aeroporto' },
                    { id: 'corporate', label: 'Solução Corporativa', desc: 'Contratos e gestão de frotas' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setService(s.id as ServiceType)}
                      className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                        service === s.id
                          ? 'border-[#0B45D8] bg-[#0B45D8]/5 shadow-md ring-1 ring-[#0B45D8]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#06142F]">{s.label}</span>
                        {service === s.id && (
                          <div className="w-5 h-5 rounded-full bg-[#0B45D8] text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0B45D8]" />
                      Província / Partida
                    </span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as ProvinceLocation)}
                    className="form-select"
                  >
                    <option value="Luanda">Luanda (Sede / Aeroporto / Talatona)</option>
                    <option value="Huambo">Huambo (Pólo Planalto)</option>
                    <option value="Bengo">Bengo (Caxito / Litoral)</option>
                    <option value="Benguela">Benguela / Lobito</option>
                    <option value="Cabinda">Cabinda</option>
                    <option value="Outra Província">Outra Província de Angola</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#0B45D8]" />
                      Categoria de Viatura
                    </span>
                  </label>
                  <select
                    value={vehicleCategory}
                    onChange={(e) => setVehicleCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="SUV Executiva — Land Cruiser Prado / LC300">SUV Executiva (Prado / LC300)</option>
                    <option value="4x4 Todo-Terreno — Toyota Hilux / Fortuner">4x4 Todo-Terreno (Hilux / Fortuner)</option>
                    <option value="Van Executiva VIP — Toyota Hiace / Quantum">Van Executiva VIP (Hiace / Quantum)</option>
                    <option value="Minibus Comitiva (Coaster)">Minibus Comitiva (Coaster)</option>
                    <option value="Sedan Executivo de Luxo">Sedan Executivo de Luxo</option>
                    <option value="Comboio Protocolar & Segurança Especial">Comboio Protocolar & Escolta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0B45D8]" />
                      Data de Início
                    </span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0B45D8]" />
                      Data de Término
                    </span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  2. Informações de Contacto & Faturação
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nome Completo"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Telemóvel / WhatsApp (+244)"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="E-mail Corporativo"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Empresa / Organização"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  🔒 Facturação AGT em moeda nacional (AOA) ou divisas (USD/EUR).
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto text-base font-bold py-4 px-10 flex items-center justify-center gap-3 cursor-pointer shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{loading ? 'A processar...' : 'Despachar para o WhatsApp'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
