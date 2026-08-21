import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Car,
  Calendar,
  MapPin,
  UserCheck,
  Building2,
  CheckCircle2,
  Phone,
  Clock,
  Sparkles,
  HelpCircle,
  MessageSquare,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/dexie';
import { generateWhatsAppBookingUrl, OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { askPepekExecutiveAI } from '../../lib/ai';
import { BookingData } from '../../types';

interface BookingWidgetProps {
  initialVehicle?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ initialVehicle = 'SUV Executiva — Land Cruiser Prado / LC300' }) => {
  const { t } = useTranslation();

  // Form State
  const [serviceType, setServiceType] = useState<'rent-a-car' | 'executive' | 'transfer' | 'corporate'>('rent-a-car');
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [pickupLocation, setPickupLocation] = useState('Luanda — Sede Talatona / Aeroporto');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [withDriver, setWithDriver] = useState(true);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Human Dispatcher Interactive State
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    orderId: string;
    status: string;
    dispatcherNotes: string;
  } | null>(null);

  // Technical Help Assistant State
  const [techHelpOpen, setTechHelpOpen] = useState(false);
  const [techQuestion, setTechQuestion] = useState('');
  const [techAnswer, setTechAnswer] = useState<string | null>(null);
  const [techLoading, setTechLoading] = useState(false);

  useEffect(() => {
    if (initialVehicle) {
      setVehicle(initialVehicle);
    }
  }, [initialVehicle]);

  const handleTechHelp = async (queryText?: string) => {
    const prompt = queryText || techQuestion;
    if (!prompt.trim()) return;
    setTechLoading(true);
    try {
      const res = await askPepekExecutiveAI(prompt, []);
      setTechAnswer(res.message);
      if (res.recommendedVehicle) {
        setVehicle(res.recommendedVehicle);
      }
    } catch {
      setTechAnswer('Para vias urbanas e protocolo em Luanda recomendamos a Land Cruiser Prado. Para deslocações a províncias e terrenos acidentados, a Toyota Hilux 4x4 é a viatura com melhor desempenho técnico.');
    } finally {
      setTechLoading(false);
    }
  };

  const handleRegisterReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `PK-${new Date().getFullYear()}-${randomSuffix}`;

    const bookingPayload: BookingData = {
      service: serviceType,
      location: 'Luanda',
      destination: pickupLocation,
      startDate,
      endDate,
      vehicleCategory: vehicle,
      withDriver,
      clientName,
      clientPhone,
      clientEmail,
      notes: `Ref: ${generatedOrderId} | ${notes}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 1. Save to Local Dexie Database (Offline-first / Instant)
    try {
      if (db?.bookings) {
        await db.bookings.add(bookingPayload);
      }
    } catch (err) {
      console.warn('Dexie save notice:', err);
    }

    // 2. Save to Supabase (if connected)
    try {
      if (supabase) {
        await supabase.from('reservations').insert([
          {
            order_id: generatedOrderId,
            service_type: serviceType,
            vehicle,
            pickup_location: pickupLocation,
            start_date: startDate,
            end_date: endDate,
            with_driver: withDriver,
            client_name: clientName,
            client_phone: clientPhone,
            client_email: clientEmail,
            notes
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }

    // 3. Human Dispatcher Confirmation (Without forcing immediate WhatsApp redirect)
    setTimeout(() => {
      setConfirmationData({
        orderId: generatedOrderId,
        status: 'Registada & Alocada na Central de Despacho',
        dispatcherNotes: `A viatura ${vehicle} foi pré-reservada sob o protocolo ${generatedOrderId}. O nosso responsável de frota está a validar a disponibilidade física em Talatona e entrará em contacto para o número ${clientPhone} num prazo máximo de 15 minutos.`
      });
      setIsProcessing(false);
    }, 600);
  };

  // WhatsApp Url with Firm Pre-Registered Code
  const confirmedWhatsAppUrl = confirmationData
    ? generateWhatsAppBookingUrl({
        service: serviceType,
        location: 'Luanda',
        destination: pickupLocation,
        vehicleCategory: vehicle,
        startDate,
        endDate,
        withDriver,
        clientName,
        clientPhone,
        clientEmail,
        notes: `PROTOCOLO FIRMADO: ${confirmationData.orderId} | ${notes}`
      })
    : '';

  return (
    <section id="reserva" className="section-padding bg-white relative">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="tag-label mb-3.5">
            <Car className="w-3.5 h-3.5 text-[#0B45D8]" />
            <span>Central de Reservas & Despacho</span>
          </div>

          <h2 className="section-title mb-4">
            Planeie a Sua Mobilidade com Confirmação Imediata
          </h2>

          <p className="section-subtitle">
            Registe o seu pedido directamente no sistema de gestão de frotas da PEPEK GRUPO. Pode aguardar o contacto do nosso gestor de operações ou acelerar a confirmação via linha prioritária.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Booking Form */}
          <div className="lg:col-span-8 bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm relative">
            {!confirmationData ? (
              <form onSubmit={handleRegisterReservation} className="space-y-6">
                {/* 1. Service & Driver */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Tipo de Serviço
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="rent-a-car">Rent a Car Executivo (Diário / Mensal)</option>
                      <option value="executive">Apoio Executivo com Chauffeur Bilingue</option>
                      <option value="transfer">Transfer Aeroporto 4 de Fevereiro / AIAAN</option>
                      <option value="corporate">Contrato de Frota para Empresa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Regime de Condução
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWithDriver(true)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          withDriver
                            ? 'bg-[#06142F] text-white border-[#06142F] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#0B45D8]" />
                        <span>Com Motorista</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWithDriver(false)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          !withDriver
                            ? 'bg-[#06142F] text-white border-[#06142F] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5 text-[#0B45D8]" />
                        <span>Livre Condução</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Vehicle Selection with specs reminder */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Viatura Pretendida
                    </label>
                    <button
                      type="button"
                      onClick={() => setTechHelpOpen(!techHelpOpen)}
                      className="text-xs font-bold text-[#0B45D8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ajuda Técnica a Escolher?</span>
                    </button>
                  </div>

                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="form-select"
                  >
                    <option value="SUV Executiva — Land Cruiser Prado / LC300">Toyota Land Cruiser Prado TXL / LC300 VXR (SUV de Luxo)</option>
                    <option value="Todo-Terreno — Toyota Hilux Dupla Cabine 4x4">Toyota Hilux Dupla Cabine 4x4 (Campo & Províncias)</option>
                    <option value="SUV Familiar — Toyota Fortuner 4x4">Toyota Fortuner 4x4 (Conforto & Força 7 Lugares)</option>
                    <option value="Van Executiva VIP — Toyota Hiace 12L">Toyota Hiace VIP 12 Lugares (Transfers & Comitivas)</option>
                    <option value="Minibus VIP — Toyota Coaster 26L">Toyota Coaster Executiva 26 Lugares (Delegações)</option>
                    <option value="Sedan Executivo de Representação">Mercedes-Benz Classe E / Toyota Camry</option>
                  </select>
                </div>

                {/* Technical Help Box (Proactive AI Recommender) */}
                {techHelpOpen && (
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#06142F] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#0B45D8]" />
                        <span>Apoio Técnico da Frota PEPEK</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setTechHelpOpen(false)}
                        className="text-gray-400 hover:text-gray-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleTechHelp('Qual o melhor carro para viagem ao Huambo e Bengo?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-medium hover:bg-blue-100 transition-colors"
                      >
                        📍 Viagem a Províncias (Huambo/Bengo)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTechHelp('Qual a viatura recomendada para comitivas e embaixadores em Luanda?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-medium hover:bg-blue-100 transition-colors"
                      >
                        🏛️ Protocolo & Embaixadas em Luanda
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTechHelp('Qual a van ideal para transfer de equipa com 8 a 12 pessoas e malas?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-medium hover:bg-blue-100 transition-colors"
                      >
                        👥 Grupo com Bagagens / Aeroporto
                      </button>
                    </div>

                    {techLoading && (
                      <p className="text-gray-500 italic">O despachante técnico está a avaliar as especificações...</p>
                    )}

                    {techAnswer && (
                      <div className="p-3 bg-white rounded-xl border border-blue-100 text-gray-800 leading-relaxed font-medium">
                        {techAnswer}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Location and Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Local de Levantamento / Partida
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="form-input pl-10 text-xs"
                        placeholder="ex: Talatona / Aeroporto / Hotel"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-input text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Data de Devolução / Fim
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-input text-xs"
                      required
                    />
                  </div>
                </div>

                {/* 4. Client Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Nome / Entidade
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="ex: Dr. António / Embaixada..."
                      className="form-input text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Telemóvel / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+244 9XX XXX XXX"
                      className="form-input text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      E-mail para Faturação (Opcional)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="contacto@entidade.ao"
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                {/* Action Submit */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-gray-500">
                    🔒 Registo direto na base operacional da PEPEK. Sem custos de reserva prévia.
                  </p>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full sm:w-auto text-xs font-bold py-3.5 px-8 cursor-pointer disabled:opacity-50"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isProcessing ? 'A registar na Central...' : 'Confirmar & Registar Reserva'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Confirmation Screen (No Immediate Jump to WhatsApp) */
              <div className="py-6 space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                      Protocolo Oficial Gerado
                    </span>
                    <h3 className="text-xl font-extrabold text-[#06142F]">
                      Código de Confirmação: {confirmationData.orderId}
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-gray-200 text-xs space-y-2.5 text-gray-700">
                  <p className="font-semibold text-gray-900 leading-relaxed">
                    {confirmationData.dispatcherNotes}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-[11px]">
                    <div>
                      <span className="text-gray-400 block">Viatura:</span>
                      <strong className="text-gray-900">{vehicle}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Regime:</span>
                      <strong className="text-gray-900">{withDriver ? 'Com Motorista VIP' : 'Livre Condução'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Local:</span>
                      <strong className="text-gray-900">{pickupLocation}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Contacto:</span>
                      <strong className="text-gray-900">{clientPhone}</strong>
                    </div>
                  </div>
                </div>

                {/* Two Options: Wait for call OR accelerate on WhatsApp with firm code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
                    <div className="flex items-center gap-2 font-bold text-[#06142F] mb-1">
                      <Clock className="w-4 h-4 text-[#0B45D8]" />
                      <span>Opção 1: Aguardar Chamada</span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      O nosso gestor de operações já recebeu os seus dados e entrará em contacto brevemente.
                    </p>
                    <button
                      type="button"
                      onClick={() => setConfirmationData(null)}
                      className="text-xs font-bold text-[#0B45D8] hover:underline cursor-pointer"
                    >
                      Criar nova reserva ➔
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-950 mb-1">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Opção 2: Despacho Prioritário</span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Se tem urgência ou necessita da viatura nas próximas horas, envie o protocolo directamente para o WhatsApp.
                    </p>
                    <a
                      href={confirmedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp w-full justify-center text-xs py-2.5 font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Acelerar via WhatsApp com Protocolo</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Active Fleet Specs & Direct Line */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected Vehicle Card Preview */}
            <div className="bg-[#06142F] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B45D8] px-2.5 py-1 rounded-full bg-white/10">
                  Garantia de Frota
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Disponível em Talatona
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">
                Frota Executiva Rigorosa
              </h4>

              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Todas as viaturas passam por higienização hospitalar, revisão preventiva aos 5.000 km e dispõem de seguro de danos próprios incluído.
              </p>

              <div className="space-y-3 text-xs border-t border-white/10 pt-4 text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Seguro Contra Todos os Riscos:</span>
                  <strong className="text-white">Incluído</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Assistência Móvel nas 18 Províncias:</span>
                  <strong className="text-white">24h / 7 dias</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Viatura de Substituição:</span>
                  <strong className="text-white">Garantida</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Faturação Certificada AGT:</span>
                  <strong className="text-white">AOA / USD / EUR</strong>
                </div>
              </div>
            </div>

            {/* Direct Operational Phone Contacts */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 text-xs space-y-3">
              <span className="font-extrabold text-[#06142F] uppercase tracking-wider block">
                Central de Operações Talatona
              </span>
              <p className="text-gray-600">
                Linhas telefónicas directas para agendamento de comitivas e empresas:
              </p>
              <div className="space-y-1 font-bold text-sm text-[#06142F]">
                <a href="tel:+244923719090" className="block hover:text-[#0B45D8] transition-colors">
                  📞 +244 923 719 090
                </a>
                <a href="tel:+244923000010" className="block hover:text-[#0B45D8] transition-colors">
                  📞 +244 923 000 010
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
