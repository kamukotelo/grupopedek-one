import React, { useState, useEffect } from 'react';
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
import { getFleetImageOffsetY, getFleetImageScale, getVehicleStudioBackground } from '../../data/fleetPresentation';
import { useAuth } from '../../context/AuthContext';

interface BookingWidgetProps {
  initialVehicle?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ initialVehicle }) => {
  const { t } = useTranslation();
  const { isDemoMode, setIsPortalOpen } = useAuth();
  const [searchParams] = useSearchParams();

  // 1. Service Types as Rich Interactive Cards
  const servicesList = [
    {
      id: 'rent-a-car',
      title: 'Rent a Car Executivo',
      subtitle: 'Diário, semanal ou mensal',
      icon: <Car className="w-6 h-6" />,
      badge: 'Flexível'
    },
    {
      id: 'executive',
      title: 'Apoio Executivo & Chauffeur',
      subtitle: 'Motorista bilingue de protocolo',
      icon: <UserCheck className="w-6 h-6" />,
      badge: 'Mais Solicitado'
    },
    {
      id: 'transfer',
      title: 'Transfer Aeroporto VIP',
      subtitle: 'Aeroporto 4 de Fevereiro / AIAAN',
      icon: <Plane className="w-6 h-6" />,
      badge: 'Meet & Greet'
    },
    {
      id: 'corporate',
      title: 'Gestão de Frota Corporativa',
      subtitle: 'Faturação AGT a 30 dias',
      icon: <Building2 className="w-6 h-6" />,
      badge: 'Embaixadas / Empresas'
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
      setAiResponse('A nossa direcção técnica disponibiliza soluções desde viaturas económicas a blindados de luxo. Contacte-nos para uma proposta personalizada.');
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
        submissionDate: new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        authStatus: 'Pedido Registado com Sucesso',
        summary: `A ficha de requisição oficial nº ${receipt.protocolCode} foi registada para análise da Direcção de Operações PEPEK em Talatona. A disponibilidade final da viatura ${selectedVehicle.name} será confirmada pela equipa operacional.`
      });
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Não foi possível registar a reserva. Tente novamente ou use o WhatsApp.');
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
        notes: `FICHA OFICIAL À DIRECÇÃO: ${directorateDossier.protocolCode} | Identificado via ${loginMethod}: ${clientIdentifier}`
      })
    : '';

  return (
    <section id="reserva" className="section-padding bg-[#F5F6F6] relative border-b border-[#E2E8F0]">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09172C] text-[#FEC228] text-xs font-bold uppercase tracking-wider mb-3.5 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Sistema Oficial de Reserva & Despacho</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#09172C] tracking-tight mb-4">
            Planeie a Sua Mobilidade com Confirmação Imediata
          </h2>

          <p className="text-sm sm:text-base text-[#555B64] leading-relaxed">
            Selecione visualmente o serviço e a viatura pretendida da nossa frota executiva. Crie a sua ficha oficial de requisição com email ou telefone para despacho direto à Direcção de Operações.
          </p>
        </div>

        {!directorateDossier ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Interactive Visual Simulator & Vehicle Spotlight */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Interactive Visual Service Cards */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#09172C] mb-4">
                  1. Selecione o Tipo de Serviço Pretendido
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
                      2. Escolha da Viatura
                    </label>
                    <p className="text-xs text-[#555B64]">Clique na viatura para fixar no seu plano de mobilidade</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiHelperOpen(!aiHelperOpen)}
                    className="text-xs font-bold text-[#FEC228] bg-[#09172C] px-3 py-1.5 rounded-xl border border-[#FEC228]/30 hover:bg-[#09172C]/90 flex items-center gap-1.5 w-fit cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FEC228]" />
                    <span>Dúvidas? Apoio Técnico IA</span>
                  </button>
                </div>

                {/* AI Proactive Recommender Drawer */}
                {aiHelperOpen && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FEC228] to-[#FEC228] border border-[#FEC228]/30 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#09172C] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#FEC228]" />
                        <span>Apoio Técnico da Frota & Pedidos Especiais</span>
                      </span>
                      <button onClick={() => setAiHelperOpen(false)} className="text-[#555B64] hover:text-[#09172C] font-bold">✕</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAiConsult('Qual a viatura ideal para Luanda vs Províncias?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#09172C] font-semibold hover:bg-gray-50"
                      >
                        📍 Luanda vs. Províncias (Huambo/Bengo)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult('Têm viaturas blindadas de alta segurança ou autocarros?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#09172C] font-semibold hover:bg-gray-50"
                      >
                        🛡️ Blindados / Autocarros Especiais
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult('Quais os carros mais económicos para alugar?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#09172C] font-semibold hover:bg-gray-50"
                      >
                        💰 Económicos a partir de 44.999 Kz
                      </button>
                    </div>

                    {aiLoading && <p className="text-[#555B64] italic">A consultar a frota disponível...</p>}
                    {aiResponse && (
                      <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-[#09172C] leading-relaxed font-medium">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                )}

                {/* Clickable Vehicle Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {vehicleCatalog.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`overflow-hidden rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        selectedVehicle.id === v.id
                          ? 'border-[#FEC228] bg-[#174B86] shadow-md ring-2 ring-[#FEC228]/20'
                          : 'border-[#236199]/55 bg-[#174B86] hover:border-[#FEC228]/70'
                      }`}
                    >
                      <div className="h-20 sm:h-24 overflow-hidden bg-cover bg-center border-b border-white/10 relative flex items-center justify-center p-2" style={{ backgroundImage: `url('${getVehicleStudioBackground(v)}')` }}>
                        <img src={v.primaryImage} alt={v.name} style={{ '--fleet-image-scale': getFleetImageScale(v.id), '--fleet-image-offset-y': getFleetImageOffsetY(v.id) } as React.CSSProperties} className="fleet-vehicle-image h-full w-full object-contain drop-shadow-[0_8px_10px_rgba(9,23,44,0.18)]" />
                        {selectedVehicle.id === v.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FEC228] text-[#09172C] flex items-center justify-center text-[10px] font-bold shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <h5 className="text-[11px] font-bold text-white leading-tight line-clamp-2">{v.name}</h5>
                        <span className="text-[9px] font-bold text-[#FEC228] block mt-1">{v.pricePerDayFormatted}/dia</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Vehicle Focus Spotlight Box */}
                <div className="p-5 rounded-2xl bg-[#174B86] text-white border border-[#236199]/55 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
                  <div className="w-full sm:w-1/2 h-44 rounded-xl overflow-hidden relative shadow-lg bg-cover bg-center border border-white/10 flex items-center justify-center p-4" style={{ backgroundImage: `url('${getVehicleStudioBackground(selectedVehicle)}')` }}>
                    <img src={selectedVehicle.primaryImage} alt={selectedVehicle.name} style={{ '--fleet-image-scale': getFleetImageScale(selectedVehicle.id), '--fleet-image-offset-y': getFleetImageOffsetY(selectedVehicle.id) } as React.CSSProperties} className="fleet-vehicle-image h-full w-full object-contain drop-shadow-[0_16px_20px_rgba(9,23,44,0.3)]" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#09172C] text-[#FEC228] border border-[#FEC228]/40 text-[10px] font-extrabold uppercase shadow-md">
                      {selectedVehicle.categoryLabel}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-2.5 text-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FEC228]">
                      Viatura em Destaque no seu Pedido
                    </span>
                    <h4 className="text-lg font-bold text-white">{selectedVehicle.name}</h4>
                    <p className="text-gray-300 leading-relaxed line-clamp-2">{selectedVehicle.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] text-gray-300">
                      <div>Lotação: <strong className="text-white">{selectedVehicle.specs.passengers} Lugares</strong></div>
                      <div>Portas: <strong className="text-white">{selectedVehicle.specs.doors}</strong></div>
                      <div>Transmissão: <strong className="text-white">{selectedVehicle.specs.transmission}</strong></div>
                      <div>Combustível: <strong className="text-white">{selectedVehicle.specs.fuelType}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-xl font-extrabold text-[#FEC228]">{selectedVehicle.pricePerDayFormatted}</span>
                      <span className="text-[10px] text-gray-400 ml-1">por dia</span>
                    </div>
                  </div>
                </div>

                {/* Regime Selector: With Driver vs Self-Drive */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#09172C] mb-2">
                    Regime de Condução
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
                      <span>Com Motorista Protocolar (+35.000 Kz/dia)</span>
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
                      <span>Livre Condução (Self-Drive)</span>
                    </button>
                  </div>
                </div>

                {/* Location & Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#09172C] mb-1.5">
                      Local / Província
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
                      Data de Início
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
                      Data de Devolução
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
                  <span>Identificação do Requisitante</span>
                </div>

                <h3 className="text-xl font-bold text-[#09172C] mb-2">
                  Ficha Oficial para a Direcção
                </h3>

                <p className="text-xs text-[#555B64] leading-relaxed mb-5">
                  Para emissão do protocolo formal, identifique-se por email ou telemóvel.
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
                    <span>Por Telemóvel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'email' ? 'bg-[#09172C] text-[#FEC228] shadow-sm' : 'text-[#555B64] hover:text-[#09172C]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Por E-mail</span>
                  </button>
                </div>

                {/* Accreditation & Requester Form */}
                <form onSubmit={handleGenerateOfficialDossier} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      {loginMethod === 'phone' ? 'Número de Telemóvel / WhatsApp' : 'E-mail Institucional ou Particular'}
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
                      Nome Completo do Responsável
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="ex: Dr. Carlos Mendes"
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      Entidade / Embaixada / Empresa (Opcional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ex: Embaixada / Sonangol / Particular"
                      className="w-full p-3 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#09172C] outline-hidden focus:ring-2 focus:ring-[#FEC228]"
                    />
                  </div>

                  <p className="rounded-xl border border-[#236199]/20 bg-[#236199]/5 p-3 text-[11px] leading-relaxed text-[#09172C]">
                    Para sua segurança, não envie NIF, passaporte ou carta de condução neste pedido. A equipa solicitará documentos apenas após a confirmação, por canal autorizado.
                  </p>

                  <div>
                    <label className="block font-bold text-[#09172C] mb-1">
                      Observações ou Requisitos Especiais
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ex: Necessidade de escolta, número de voo, cadeiras de criança... Não inclua documentos pessoais."
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
                      <span>{isSubmitting ? 'A submeter à Direcção...' : 'Submeter Ficha Oficial à Direcção'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guarantees Box */}
              <div className="bg-[#09172C] text-white p-5 rounded-2xl text-xs space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-[#FEC228] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tratamento Institucional com Sigilo Absoluto</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Todas as requisições enviadas à Direcção de Operações PEPEK são tratadas com sigilo diplomático, confirmação telefónica e viatura em prontidão na base de Talatona.
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
                  Ficha Oficial de Requisição nº {directorateDossier.protocolCode}
                </h3>
                <p className="text-xs text-[#555B64] mt-1">
                  Emitida em: {directorateDossier.submissionDate} · Sede Talatona, Luanda
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
                  1. Dados do Requisitante / Entidade
                </h5>
                <div>Nome / Responsável: <strong className="text-[#09172C]">{clientName}</strong></div>
                {companyName && <div>Entidade / Embaixada: <strong className="text-[#09172C]">{companyName}</strong></div>}
                <div>Credencial ({loginMethod}): <strong className="text-[#09172C]">{clientIdentifier}</strong></div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-[#09172C] uppercase tracking-wider text-[11px] border-b pb-1">
                  2. Especificação da Frota e Itinerário
                </h5>
                <div>Viatura Pré-Alocada: <strong className="text-[#FEC228]">{selectedVehicle.name}</strong></div>
                <div>Tarifa Diária: <strong className="text-[#09172C]">{selectedVehicle.pricePerDayFormatted}</strong></div>
                <div>Regime: <strong className="text-[#09172C]">{withDriver ? 'Com Motorista Protocolar Bilingue (+35.000 Kz/dia)' : 'Livre Condução'}</strong></div>
                <div>Local de Partida: <strong className="text-[#09172C]">{pickupLocation}</strong></div>
                <div>Período: <strong className="text-[#09172C]">{startDate} até {endDate || 'A combinar'}</strong></div>
              </div>
            </div>

            <p className="text-xs text-[#555B64] leading-relaxed">
              {directorateDossier.summary} O processo está aberto e registado. Pode aguardar o contacto do nosso director de frota ou acelerar a validação imediata enviando a ficha assinada para o WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setDirectorateDossier(null)}
                className="text-xs font-bold text-[#555B64] hover:text-[#09172C] cursor-pointer"
              >
                ← Criar Nova Ficha de Requisição
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isDemoMode && (
                  <button
                    type="button"
                    onClick={() => setIsPortalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#09172C] hover:bg-[#236199] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Continuar para Portal & Fatura Demo</span>
                  </button>
                )}
                <a
                  href={whatsappDossierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#236199] hover:bg-[#0C2E60] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Acelerar Despacho via WhatsApp Direcção</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
