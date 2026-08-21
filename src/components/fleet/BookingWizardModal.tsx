import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  Fuel,
  Baby,
  Wifi,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  MessageSquareText,
  Building2,
  User,
  Phone,
  Mail,
  FileCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { FLEET_DATABASE, VehicleDetail } from '../../data/fleetData';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';

interface BookingWizardModalProps {
  initialVehicleName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  initialVehicleName,
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    const found = FLEET_DATABASE.find(
      (v) => v.name.toLowerCase() === (initialVehicleName || '').toLowerCase()
    );
    return found ? found.id : FLEET_DATABASE[0].id;
  });

  const [pickupLocation, setPickupLocation] = useState('Aeroporto Internacional 4 de Fevereiro (LAD)');
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [dropoffLocation, setDropoffLocation] = useState('Hub Central Pepek Talatona');
  
  // Dates default: tomorrow and 3 days later
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const threeDays = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [dropoffDate, setDropoffDate] = useState(threeDays);
  const [dropoffTime, setDropoffTime] = useState('18:00');

  // Extras
  const [withDriver, setWithDriver] = useState(false);
  const [withFuelClean, setWithFuelClean] = useState(false);
  const [withBabySeat, setWithBabySeat] = useState(false);
  const [withWifi, setWithWifi] = useState(false);

  // Client info
  const [clientType, setClientType] = useState<'particular' | 'empresa'>('particular');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nif, setNif] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Sync selected vehicle if prop updates
  React.useEffect(() => {
    if (initialVehicleName) {
      const found = FLEET_DATABASE.find(
        (v) => v.name.toLowerCase() === initialVehicleName.toLowerCase()
      );
      if (found) {
        setSelectedVehicleId(found.id);
      }
    }
  }, [initialVehicleName]);

  const selectedVehicle = useMemo(() => {
    return FLEET_DATABASE.find((v) => v.id === selectedVehicleId) || FLEET_DATABASE[0];
  }, [selectedVehicleId]);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(pickupDate).getTime();
      const end = new Date(dropoffDate).getTime();
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [pickupDate, dropoffDate]);

  // Extra daily costs in AOA
  const DRIVER_RATE = 35000;
  const FUEL_CLEAN_RATE = 35000;
  const BABY_SEAT_RATE = 10000;
  const WIFI_RATE = 15000;

  // Financial calculations
  const baseRentalSubtotal = selectedVehicle.pricePerDayAOA * rentalDays;
  const driverSubtotal = withDriver ? DRIVER_RATE * rentalDays : 0;
  const fuelCleanSubtotal = withFuelClean ? FUEL_CLEAN_RATE * rentalDays : 0;
  const babySeatSubtotal = withBabySeat ? BABY_SEAT_RATE * rentalDays : 0;
  const wifiSubtotal = withWifi ? WIFI_RATE * rentalDays : 0;
  const extrasTotal = driverSubtotal + fuelCleanSubtotal + babySeatSubtotal + wifiSubtotal;
  const grandTotalAOA = baseRentalSubtotal + extrasTotal;

  if (!isOpen) return null;

  const handleWhatsAppSubmission = () => {
    const formattedTotal = grandTotalAOA.toLocaleString('pt-AO') + ' Kz';
    const formattedDaily = selectedVehicle.pricePerDayFormatted;

    const msg = `*NOVA SOLICITAÇÃO DE RESERVA — PEPEK RENT A CAR*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚗 *Viatura:* ${selectedVehicle.name} (${selectedVehicle.categoryLabel})\n` +
      `💰 *Tarifa diária:* ${formattedDaily}\n` +
      `📅 *Período:* ${pickupDate} às ${pickupTime} até ${dropoffDate} às ${dropoffTime} (${rentalDays} ${rentalDays === 1 ? 'dia' : 'dias'})\n` +
      `📍 *Levantamento:* ${pickupLocation}\n` +
      `📍 *Devolução:* ${differentDropoff ? dropoffLocation : pickupLocation}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ *Extras Selecionados:*\n` +
      `${withDriver ? `• Motorista Executivo: +${(DRIVER_RATE * rentalDays).toLocaleString('pt-AO')} Kz\n` : ''}` +
      `${withFuelClean ? `• Higienização e Combustível: +${(FUEL_CLEAN_RATE * rentalDays).toLocaleString('pt-AO')} Kz\n` : ''}` +
      `${withBabySeat ? `• Cadeira de Criança: +${(BABY_SEAT_RATE * rentalDays).toLocaleString('pt-AO')} Kz\n` : ''}` +
      `${withWifi ? `• Wi-Fi 5G Ilimitado: +${(WIFI_RATE * rentalDays).toLocaleString('pt-AO')} Kz\n` : ''}` +
      `${!withDriver && !withFuelClean && !withBabySeat && !withWifi ? '• Nenhum extra adicionado\n' : ''}` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Dados do Cliente:*\n` +
      `• *Nome:* ${fullName || 'Não informado'}\n` +
      `• *Tipo:* ${clientType === 'empresa' ? 'Empresa / Institucional' : 'Particular'}\n` +
      `• *Telefone/WhatsApp:* ${phone || 'Não informado'}\n` +
      `• *Email:* ${email || 'Não informado'}\n` +
      `${nif ? `• *NIF:* ${nif}\n` : ''}` +
      `${driverLicenseNumber ? `• *Carta de Condução:* ${driverLicenseNumber}\n` : ''}` +
      `${notes ? `• *Observações:* ${notes}\n` : ''}` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💎 *VALOR TOTAL ESTIMADO:* ${formattedTotal}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Por favor confirmar a disponibilidade e enviar a fatura proforma._`;

    const url = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#020A2A]/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-[#D9DEE7] animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#020A2A] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D2A820] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D2A820]">
                Reserva Online Premium
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Assistente de Reserva de Viaturas
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#07133F] px-6 py-3 border-b border-white/10 shrink-0">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                step === 1
                  ? 'bg-[#D2A820] text-[#020A2A] font-bold shadow-md'
                  : step > 1
                  ? 'text-white/80 hover:text-white'
                  : 'text-white/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 1 ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-white/20 text-white'
              }`}>1</span>
              <span className="hidden sm:inline">Viatura & Período</span>
              <span className="sm:hidden">Viatura</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                step === 2
                  ? 'bg-[#D2A820] text-[#020A2A] font-bold shadow-md'
                  : step > 2
                  ? 'text-white/80 hover:text-white'
                  : 'text-white/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 2 ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-white/20 text-white'
              }`}>2</span>
              <span className="hidden sm:inline">Extras Opcionais</span>
              <span className="sm:hidden">Extras</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                step === 3
                  ? 'bg-[#D2A820] text-[#020A2A] font-bold shadow-md'
                  : step > 3
                  ? 'text-white/80 hover:text-white'
                  : 'text-white/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 3 ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-white/20 text-white'
              }`}>3</span>
              <span className="hidden sm:inline">Identificação</span>
              <span className="sm:hidden">Cliente</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                step === 4
                  ? 'bg-[#D2A820] text-[#020A2A] font-bold shadow-md'
                  : 'text-white/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 4 ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-white/20 text-white'
              }`}>4</span>
              <span className="hidden sm:inline">Resumo & Despacho</span>
              <span className="sm:hidden">Resumo</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F3F5F8]">
          {/* ═══════════════════════════════════════════════════════
              ETAPA 1: VIATURA E PERÍODO
             ═══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Select Vehicle Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#D9DEE7] shadow-xs">
                <label className="block text-xs font-bold text-[#07133F] uppercase tracking-wider mb-2">
                  Selecione a Viatura Desejada
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-[#D9DEE7] rounded-xl text-sm font-bold text-[#07133F] focus:ring-2 focus:ring-[#D2A820] focus:border-transparent outline-hidden"
                >
                  {FLEET_DATABASE.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.categoryLabel} ({v.pricePerDayFormatted}/dia)
                    </option>
                  ))}
                </select>

                {/* Quick Vehicle Highlight */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#F3F5F8] border border-[#D9DEE7]">
                  <img
                    src={selectedVehicle.primaryImage}
                    alt={selectedVehicle.name}
                    className="w-32 h-20 object-cover rounded-lg shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-extrabold text-[#07133F] text-base">{selectedVehicle.name}</h4>
                    <p className="text-xs text-[#697080]">{selectedVehicle.specs.passengers} Passageiros · {selectedVehicle.specs.doors} Portas · {selectedVehicle.specs.transmission} · {selectedVehicle.specs.fuelType}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-[#07133F] block">{selectedVehicle.pricePerDayFormatted}</span>
                    <span className="text-[10px] text-[#697080] font-semibold uppercase">por dia</span>
                  </div>
                </div>
              </div>

              {/* Pickup & Dropoff Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#D9DEE7] shadow-xs">
                  <label className="block text-xs font-bold text-[#07133F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D2A820]" />
                    Local de Levantamento
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden"
                  >
                    <option value="Aeroporto Internacional 4 de Fevereiro (LAD)">Aeroporto 4 de Fevereiro (LAD)</option>
                    <option value="Aeroporto Internacional Dr. António Agostinho Neto (AIAAN)">Novo Aeroporto AIAAN</option>
                    <option value="Hub Central Pepek Talatona">Hub Central Pepek — Talatona</option>
                    <option value="Hotel Epic Sana Luanda">Hotel Epic Sana Luanda</option>
                    <option value="Miramar / Cidade Alta (Protocolar)">Miramar / Cidade Alta</option>
                    <option value="Entrega em Endereço Personalizado">Entrega em Endereço Personalizado</option>
                  </select>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#D9DEE7] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#07133F] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#1E8E5A]" />
                      Local de Devolução
                    </label>
                    <label className="text-[11px] text-[#697080] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={differentDropoff}
                        onChange={(e) => setDifferentDropoff(e.target.checked)}
                        className="rounded text-[#D2A820]"
                      />
                      <span>Noutro local</span>
                    </label>
                  </div>

                  {differentDropoff ? (
                    <select
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden"
                    >
                      <option value="Hub Central Pepek Talatona">Hub Central Pepek — Talatona</option>
                      <option value="Aeroporto Internacional 4 de Fevereiro (LAD)">Aeroporto 4 de Fevereiro (LAD)</option>
                      <option value="Aeroporto Internacional Dr. António Agostinho Neto (AIAAN)">Novo Aeroporto AIAAN</option>
                      <option value="Hotel Epic Sana Luanda">Hotel Epic Sana Luanda</option>
                      <option value="Recolha em Endereço do Cliente">Recolha em Endereço do Cliente</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs text-[#697080]">
                      Mesmo local do levantamento ({pickupLocation.split('(')[0]})
                    </div>
                  )}
                </div>
              </div>

              {/* Dates and Times */}
              <div className="bg-white p-5 rounded-2xl border border-[#D9DEE7] shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#07133F] uppercase mb-1">Data Levantamento</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-semibold text-[#07133F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#07133F] uppercase mb-1">Hora Levantamento</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-semibold text-[#07133F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#07133F] uppercase mb-1">Data Devolução</label>
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-semibold text-[#07133F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#07133F] uppercase mb-1">Hora Devolução</label>
                    <input
                      type="time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-semibold text-[#07133F]"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#07133F] pt-3 border-t border-gray-100">
                  <span className="font-bold">Duração calculada do aluguer:</span>
                  <span className="px-3 py-1 bg-[#D2A820]/20 text-[#020A2A] font-black rounded-full">
                    {rentalDays} {rentalDays === 1 ? 'Dia' : 'Dias'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              ETAPA 2: EXTRAS OPCIONAIS
             ═══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-blue-100 bg-blue-50/40 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#07133F] shrink-0 mt-0.5" />
                <p className="text-xs text-[#07133F]">
                  Personalize a sua experiência com serviços oficiais certificados pela Pepek Rent a Car. Os valores diários são calculados automaticamente para os {rentalDays} dias.
                </p>
              </div>

              {/* Extra 1: Motorista */}
              <div
                onClick={() => setWithDriver(!withDriver)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  withDriver ? 'bg-amber-50/80 border-[#D2A820] shadow-sm' : 'bg-white border-[#D9DEE7] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    withDriver ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-[#F3F5F8] text-[#07133F]'
                  }`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#07133F] text-sm">Chauffeur / Motorista Profissional</h4>
                    <p className="text-xs text-[#697080] mt-0.5">Motorista bilingue treinado em protocolo diplomático e condução defensiva.</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-[#1E8E5A]">Isenta a necessidade de carta de condução do cliente</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#07133F] block">35.000 Kz/dia</span>
                  <span className="text-[10px] text-[#697080]">{(DRIVER_RATE * rentalDays).toLocaleString('pt-AO')} Kz total</span>
                </div>
              </div>

              {/* Extra 2: Higienização & Combustível */}
              <div
                onClick={() => setWithFuelClean(!withFuelClean)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  withFuelClean ? 'bg-amber-50/80 border-[#D2A820] shadow-sm' : 'bg-white border-[#D9DEE7] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    withFuelClean ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-[#F3F5F8] text-[#07133F]'
                  }`}>
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#07133F] text-sm">Higienização e Combustível Garantido</h4>
                    <p className="text-xs text-[#697080] mt-0.5">Viatura entregue atestada e devolução sem necessidade de reabastecimento ou lavagem.</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#07133F] block">35.000 Kz/dia</span>
                  <span className="text-[10px] text-[#697080]">{(FUEL_CLEAN_RATE * rentalDays).toLocaleString('pt-AO')} Kz total</span>
                </div>
              </div>

              {/* Extra 3: Cadeira de Criança */}
              <div
                onClick={() => setWithBabySeat(!withBabySeat)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  withBabySeat ? 'bg-amber-50/80 border-[#D2A820] shadow-sm' : 'bg-white border-[#D9DEE7] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    withBabySeat ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-[#F3F5F8] text-[#07133F]'
                  }`}>
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#07133F] text-sm">Cadeira Infantil Isofix</h4>
                    <p className="text-xs text-[#697080] mt-0.5">Segurança infantil certificada para recém-nascidos até 12 anos.</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#07133F] block">10.000 Kz/dia</span>
                  <span className="text-[10px] text-[#697080]">{(BABY_SEAT_RATE * rentalDays).toLocaleString('pt-AO')} Kz total</span>
                </div>
              </div>

              {/* Extra 4: Wi-Fi Hotspot */}
              <div
                onClick={() => setWithWifi(!withWifi)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  withWifi ? 'bg-amber-50/80 border-[#D2A820] shadow-sm' : 'bg-white border-[#D9DEE7] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    withWifi ? 'bg-[#020A2A] text-[#D2A820]' : 'bg-[#F3F5F8] text-[#07133F]'
                  }`}>
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#07133F] text-sm">Hotspot Wi-Fi 5G Ilimitado</h4>
                    <p className="text-xs text-[#697080] mt-0.5">Roteador portátil com internet móvel de alta velocidade para até 10 dispositivos.</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#07133F] block">15.000 Kz/dia</span>
                  <span className="text-[10px] text-[#697080]">{(WIFI_RATE * rentalDays).toLocaleString('pt-AO')} Kz total</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              ETAPA 3: DADOS DO CLIENTE
             ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-[#D9DEE7] shadow-xs space-y-5">
              {/* Type Switcher */}
              <div className="flex items-center gap-3 p-1.5 bg-[#F3F5F8] rounded-xl border border-[#D9DEE7]">
                <button
                  type="button"
                  onClick={() => setClientType('particular')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    clientType === 'particular'
                      ? 'bg-[#07133F] text-white shadow-xs'
                      : 'text-[#697080] hover:text-[#07133F]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Particular / Pessoal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClientType('empresa')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    clientType === 'empresa'
                      ? 'bg-[#07133F] text-white shadow-xs'
                      : 'text-[#697080] hover:text-[#07133F]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Empresa / Embaixada / Instituição</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#07133F] uppercase mb-1">
                    {clientType === 'empresa' ? 'Nome da Empresa / Contacto Principal *' : 'Nome Completo *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Ana Luísa Mendes"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#07133F] uppercase mb-1">
                    WhatsApp / Telefone (+244) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +244 923 719 090"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#07133F] uppercase mb-1">
                    Email para Confirmação *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: contacto@empresa.co.ao"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#07133F] uppercase mb-1">
                    NIF / Número de Passaporte (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5418293021"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                  />
                </div>
              </div>

              {/* Conditional Driving License Field */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-[#07133F] uppercase mb-1">
                  Nº da Carta de Condução {withDriver ? '(Opcional — Serviço com Motorista Selecionado)' : '(Obrigatório se condução própria)'}
                </label>
                <input
                  type="text"
                  placeholder={withDriver ? 'Dispensado se condução por motorista Pepek' : 'Ex: LD-98234/AO'}
                  value={driverLicenseNumber}
                  onChange={(e) => setDriverLicenseNumber(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#07133F] uppercase mb-1">
                  Observações ou Requisitos Especiais (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Chegada no voo DT650 da TAAG às 14h, necessito de placa com nome no desembarque..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              ETAPA 4: RESUMO DETALHADO & DESPACHO
             ═══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Summary Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#D9DEE7] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE7]">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedVehicle.primaryImage}
                      alt={selectedVehicle.name}
                      className="w-20 h-14 object-cover rounded-xl border border-gray-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#D2A820] tracking-wider block">
                        {selectedVehicle.categoryLabel}
                      </span>
                      <h4 className="text-base font-extrabold text-[#07133F]">
                        {selectedVehicle.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#697080] block">Diária:</span>
                    <span className="text-sm font-bold text-[#07133F]">{selectedVehicle.pricePerDayFormatted}</span>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2 text-xs text-[#07133F]">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#697080]">Período de Aluguer:</span>
                    <span className="font-semibold">{pickupDate} ({pickupTime}) → {dropoffDate} ({dropoffTime}) · <strong>{rentalDays} {rentalDays === 1 ? 'Dia' : 'Dias'}</strong></span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#697080]">Levantamento & Devolução:</span>
                    <span className="font-semibold text-right max-w-xs truncate">{pickupLocation}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#697080]">Subtotal de Diárias ({rentalDays}x {selectedVehicle.pricePerDayFormatted}):</span>
                    <span className="font-bold">{baseRentalSubtotal.toLocaleString('pt-AO')} Kz</span>
                  </div>

                  {withDriver && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-[#07133F]">
                      <span className="text-[#697080]">Chauffeur / Motorista ({rentalDays} dias):</span>
                      <span className="font-semibold">+{driverSubtotal.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  )}

                  {withFuelClean && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-[#07133F]">
                      <span className="text-[#697080]">Higienização & Combustível ({rentalDays} dias):</span>
                      <span className="font-semibold">+{fuelCleanSubtotal.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  )}

                  {withBabySeat && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-[#07133F]">
                      <span className="text-[#697080]">Cadeira Infantil ({rentalDays} dias):</span>
                      <span className="font-semibold">+{babySeatSubtotal.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  )}

                  {withWifi && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-[#07133F]">
                      <span className="text-[#697080]">Wi-Fi 5G Hotspot ({rentalDays} dias):</span>
                      <span className="font-semibold">+{wifiSubtotal.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  )}
                </div>

                {/* Total Highlight */}
                <div className="pt-3 border-t-2 border-[#07133F] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#697080] font-bold uppercase tracking-wider block">Total Estimado da Reserva:</span>
                    <span className="text-[11px] text-[#1E8E5A] font-semibold">Inclui Seguro Total VIP e Apoio 24h</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#07133F]">
                      {grandTotalAOA.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-[#020A2A] text-white p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#D2A820] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Envio Imediato para a Central Oficial
                  </h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Ao confirmar, a sua proposta é despachada diretamente para a equipa executiva via WhatsApp para emissão imediata da fatura proforma.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppSubmission}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer"
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>Confirmar & Enviar WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white px-6 py-4 border-t border-[#D9DEE7] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-[#07133F] hover:bg-gray-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="px-6 py-2.5 rounded-xl bg-[#D2A820] hover:bg-[#E1BB38] text-[#020A2A] text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Avançar para Etapa {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleWhatsAppSubmission}
                className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Finalizar no WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
