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
  Check
} from 'lucide-react';
import { BookingData, ServiceType, ProvinceLocation } from '../../types';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/dexie';
import { generateWhatsAppBookingUrl } from '../../lib/whatsapp';
import { syncBookingToCRM } from '../../lib/odoo';

export const BookingWidget: React.FC = () => {
  const { t } = useTranslation();

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
  const [vehicleCategory, setVehicleCategory] = useState('SUV Executiva');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      source: 'web_smart_booking',
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
          status: 'pending',
          source: 'web'
        }
      ]);
    } catch (err) {
      console.warn('Supabase insert note (fallback active):', err);
    }

    // 3. Sincronizar CRM / ERP Stub
    await syncBookingToCRM(bookingPayload);

    setLoading(false);
    setSuccess(true);

    // 4. Redirecionar imediatamente para o canal WhatsApp dinâmico
    const waUrl = generateWhatsAppBookingUrl(bookingPayload);
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <section id="reserva" className="relative -mt-10 z-30 pb-20">
      <div className="container-pepek">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#06142F] to-[#0A1E42] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B45D8] tracking-wider uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Atendimento Prioritário em Angola</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-inter">
                {t('booking.title')}
              </h2>
              <p className="text-sm text-gray-300 mt-1 max-w-xl">
                {t('booking.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-semibold text-gray-200">
              <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
              <span>Resposta média: &lt; 15 minutos</span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                1. {t('booking.serviceLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'rent-a-car', label: t('booking.serviceRent'), desc: 'Livre condução ou com motorista' },
                  { id: 'executive', label: t('booking.serviceExec'), desc: 'Chauffeur protocolar e discrição' },
                  { id: 'transfer', label: t('booking.serviceTransfer'), desc: 'Recepção VIP no Aeroporto' },
                  { id: 'corporate', label: t('booking.serviceCorp'), desc: 'Contratos e gestão de frotas' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setService(s.id as ServiceType)}
                    className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
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

            {/* Step 2: Location, Category, Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B45D8]" />
                    {t('booking.locationLabel')}
                  </span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as ProvinceLocation)}
                  className="form-select"
                >
                  <option value="Luanda">Luanda (Sede / Aeroporto)</option>
                  <option value="Huambo">Huambo (Pólo Planalto)</option>
                  <option value="Bengo">Bengo (Caxito / Litoral)</option>
                  <option value="Benguela">Benguela / Lobito</option>
                  <option value="Cabinda">Cabinda</option>
                  <option value="Outra Província">Outra Província de Angola</option>
                </select>
              </div>

              {/* Vehicle Category */}
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
                  <option value="SUV Executiva (Prado / LC300)">SUV Executiva (Prado / LC300)</option>
                  <option value="4x4 Todo-Terreno (Hilux / Fortuner)">4x4 Todo-Terreno (Hilux / Fortuner)</option>
                  <option value="Van Executiva VIP (Hiace / Quantum)">Van Executiva VIP (Hiace / Quantum)</option>
                  <option value="Minibus Comitiva (Coaster)">Minibus Comitiva (Coaster)</option>
                  <option value="Sedan Executivo de Luxo">Sedan Executivo de Luxo</option>
                  <option value="Comboio de Protocolo / Escolta">Comboio de Protocolo / Escolta</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0B45D8]" />
                    {t('booking.startDate')}
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

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0B45D8]" />
                    {t('booking.endDate')}
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

            {/* Mode: Driver Option & Transfer Info */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {t('booking.modalLabel')}:
                </span>
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                  <input
                    type="radio"
                    name="driverOption"
                    checked={withDriver}
                    onChange={() => setWithDriver(true)}
                    className="text-[#0B45D8] focus:ring-[#0B45D8]"
                  />
                  <span>{t('booking.withDriver')}</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                  <input
                    type="radio"
                    name="driverOption"
                    checked={!withDriver}
                    onChange={() => setWithDriver(false)}
                    className="text-[#0B45D8] focus:ring-[#0B45D8]"
                  />
                  <span>{t('booking.selfDrive')}</span>
                </label>
              </div>

              {service === 'transfer' && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Plane className="w-4 h-4 text-[#0B45D8]" />
                  <input
                    type="text"
                    placeholder={t('booking.flightNumber')}
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="form-input text-xs py-2 w-full md:w-56"
                  />
                </div>
              )}
            </div>

            {/* Step 3: Client Contact Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                2. Informações de Contacto & Faturação
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder={t('booking.name')}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      placeholder={t('booking.phone')}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      placeholder={t('booking.email')}
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder={t('booking.company')}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Submission CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                🔒 Os seus dados são tratados sob estrita confidencialidade. Faturação proforma enviada em conformidade AGT.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto text-base font-bold py-4 px-10 flex items-center justify-center gap-3 cursor-pointer shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <span>{t('booking.submitting')}</span>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    <span>{t('booking.submitBtn')}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Success notice */}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>{t('booking.successTitle')}</strong> {t('booking.successMsg')}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
