import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Info,
  Loader2,
  CheckCircle2,
  Copy,
  FileText,
  Pause,
  Play
} from 'lucide-react';
import type { VehicleDetail } from '../../data/fleetData';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { getVehicleStudioBackground } from '../../data/fleetPresentation';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { submitReservation } from '../../lib/reservations';
import { useAuth } from '../../context/AuthContext';
import { useFleetText } from '../../i18n/fleetContent';

// Valores das opções de local ficam em português (seguem para a reserva); só o rótulo é traduzido.
const LOCATION_KEYS: Record<string, string> = {
  'Aeroporto Internacional 4 de Fevereiro (LAD)': 'airport',
  'Aeroporto Internacional Dr. António Agostinho Neto (AIAAN)': 'aiaan',
  'Hub Central Pepek Talatona': 'hub',
  'Hotel Epic Sana Luanda': 'epicSana',
  'Miramar / Cidade Alta (Protocolar)': 'miramarCidadeAlta',
  'Entrega em Endereço Personalizado': 'customDelivery',
  'Recolha em Endereço do Cliente': 'clientPickup',
};

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
  const { t } = useTranslation();
  const ft = useFleetText();
  const locationLabel = (value: string) => (LOCATION_KEYS[value] ? t(`wizard.locations.${LOCATION_KEYS[value]}`) : value);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { setIsPortalOpen } = useAuth();

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [protocolCode, setProtocolCode] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    const found = PUBLIC_FLEET.find(
      (v) => v.name.toLowerCase() === (initialVehicleName || '').toLowerCase()
    );
    return found ? found.id : PUBLIC_FLEET[0].id;
  });

  const [pickupLocation, setPickupLocation] = useState('Aeroporto Internacional 4 de Fevereiro (LAD)');
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [dropoffLocation, setDropoffLocation] = useState('Hub Central Pepek Talatona');
  
  // Dates default: tomorrow and 3 days later
  const today = new Date().toISOString().split('T')[0];
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
  const [notes, setNotes] = useState('');

  // Sync selected vehicle if prop updates
  React.useEffect(() => {
    if (initialVehicleName) {
      const found = PUBLIC_FLEET.find(
        (v) => v.name.toLowerCase() === initialVehicleName.toLowerCase()
      );
      if (found) {
        setSelectedVehicleId(found.id);
      }
    }
  }, [initialVehicleName]);

  const selectedVehicle = useMemo(() => {
    return PUBLIC_FLEET.find((v) => v.id === selectedVehicleId) || PUBLIC_FLEET[0];
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

  const copyProtocol = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleAdvanceFromStep3 = () => {
    if (!fullName.trim() || fullName.trim().length < 3) {
      setStep3Error(t('wizard.errorName'));
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setStep3Error(t('wizard.errorContact'));
      return;
    }
    setStep3Error(null);
    setStep(4);
  };

  const buildWhatsAppUrl = (code?: string) => {
    // Resumo no mesmo formato do e-mail "Nova Reserva Recebida". Sem emojis:
    // alguns telemóveis mostravam-nos como "�" na mensagem pré-preenchida.
    // Formato AOA 35.000,00 (ponto nos milhares, vírgula nos cêntimos).
    const kz = (value: number) => `AOA ${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const optionalExtras = [
      withBabySeat ? `${t('wizard.wa.babySeat')} (+${kz(babySeatSubtotal)})` : '',
      withWifi ? `Wi-Fi 5G (+${kz(wifiSubtotal)})` : '',
    ].filter(Boolean);
    const divider = '------------------------------\n';

    const w = (key: string) => t(`wizard.wa.${key}`);
    const notInformed = w('notInformed');
    let msg = `*${w('title')}*\n` + divider;
    if (code) {
      msg += `*${w('booking')}:* ${code}\n` + divider;
    }
    msg += `*${w('name')}:* ${fullName.trim() || notInformed}\n` +
      `*${w('clientType')}:* ${clientType === 'empresa' ? w('company') : w('private')}\n` +
      `*${w('phone')}:* ${phone.trim() || notInformed}\n` +
      `*E-mail:* ${email.trim() || notInformed}\n` +
      divider +
      `*${w('vehicle')}:* ${selectedVehicle.name} (${kz(selectedVehicle.pricePerDayAOA)}${t('vehicle.perDay').replace(' ', '')})\n` +
      `*${w('driver')}:* ${withDriver ? `${w('yes')} (+${kz(driverSubtotal)})` : w('no')}\n` +
      `*${w('fuelClean')}:* ${withFuelClean ? `${w('yes')} (+${kz(fuelCleanSubtotal)})` : w('no')}\n` +
      `${optionalExtras.length ? `*${w('otherExtras')}:* ${optionalExtras.join(', ')}\n` : ''}` +
      `*Check-in:* ${t('wizard.wa.dateAt', { date: pickupDate, time: pickupTime })}\n` +
      `*Check-out:* ${t('wizard.wa.dateAt', { date: dropoffDate, time: dropoffTime })} (${t('wizard.days', { count: rentalDays })})\n` +
      `*${w('pickup')}:* ${pickupLocation}\n` +
      `*${w('dropoff')}:* ${differentDropoff ? dropoffLocation : pickupLocation}\n` +
      `*${w('message')}:* ${notes.trim() || '—'}\n` +
      divider +
      `*${w('total')}:* ${kz(grandTotalAOA)}\n` +
      divider +
      `_${w('closing')}_`;

    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const handleSubmitReservation = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const receipt = await submitReservation({
        service: withDriver ? 'executive' : 'rent-a-car',
        location: 'Luanda',
        destination: differentDropoff ? `${pickupLocation} ➔ ${dropoffLocation}` : pickupLocation,
        startDate: `${pickupDate} ${pickupTime}`,
        endDate: `${dropoffDate} ${dropoffTime}`,
        vehicleCategory: `${selectedVehicle.name} (${selectedVehicle.categoryLabel})`,
        withDriver,
        clientName: fullName.trim() || 'Cliente Frota',
        clientPhone: phone.trim(),
        clientEmail: email.trim() || undefined,
        companyName: clientType === 'empresa' ? (notes ? notes.slice(0, 100) : 'Empresa') : undefined,
        notes: [
          notes ? `Notas: ${notes.trim()}` : '',
          withFuelClean ? 'Extra: Higienização e Combustível' : '',
          withBabySeat ? 'Extra: Cadeira de Criança' : '',
          withWifi ? 'Extra: Wi-Fi 5G' : '',
          `Total Estimado: ${grandTotalAOA.toLocaleString('pt-AO')} Kz`,
        ].filter(Boolean).join(' | '),
        status: 'pending',
        source: 'fleet_wizard_modal',
      });

      setProtocolCode(receipt.protocolCode);
      setIsConfirmed(true);
      setCountdown(10);
      setIsCountdownPaused(false);
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : t('wizard.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppImmediately = () => {
    setCountdown(null);
    const whatsappUrl = buildWhatsAppUrl(protocolCode || undefined);
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (!isConfirmed || countdown === null || isCountdownPaused) return;

    if (countdown <= 0) {
      const whatsappUrl = buildWhatsAppUrl(protocolCode || undefined);
      window.open(whatsappUrl, '_blank');
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isConfirmed, countdown, isCountdownPaused, protocolCode]);

  const handleModalClose = () => {
    setCountdown(null);
    setIsCountdownPaused(false);
    onClose();
  };

  // Depois de todos os hooks: sair mais cedo antes do useEffect acima quebrava o React (#310).
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#09172C]/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={handleModalClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto border border-[#E2E8F0] animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#09172C] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FEC228] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FEC228]">
                {t('wizard.onlineBooking')}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {t('wizard.title')}
            </h3>
          </div>

          <button
            onClick={handleModalClose}
            aria-label={t('wizard.close')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {!isConfirmed ? (
          <div className="bg-[#09172C] px-6 py-3 border-b border-white/10 shrink-0">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                  step === 1
                    ? 'bg-[#FEC228] text-[#09172C] font-bold shadow-md'
                    : step > 1
                    ? 'text-white/80 hover:text-white'
                    : 'text-white/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  step === 1 ? 'bg-[#09172C] text-[#FEC228]' : 'bg-white/20 text-white'
                }`}>1</span>
                <span className="hidden sm:inline">{t('wizard.stepVehicle')}</span>
                <span className="sm:hidden">{t('wizard.stepVehicleShort')}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                  step === 2
                    ? 'bg-[#FEC228] text-[#09172C] font-bold shadow-md'
                    : step > 2
                    ? 'text-white/80 hover:text-white'
                    : 'text-white/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  step === 2 ? 'bg-[#09172C] text-[#FEC228]' : 'bg-white/20 text-white'
                }`}>2</span>
                <span className="hidden sm:inline">{t('wizard.stepExtras')}</span>
                <span className="sm:hidden">{t('wizard.stepExtrasShort')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (step > 3) setStep(3);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                  step === 3
                    ? 'bg-[#FEC228] text-[#09172C] font-bold shadow-md'
                    : step > 3
                    ? 'text-white/80 hover:text-white'
                    : 'text-white/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  step === 3 ? 'bg-[#09172C] text-[#FEC228]' : 'bg-white/20 text-white'
                }`}>3</span>
                <span className="hidden sm:inline">{t('wizard.stepClient')}</span>
                <span className="sm:hidden">{t('wizard.stepClientShort')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (step === 3) handleAdvanceFromStep3();
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                  step === 4
                    ? 'bg-[#FEC228] text-[#09172C] font-bold shadow-md'
                    : 'text-white/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  step === 4 ? 'bg-[#09172C] text-[#FEC228]' : 'bg-white/20 text-white'
                }`}>4</span>
                <span className="hidden sm:inline">{t('wizard.stepSummary')}</span>
                <span className="sm:hidden">{t('wizard.stepSummaryShort')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#09172C] px-6 py-3 border-b border-white/10 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">{t('wizard.registered')}</span>
            </div>
            {protocolCode && (
              <span className="font-mono text-xs text-[#FEC228] font-bold">{protocolCode}</span>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F5F6F6]">
          {/* ═══════════════════════════════════════════════════════
              ETAPA 1: VIATURA E PERÍODO
             ═══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Select Vehicle Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <label className="block text-xs font-bold text-[#09172C] uppercase tracking-wider mb-2">
                  {t('wizard.selectVehicle')}
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#09172C] focus:ring-2 focus:ring-[#FEC228] focus:border-transparent outline-hidden"
                >
                  {PUBLIC_FLEET.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {ft(v.categoryLabel)} ({v.pricePerDayFormatted}{t('vehicle.perDay').replace(' ', '')})
                    </option>
                  ))}
                </select>

                {/* Quick Vehicle Highlight */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#174B86] border border-[#236199]/55 text-white">
                  <div className="w-32 h-20 rounded-lg shrink-0 border border-white/10 bg-cover bg-center p-2" style={{ backgroundImage: `url('${getVehicleStudioBackground(selectedVehicle)}')` }}>
                    <img src={selectedVehicle.primaryImage} alt={selectedVehicle.name} className="h-full w-full object-contain drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-extrabold text-white text-base">{selectedVehicle.name}</h4>
                    <p className="text-xs text-white/75">{t('comparator.passengers', { count: selectedVehicle.specs.passengers })} · {t('vehicle.doorsCount', { count: selectedVehicle.specs.doors })} · {ft(selectedVehicle.specs.transmission)} · {ft(selectedVehicle.specs.fuelType)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold text-[#FEC228] block">{selectedVehicle.pricePerDayFormatted}</span>
                    <span className="text-[10px] text-white/65 font-semibold uppercase">{t('wizard.perDay')}</span>
                  </div>
                </div>
              </div>

              {/* Pickup & Dropoff Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
                  <label className="block text-xs font-bold text-[#09172C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FEC228]" />
                    {t('wizard.pickupLocation')}
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden"
                  >
                    <option value="Aeroporto Internacional 4 de Fevereiro (LAD)">{t('wizard.locations.airport')}</option>
                    <option value="Aeroporto Internacional Dr. António Agostinho Neto (AIAAN)">{t('wizard.locations.aiaan')}</option>
                    <option value="Hub Central Pepek Talatona">{t('wizard.locations.hub')}</option>
                    <option value="Hotel Epic Sana Luanda">{t('wizard.locations.epicSana')}</option>
                    <option value="Miramar / Cidade Alta (Protocolar)">{t('wizard.locations.miramarCidadeAlta')}</option>
                    <option value="Entrega em Endereço Personalizado">{t('wizard.locations.customDelivery')}</option>
                  </select>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#09172C] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#236199]" />
                      {t('wizard.dropoffLocation')}
                    </label>
                    <label className="text-[11px] text-[#555B64] flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={differentDropoff}
                        onChange={(e) => setDifferentDropoff(e.target.checked)}
                        className="rounded text-[#FEC228]"
                      />
                      <span>{t('wizard.elsewhere')}</span>
                    </label>
                  </div>

                  {differentDropoff ? (
                    <select
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden"
                    >
                      <option value="Hub Central Pepek Talatona">{t('wizard.locations.hub')}</option>
                      <option value="Aeroporto Internacional 4 de Fevereiro (LAD)">{t('wizard.locations.airport')}</option>
                      <option value="Aeroporto Internacional Dr. António Agostinho Neto (AIAAN)">{t('wizard.locations.aiaan')}</option>
                      <option value="Hotel Epic Sana Luanda">{t('wizard.locations.epicSana')}</option>
                      <option value="Recolha em Endereço do Cliente">{t('wizard.locations.clientPickup')}</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs text-[#555B64]">
                      {t('wizard.sameAsPickup', { location: locationLabel(pickupLocation).split('(')[0].trim() })}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates and Times */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#09172C] uppercase mb-1">{t('wizard.pickupDate')}</label>
                    <input
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value);
                        if (dropoffDate < e.target.value) {
                          setDropoffDate(e.target.value);
                        }
                      }}
                      className="w-full p-2.5 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#09172C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#09172C] uppercase mb-1">{t('wizard.pickupTime')}</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#09172C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#09172C] uppercase mb-1">{t('wizard.dropoffDate')}</label>
                    <input
                      type="date"
                      min={pickupDate || today}
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#09172C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#09172C] uppercase mb-1">{t('wizard.dropoffTime')}</label>
                    <input
                      type="time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#09172C]"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#09172C] pt-3 border-t border-gray-100">
                  <span className="font-bold">{t('wizard.duration')}</span>
                  <span className="px-3 py-1 bg-[#FEC228]/20 text-[#09172C] font-extrabold rounded-full">
                    {t('wizard.daysCapital', { count: rentalDays })}
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
                <Info className="w-5 h-5 text-[#09172C] shrink-0 mt-0.5" />
                <p className="text-xs text-[#09172C]">
                  {t('wizard.extrasIntro', { count: rentalDays })}
                </p>
              </div>

              {/* Opções obrigatórias: com ou sem motorista / com ou sem combustível e higienização */}
              {([
                {
                  key: 'driver',
                  icon: UserCheck,
                  title: t('wizard.driverTitle'),
                  desc: t('wizard.driverDesc'),
                  withLabel: t('wizard.withDriver'),
                  withoutLabel: t('wizard.withoutDriver'),
                  value: withDriver,
                  set: setWithDriver,
                  rate: DRIVER_RATE,
                },
                {
                  key: 'fuel-clean',
                  icon: Fuel,
                  title: t('wizard.fuelTitle'),
                  desc: t('wizard.fuelDesc'),
                  withLabel: t('wizard.withFuel'),
                  withoutLabel: t('wizard.withoutFuel'),
                  value: withFuelClean,
                  set: setWithFuelClean,
                  rate: FUEL_CLEAN_RATE,
                },
              ] as const).map(({ key, icon: Icon, title, desc, withLabel, withoutLabel, value, set, rate }) => (
                <fieldset key={key} className="p-5 rounded-2xl border border-[#E2E8F0] bg-white">
                  <legend className="sr-only">{title}</legend>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#F5F6F6] text-[#09172C]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#09172C] text-sm">{title}</h4>
                        <p className="text-xs text-[#555B64] mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-[#09172C] block">AOA {rate.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                      <span className="text-[10px] text-[#555B64]">{t('wizard.perDay')}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: withoutLabel, active: !value, onSelect: () => set(false), extra: t('wizard.noExtraCost') },
                      { label: withLabel, active: value, onSelect: () => set(true), extra: `+${(rate * rentalDays).toLocaleString('pt-AO')} Kz (${t('wizard.days', { count: rentalDays })})` },
                    ].map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        aria-pressed={option.active}
                        onClick={option.onSelect}
                        className={`px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                          option.active ? 'bg-[#FEC228]/80 border-[#FEC228] shadow-sm' : 'bg-white border-[#E2E8F0] hover:border-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-xs font-extrabold text-[#09172C]">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${option.active ? 'border-[#09172C]' : 'border-gray-300'}`}>
                            {option.active && <span className="w-2 h-2 rounded-full bg-[#09172C]" />}
                          </span>
                          {option.label}
                        </span>
                        <span className="block mt-1 pl-6 text-[10px] text-[#555B64]">{option.extra}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}

              {/* Extra 3: Cadeira de Criança */}
              <div
                onClick={() => setWithBabySeat(!withBabySeat)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  withBabySeat ? 'bg-[#FEC228]/80 border-[#FEC228] shadow-sm' : 'bg-white border-[#E2E8F0] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    withBabySeat ? 'bg-[#09172C] text-[#FEC228]' : 'bg-[#F5F6F6] text-[#09172C]'
                  }`}>
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#09172C] text-sm">{t('wizard.babySeatTitle')}</h4>
                    <p className="text-xs text-[#555B64] mt-0.5">{t('wizard.babySeatDesc')}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#09172C] block">{t('wizard.babySeatRate')}</span>
                  <span className="text-[10px] text-[#555B64]">{(BABY_SEAT_RATE * rentalDays).toLocaleString('pt-AO')} Kz {t('wizard.total')}</span>
                </div>
              </div>

              {/* Extra 4: Wi-Fi Hotspot */}
              <div
                onClick={() => setWithWifi(!withWifi)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  withWifi ? 'bg-[#FEC228]/80 border-[#FEC228] shadow-sm' : 'bg-white border-[#E2E8F0] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    withWifi ? 'bg-[#09172C] text-[#FEC228]' : 'bg-[#F5F6F6] text-[#09172C]'
                  }`}>
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#09172C] text-sm">{t('wizard.wifiTitle')}</h4>
                    <p className="text-xs text-[#555B64] mt-0.5">{t('wizard.wifiDesc')}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#09172C] block">{t('wizard.wifiRate')}</span>
                  <span className="text-[10px] text-[#555B64]">{(WIFI_RATE * rentalDays).toLocaleString('pt-AO')} Kz {t('wizard.total')}</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              ETAPA 3: DADOS DO CLIENTE
             ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
              {/* Type Switcher */}
              <div className="flex items-center gap-3 p-1.5 bg-[#F5F6F6] rounded-xl border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setClientType('particular')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    clientType === 'particular'
                      ? 'bg-[#09172C] text-white shadow-xs'
                      : 'text-[#555B64] hover:text-[#09172C]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t('wizard.private')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClientType('empresa')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    clientType === 'empresa'
                      ? 'bg-[#09172C] text-white shadow-xs'
                      : 'text-[#555B64] hover:text-[#09172C]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('wizard.companyType')}</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#09172C] uppercase mb-1">
                    {clientType === 'empresa' ? t('wizard.companyName') : t('wizard.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('wizard.namePlaceholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#09172C] uppercase mb-1">
                    {t('wizard.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t('wizard.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#09172C] uppercase mb-1">
                    {t('wizard.emailLabel')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t('wizard.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                  />
                </div>
              </div>

              {step3Error && (
                <div role="alert" className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-[#09172C] text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{step3Error}</span>
                </div>
              )}

              <p className="rounded-xl border border-[#236199]/20 bg-[#236199]/5 p-3 text-[11px] leading-relaxed text-[#09172C]">
                {t('wizard.documentsNotice')}
              </p>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#09172C] uppercase mb-1">
                  {t('wizard.notesLabel')}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('wizard.notesPlaceholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              ETAPA 4: RESUMO DETALHADO & CONFIRMAÇÃO
             ═══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Summary Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 rounded-xl border border-gray-200 bg-cover bg-center p-1.5" style={{ backgroundImage: `url('${getVehicleStudioBackground(selectedVehicle)}')` }}>
                      <img src={selectedVehicle.primaryImage} alt={selectedVehicle.name} className="h-full w-full object-contain drop-shadow-sm" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#FEC228] tracking-wider block">
                        {ft(selectedVehicle.categoryLabel)}
                      </span>
                      <h4 className="text-base font-extrabold text-[#09172C]">
                        {selectedVehicle.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#555B64] block">{t('wizard.dailyRate')}</span>
                    <span className="text-sm font-bold text-[#09172C]">{selectedVehicle.pricePerDayFormatted}</span>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2 text-xs text-[#09172C]">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#555B64]">{t('wizard.rentalPeriod')}</span>
                    <span className="font-semibold">{pickupDate} ({pickupTime}) → {dropoffDate} ({dropoffTime}) · <strong>{t('wizard.daysCapital', { count: rentalDays })}</strong></span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#555B64]">{t('wizard.pickupDropoff')}</span>
                    <span className="font-semibold text-right max-w-xs truncate">{pickupLocation}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#555B64]">{t('wizard.dailySubtotal', { count: rentalDays, price: selectedVehicle.pricePerDayFormatted })}</span>
                    <span className="font-bold">{baseRentalSubtotal.toLocaleString('pt-AO')} Kz</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100 text-[#09172C]">
                    <span className="text-[#555B64]">{t('wizard.driverLabel')}</span>
                    <span className="font-semibold">{withDriver ? `${t('wizard.wa.yes')} · +${driverSubtotal.toLocaleString('pt-AO')} Kz (${t('wizard.days', { count: rentalDays })})` : t('wizard.wa.no')}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100 text-[#09172C]">
                    <span className="text-[#555B64]">{t('wizard.fuelCleanLabel')}</span>
                    <span className="font-semibold">{withFuelClean ? `${t('wizard.wa.yes')} · +${fuelCleanSubtotal.toLocaleString('pt-AO')} Kz (${t('wizard.days', { count: rentalDays })})` : t('wizard.wa.no')}</span>
                  </div>

                  {withBabySeat && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-[#09172C]">
                      <span className="text-[#555B64]">{t('wizard.babySeatSummary', { count: rentalDays })}</span>
                      <span className="font-semibold">+{babySeatSubtotal.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  )}

                  {withWifi && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-[#09172C]">
                      <span className="text-[#555B64]">{t('wizard.wifiSummary', { count: rentalDays })}</span>
                      <span className="font-semibold">+{wifiSubtotal.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  )}
                </div>

                {/* Total Highlight */}
                <div className="pt-3 border-t-2 border-[#09172C] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#555B64] font-bold uppercase tracking-wider block">{t('wizard.estimatedTotal')}</span>
                    <span className="text-[11px] text-[#236199] font-semibold">{t('wizard.insurance')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#09172C]">
                      {grandTotalAOA.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                </div>
              </div>

              {submissionError && (
                <div role="alert" className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Action Banner */}
              <div className="bg-[#09172C] text-white p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#FEC228] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {t('wizard.instantSend')}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1">
                    {t('wizard.instantSendText')}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitReservation}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#236199] hover:bg-[#0C2E60] text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FEC228]" />
                      <span>{t('wizard.registeringProtocol')}</span>
                    </>
                  ) : (
                    <>
                      <MessageSquareText className="w-4 h-4" />
                      <span>{t('wizard.confirmWhatsapp')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              ETAPA DE SUCESSO: DOSSIÊ E PROTOCOLO CONFIRMADOS
             ═══════════════════════════════════════════════════════ */}
          {isConfirmed && (
            <div className="py-4 px-1 space-y-6 text-center animate-fadeIn">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FEC228] block mb-1">
                  {t('wizard.operationsDirectorate')}
                </span>
                <h3 className="text-2xl font-extrabold text-[#09172C]">
                  {t('wizard.successTitle')}
                </h3>
                <p className="text-xs text-[#555B64] mt-1 max-w-md mx-auto">
                  {t('wizard.successText')}
                </p>
              </div>

              {/* Protocol Card */}
              <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white border-2 border-[#236199] shadow-md text-left space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-[11px] font-bold uppercase text-gray-500">{t('wizard.bookingLabel')}</span>
                  <button
                    type="button"
                    onClick={() => copyProtocol(protocolCode || '')}
                    className="flex items-center gap-1 text-xs text-[#236199] font-bold hover:underline cursor-pointer"
                  >
                    {copiedProtocol ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">{t('wizard.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('wizard.copyCode')}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-mono text-2xl font-black text-[#09172C] tracking-wide text-center py-1 bg-gray-50 rounded-xl border border-gray-200">
                  {protocolCode}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                  <div>{t('wizard.vehicleLabel')} <strong className="text-gray-900 block">{selectedVehicle.name}</strong></div>
                  <div>{t('wizard.periodLabel')} <strong className="text-gray-900 block">{t('wizard.daysCapital', { count: rentalDays })} ({t('wizard.dateRange', { start: pickupDate, end: dropoffDate })})</strong></div>
                  <div>{t('wizard.pickupLabel')} <strong className="text-gray-900 block truncate">{pickupLocation}</strong></div>
                  <div>{t('wizard.totalLabel')} <strong className="text-[#09172C] block font-bold">{grandTotalAOA.toLocaleString('pt-AO')} Kz</strong></div>
                </div>
              </div>

              {/* Countdown / Transition Banner */}
              {countdown !== null && (
                <div className="max-w-lg mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 text-emerald-700 ${!isCountdownPaused ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                      <span className="text-xs font-bold text-emerald-950">
                        {isCountdownPaused ? (
                          t('wizard.countdownPaused')
                        ) : (
                          <>{t('wizard.countdownOpening')} <strong className="text-sm font-extrabold text-emerald-700 font-mono">{countdown}s</strong>...</>
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCountdownPaused((prev) => !prev)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 flex items-center gap-1 transition cursor-pointer"
                    >
                      {isCountdownPaused ? (
                        <>
                          <Play className="w-3 h-3" />
                          <span>{t('wizard.resume')}</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>{t('wizard.pause')}</span>
                        </>
                      )}
                    </button>
                  </div>
                  {!isCountdownPaused && (
                    <div className="w-full bg-emerald-200/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${(countdown / 10) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppImmediately}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>{t('wizard.openWhatsappNow')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCountdown(null);
                    onClose();
                    setIsPortalOpen(true);
                  }}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#09172C] hover:bg-[#236199] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#FEC228]" />
                  <span>{t('wizard.clientArea')}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmed(false);
                    setProtocolCode(null);
                    setStep(1);
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  {t('wizard.anotherBooking')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
          {isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-[#09172C] hover:bg-gray-100 text-xs font-bold cursor-pointer"
              >
                {t('wizard.finishClose')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsPortalOpen(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#09172C] hover:bg-[#236199] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FEC228]" />
                <span>{t('wizard.portalInvoices')}</span>
              </button>
            </>
          ) : (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#09172C] hover:bg-gray-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('wizard.back')}</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 3) {
                        handleAdvanceFromStep3();
                      } else {
                        setStep((prev) => (prev + 1) as any);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#FEC228] hover:bg-[#FFD45F] text-[#09172C] text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>{t('wizard.nextStep', { step: step + 1 })}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitReservation}
                    className="px-6 py-2.5 rounded-xl bg-[#236199] hover:bg-[#0C2E60] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#FEC228]" />
                        <span>{t('wizard.registering')}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t('wizard.confirmBooking')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
