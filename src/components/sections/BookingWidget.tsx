import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
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
  FileText,
  Shield,
  Plane,
  Briefcase,
  Users,
  Lock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import { submitReservation } from '../../lib/reservations';
import { generateWhatsAppBookingUrl, OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { askPepekExecutiveAI } from '../../lib/ai';
import { BookingData } from '../../types';
import type { VehicleDetail } from '../../data/fleetData';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { getFleetCarouselScale, getVehicleStudioBackground } from '../../data/fleetPresentation';
import { useAuth } from '../../context/AuthContext';

interface BookingWidgetProps {
  initialVehicle?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ initialVehicle }) => {
  const { t, i18n } = useTranslation();
  const { isDemoMode, setIsPortalOpen } = useAuth();
  const [searchParams] = useSearchParams();

  // 1. Service Types as Rich Interactive Cards
  const servicesList = [
    {
      id: 'rent-a-car',
      title: t('booking.serviceRent'),
      subtitle: t('booking.serviceRentSubtitle'),
      icon: <Car className="w-6 h-6" />,
      badge: t('booking.serviceRentBadge')
    },
    {
      id: 'executive',
      title: t('booking.serviceExec'),
      subtitle: t('booking.serviceExecSubtitle'),
      icon: <UserCheck className="w-6 h-6" />,
      badge: t('booking.serviceExecBadge')
    },
    {
      id: 'transfer',
      title: t('booking.serviceTransfer'),
      subtitle: t('booking.serviceTransferSubtitle'),
      icon: <Plane className="w-6 h-6" />,
      badge: t('booking.serviceTransferBadge')
    },
    {
      id: 'corporate',
      title: t('booking.serviceCorp'),
      subtitle: t('booking.serviceCorpSubtitle'),
      icon: <Building2 className="w-6 h-6" />,
      badge: t('booking.serviceCorpBadge')
    }
  ];

  // Vehicle catalog sourced from the official 2026 flyers.
  // Show a curated selection of 8 top vehicles spanning different categories
  const topVehicles = PUBLIC_FLEET.filter(v =>
    ['rangerover-blindado-2025', 'mercedes-class-s-2025', 'toyota-lc300-2023', 'new-toyota-prado',
     'toyota-hilux', 'mercedes-benz-v300-class', 'hyundai-tucson', 'suzuki-swift'].includes(v.id)
  );
  const vehicleCatalog = topVehicles.length >= 5 ? topVehicles : PUBLIC_FLEET.slice(0, 8);

  // State Management
  const [selectedService, setSelectedService] = useState('rent-a-car');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetail>(vehicleCatalog[0] || PUBLIC_FLEET[0]);
  const [pickupLocation, setPickupLocation] = useState(() => searchParams.get('pickup') || 'Luanda — Sede Talatona / Aeroporto 4 de Fevereiro');
  const [startDate, setStartDate] = useState(() => searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(() => searchParams.get('endDate') || '');
  const [withDriver, setWithDriver] = useState(true);
  const vehicleCarouselRef = useRef<HTMLDivElement>(null);

  const moveVehicleCarousel = (direction: -1 | 1) => {
    const carousel = vehicleCarouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.querySelector<HTMLElement>('[data-vehicle-card]');
    const distance = (firstCard?.offsetWidth ?? 260) + 12;
    carousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  // Synchronize preselected vehicle from URL query param ?viatura=... or initialVehicle prop
  useEffect(() => {
    const urlVehicle = searchParams.get('viatura') || initialVehicle;
    if (urlVehicle) {
      const match = PUBLIC_FLEET.find(
        (v) =>
          v.name.toLowerCase().includes(urlVehicle.toLowerCase()) ||
          urlVehicle.toLowerCase().includes(v.name.toLowerCase()) ||
          v.id.toLowerCase().includes(urlVehicle.toLowerCase())
      );
      if (match) {
        setSelectedVehicle(match);
      }
    }
  }, [searchParams, initialVehicle]);

  // Client Authentication / Accreditation State (Email or Phone)
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [clientIdentifier, setClientIdentifier] = useState('');
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState(() => {
    const destination = searchParams.get('destination');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    return destination ? `Destino: ${destination}${startTime ? ` | Levantamento: ${startTime}` : ''}${endTime ? ` | Devolução: ${endTime}` : ''}` : '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Processing & Official Directorate Dossier State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [directorateDossier, setDirectorateDossier] = useState<{
    protocolCode: string;
    submissionDate: string;
    authStatus: string;
    summary: string;
  } | null>(null);

  // Proactive AI Technical Assistant State
  const [aiHelperOpen, setAiHelperOpen] = useState(false);
  const [customVehicleRequest, setCustomVehicleRequest] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiConsult = async (textToAsk?: string) => {
    const query = textToAsk || customVehicleRequest;
    if (!query.trim()) return;
    setAiLoading(true);
    try {
      const res = await askPepekExecutiveAI(query, []);
      setAiResponse(res.message);
      if (res.recommendedVehicle) {
        const found = PUBLIC_FLEET.find(v => v.name.toLowerCase().includes(res.recommendedVehicle!.toLowerCase()));
        if (found) setSelectedVehicle(found);
      }
    } catch {
      setAiResponse(t('booking.aiFallback'));
    } finally {
      setAiLoading(false);
    }
  };

  // Quick Instant Login / Accreditation
  const handleQuickAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientIdentifier.trim() && clientName.trim()) {
      setIsAuthenticated(true);
    }
  };

  // Submit Official Requisition to Directorate
  const handleGenerateOfficialDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    const bookingPayload: BookingData = {
      service: selectedService as any,
      location: 'Luanda',
      destination: pickupLocation,
      startDate,
      endDate,
      vehicleCategory: selectedVehicle.name,
      withDriver,
      clientName,
      clientPhone: loginMethod === 'phone' ? clientIdentifier : '',
      clientEmail: loginMethod === 'email' ? clientIdentifier : '',
      companyName,
      notes: notes,
      status: 'pending',
      source: 'web_booking_widget',
      createdAt: new Date().toISOString()
    };

    try {
      const receipt = await submitReservation(bookingPayload);
      setDirectorateDossier({
        protocolCode: receipt.protocolCode,
        submissionDate: new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'en' ? 'en-GB' : 'pt-AO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        authStatus: t('booking.submittedStatus'),
        summary: t('booking.dossierSummary', { code: receipt.protocolCode, vehicle: selectedVehicle.name })
      });
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : t('booking.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDossierUrl = directorateDossier
    ? generateWhatsAppBookingUrl({
        service: selectedService as any,
        location: 'Luanda',
        destination: pickupLocation,
        vehicleCategory: selectedVehicle.name,
        startDate,
        endDate,
        withDriver,
        clientName,
        clientPhone: loginMethod === 'phone' ? clientIdentifier : '',
        clientEmail: loginMethod === 'email' ? clientIdentifier : '',
        companyName,
        notes: t('booking.whatsappNote', {
          code: directorateDossier.protocolCode,
          method: loginMethod === 'phone' ? t('booking.byPhone') : t('booking.byEmail'),
          identifier: clientIdentifier,
        })
      })
    : '';

  return (
    <section id="reserva" className="section-padding bg-[#F5F6F6] relative border-b border-[#E2E8F0]">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09172C] text-[#FEC228] text-xs font-bold uppercase tracking-wider mb-3.5 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>{t('booking.systemLabel')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#09172C] tracking-tight mb-4">
            {t('booking.flowTitle')}
          </h2>

          <p className="text-sm sm:text-base text-[#555B64] leading-relaxed">
            {t('booking.flowSubtitle')}
          </p>
        </div>

        {!directorateDossier ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Interactive Visual Simulator & Vehicle Spotlight */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Interactive Visual Service Cards */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#09172C] mb-4">
                  {t('booking.serviceStep')}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {servicesList.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        selectedService === srv.id
                          ? 'border-[#FEC228] bg-[#FEC228]/40 shadow-md ring-2 ring-[#FEC228]/20'
                          : 'border-[#E2E8F0] hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selectedService === srv.id ? 'bg-[#09172C] text-[#FEC228]' : 'bg-[#F5F6F6] text-[#09172C]'}`}>
                        {srv.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#09172C]">{srv.title}</h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FEC228] text-[#09172C]">
                            {srv.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#555B64] mt-1">{srv.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Visual Vehicle Gallery with Focus Spotlight */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#09172C]">
                      {t('booking.vehicleStep')}
                    </label>
                    <p className="text-xs text-[#555B64]">{t('booking.vehicleHint')}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiHelperOpen(!aiHelperOpen)}
                    className="text-xs font-bold text-[#FEC228] bg-[#09172C] px-3 py-1.5 rounded-xl border border-[#FEC228]/30 hover:bg-[#09172C]/90 flex items-center gap-1.5 w-fit cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FEC228]" />
                    <span>{t('booking.aiButton')}</span>
                  </button>
                </div>

                {/* AI Proactive Recommender Drawer */}
                {aiHelperOpen && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FEC228] to-[#FEC228] border border-[#FEC228]/30 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#09172C] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#FEC228]" />
                        <span>{t('booking.aiTitle')}</span>
                      </span>
                      <button onClick={() => setAiHelperOpen(false)} className="text-[#555B64] hover:text-[#09172C] font-bold">✕</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAiConsult(t('booking.aiProvince'))}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#09172C] font-semibold hover:bg-gray-50"
                      >
                        📍 {t('booking.aiProvince')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult(t('booking.aiSpecial'))}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#09172C] font-semibold hover:bg-gray-50"
                      >
                        🛡️ {t('booking.aiSpecial')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult(t('booking.aiEconomy'))}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#09172C] font-semibold hover:bg-gray-50"
                      >
                        💰 {t('booking.aiEconomy')}
                      </button>
                    </div>

                    {aiLoading && <p className="text-[#555B64] italic">{t('booking.aiLoading')}</p>}
                    {aiResponse && (
                      <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-[#09172C] leading-relaxed font-medium">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                )}

                {/* Horizontal vehicle carousel; selection continues in the detail panel below. */}
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#555B64]">
                      {t('booking.carouselHint')}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <button type="button" onClick={() => moveVehicleCarousel(-1)} aria-label={t('fleet.previous')} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#236199]/40 bg-white text-[#001E4A] transition hover:border-[#FEC228] hover:bg-[#FEC228]">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => moveVehicleCarousel(1)} aria-label={t('fleet.next')} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#236199]/40 bg-white text-[#001E4A] transition hover:border-[#FEC228] hover:bg-[#FEC228]">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div ref={vehicleCarouselRef} className="fleet-choice-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
                    {vehicleCatalog.map((v) => (
                      <button
                        type="button"
                        data-vehicle-card
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        aria-pressed={selectedVehicle.id === v.id}
                        className={`group flex min-h-[190px] w-[76%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border-2 text-left transition-all sm:w-[45%] lg:w-[31%] ${
                          selectedVehicle.id === v.id
                            ? 'border-[#FEC228] bg-[#174B86] shadow-lg ring-2 ring-[#FEC228]/20'
                            : 'border-[#236199]/55 bg-[#174B86] hover:-translate-y-0.5 hover:border-[#FEC228]/70'
                        }`}
                      >
                        <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-white/10 bg-cover bg-center p-4" style={{ backgroundImage: `url('${getVehicleStudioBackground(v)}')` }}>
                          <img src={v.primaryImage} alt={v.name} style={{ '--fleet-image-scale': getFleetCarouselScale(v.id) } as React.CSSProperties} className="fleet-vehicle-image is-carousel h-full w-full object-contain drop-shadow-[0_10px_12px_rgba(9,23,44,0.28)]" />
                          {selectedVehicle.id === v.id && (
                            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#FEC228] text-[#09172C] shadow-md">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="min-h-[70px] p-3.5">
                          <h5 className="line-clamp-2 text-sm font-bold leading-tight text-white">{v.name}</h5>
                          <span className="mt-1.5 block text-xs font-bold text-[#FEC228]">{v.pricePerDayFormatted}/{t('fleet.day')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Vehicle Focus Spotlight Box */}
                <div className="p-5 rounded-2xl bg-[#174B86] text-white border border-[#236199]/55 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
                  <div className="w-full sm:w-1/2 h-44 rounded-xl overflow-hidden relative shadow-lg bg-cover bg-center border border-white/10 flex items-center justify-center p-4" style={{ backgroundImage: `url('${getVehicleStudioBackground(selectedVehicle)}')` }}>
                    <img src={selectedVehicle.primaryImage} alt={selectedVehicle.name} style={{ '--fleet-image-scale': getFleetCarouselScale(selectedVehicle.id) } as React.CSSProperties} className="fleet-vehicle-image is-carousel h-full w-full object-contain drop-shadow-[0_16px_20px_rgba(9,23,44,0.3)]" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#09172C] text-[#FEC228] border border-[#FEC228]/40 text-[10px] font-extrabold uppercase shadow-md">
                      {selectedVehicle.categoryLabel}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-2.5 text-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FEC228]">
                      {t('booking.focusTag')}
                    </span>
                    <h4 className="text-lg font-bold text-white">{selectedVehicle.name}</h4>
                    <p className="text-gray-300 leading-relaxed line-clamp-2">{selectedVehicle.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] text-gray-300">
                      <div>{t('booking.capacity')}: <strong className="text-white">{selectedVehicle.specs.passengers} {t('fleet.seats')}</strong></div>
                      <div>{t('booking.doors')}: <strong className="text-white">{selectedVehicle.specs.doors}</strong></div>
                      <div>{t('booking.transmission')}: <strong className="text-white">{selectedVehicle.specs.transmission}</strong></div>
                      <div>{t('booking.fuel')}: <strong className="text-white">{selectedVehicle.specs.fuelType}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-xl font-extrabold text-[#FEC228]">{selectedVehicle.pricePerDayFormatted}</span>
                      <span className="text-[10px] text-gray-400 ml-1">{t('booking.perDay')}</span>
                    </div>
                  </div>
                </div>

                {/* Regime Selector: With Driver vs Self-Drive */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#09172C] mb-2">
                    {t('booking.drivingMode')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWithDriver(true)}
                      className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        withDriver ? 'bg-[#09172C] text-[#FEC228] border-[#09172C] shadow-sm' : 'bg-white text-[#09172C] border-[#E2E8F0]'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('booking.withProtocolDriver')}</span>
                    </button>
                    {submissionError && (
                      <p role="alert" className="rounded-xl border border-[#E4AD28] bg-[#FEC228] p-3 text-xs font-semibold text-[#09172C]">
                        {submissionError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setWithDriver(false)}
                      className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        !withDriver ? 'bg-[#09172C] text-[#FEC228] border-[#09172C] shadow-sm' : 'bg-white text-[#09172C] border-[#E2E8F0]'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>{t('booking.selfDrive')}</span>
                    </button>
                  </div>
                </div>

                {/* Location & Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#09172C] mb-1.5">
                      {t('booking.locationProvince')}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#555B64] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full p-3 pl-9 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#09172C] mb-1.5">
                      {t('booking.startDate')}
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#09172C] mb-1.5">
                      {t('booking.returnDate')}
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Login & Ficha de Cadastro para a Direcção */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-md">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#FEC228] mb-1">
                  <Shield className="w-4 h-4 text-[#FEC228]" />
                  <span>{t('booking.requesterId')}</span>
                </div>

                <h3 className="text-xl font-bold text-[#09172C] mb-2">
                  {t('booking.officialForm')}
                </h3>

                <p className="text-xs text-[#555B64] leading-relaxed mb-5">
                  {t('booking.identificationIntro')}
                </p>

                {/* Login Method Toggle: Phone vs Email */}
                <div className="flex items-center gap-2 p-1 bg-[#F5F6F6] rounded-xl mb-4 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'phone' ? 'bg-[#09172C] text-[#FEC228] shadow-sm' : 'text-[#555B64] hover:text-[#09172C]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('booking.byPhone')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'email' ? 'bg-[#09172C] text-[#FEC228] shadow-sm' : 'text-[#555B64] hover:text-[#09172C]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{t('booking.byEmail')}</span>
                  </button>
                </div>

                {/* Accreditation & Requester Form */}
                <form onSubmit={handleGenerateOfficialDossier} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      {loginMethod === 'phone' ? t('booking.phoneLabel') : t('booking.emailLabel')}
                    </label>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      value={clientIdentifier}
                      onChange={(e) => setClientIdentifier(e.target.value)}
                      placeholder={loginMethod === 'phone' ? '+244 9XX XXX XXX' : 'direccao@entidade.ao'}
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      {t('booking.responsibleName')}
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={t('booking.namePlaceholder')}
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      {t('booking.entityLabel')}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t('booking.entityPlaceholder')}
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                    />
                  </div>

                  <p className="rounded-xl border border-[#236199]/20 bg-[#236199]/5 p-3 text-[11px] leading-relaxed text-[#09172C]">
                    {t('booking.privacyNotice')}
                  </p>

                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      {t('booking.specialNotes')}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('booking.notesPlaceholder')}
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-[#FEC228] hover:bg-[#FFD45F] text-[#09172C] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isSubmitting ? t('booking.sendingOfficial') : t('booking.submitOfficial')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guarantees Box */}
              <div className="bg-[#09172C] text-white p-5 rounded-2xl text-xs space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-[#FEC228] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('booking.confidentialityTitle')}</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  {t('booking.confidentialityText')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Official Formatted Directorate Dossier View */
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-xl space-y-8 animate-fadeIn">
            {/* Dossier Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2E8F0] gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FEC228] block mb-1">
                  PEPEK GRUPO RENT-A-CAR · DIRECÇÃO DE OPERAÇÕES
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#09172C]">
                  {t('booking.dossierTitle', { code: directorateDossier.protocolCode })}
                </h3>
                <p className="text-xs text-[#555B64] mt-1">
                  {t('booking.issuedAt', { date: directorateDossier.submissionDate })}
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-[#236199] border border-[#236199] text-white text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{directorateDossier.authStatus}</span>
              </div>
            </div>

            {/* Dossier Structured Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#555B64] bg-[#F5F6F6] p-6 rounded-2xl border border-[#E2E8F0]">
              <div className="space-y-2">
                <h5 className="font-bold text-[#09172C] uppercase tracking-wider text-[11px] border-b pb-1">
                  {t('booking.requesterSection')}
                </h5>
                <div>{t('booking.nameResponsible')}: <strong className="text-[#09172C]">{clientName}</strong></div>
                {companyName && <div>{t('booking.entityEmbassy')}: <strong className="text-[#09172C]">{companyName}</strong></div>}
                <div>{t('booking.credential')} ({loginMethod === 'phone' ? t('booking.byPhone') : t('booking.byEmail')}): <strong className="text-[#09172C]">{clientIdentifier}</strong></div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-[#09172C] uppercase tracking-wider text-[11px] border-b pb-1">
                  {t('booking.fleetSection')}
                </h5>
                <div>{t('booking.preallocatedVehicle')}: <strong className="text-[#FEC228]">{selectedVehicle.name}</strong></div>
                <div>{t('booking.dailyRate')}: <strong className="text-[#09172C]">{selectedVehicle.pricePerDayFormatted}</strong></div>
                <div>{t('booking.regime')}: <strong className="text-[#09172C]">{withDriver ? t('booking.withProtocolDriver') : t('booking.selfDrive')}</strong></div>
                <div>{t('booking.departure')}: <strong className="text-[#09172C]">{pickupLocation}</strong></div>
                <div>{t('booking.period')}: <strong className="text-[#09172C]">{startDate} {t('booking.until')} {endDate || t('booking.toArrange')}</strong></div>
              </div>
            </div>

            <p className="text-xs text-[#555B64] leading-relaxed">
              {directorateDossier.summary} {t('booking.dossierClosing')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setDirectorateDossier(null)}
                className="text-xs font-bold text-[#555B64] hover:text-[#09172C] cursor-pointer"
              >
                ← {t('booking.newRequest')}
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isDemoMode && (
                  <button
                    type="button"
                    onClick={() => setIsPortalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#09172C] hover:bg-[#236199] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t('booking.portalInvoice')}</span>
                  </button>
                )}
                <a
                  href={whatsappDossierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#236199] hover:bg-[#0C2E60] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('booking.whatsappDispatch')}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
