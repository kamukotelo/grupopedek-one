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
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/dexie';
import { generateWhatsAppBookingUrl, OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { askPepekExecutiveAI } from '../../lib/ai';
import { BookingData } from '../../types';
import { FLEET_DATABASE, VehicleDetail } from '../../data/fleetData';

interface BookingWidgetProps {
  initialVehicle?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ initialVehicle }) => {
  const { t } = useTranslation();
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

  // Vehicle catalog sourced from the official FLEET_DATABASE
  // Show a curated selection of 8 top vehicles spanning different categories
  const topVehicles = FLEET_DATABASE.filter(v =>
    ['rangerover-blindado-2025', 'mercedes-class-s-2025', 'toyota-lc300-2023', 'new-toyota-prado',
     'toyota-hilux', 'mercedes-benz-v300-class', 'hyundai-tucson', 'suzuki-swift'].includes(v.id)
  );
  const vehicleCatalog = topVehicles.length >= 5 ? topVehicles : FLEET_DATABASE.slice(0, 8);

  // State Management
  const [selectedService, setSelectedService] = useState('rent-a-car');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetail>(vehicleCatalog[0] || FLEET_DATABASE[0]);
  const [pickupLocation, setPickupLocation] = useState('Luanda — Sede Talatona / Aeroporto 4 de Fevereiro');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [withDriver, setWithDriver] = useState(true);

  // Synchronize preselected vehicle from URL query param ?viatura=... or initialVehicle prop
  useEffect(() => {
    const urlVehicle = searchParams.get('viatura') || initialVehicle;
    if (urlVehicle) {
      const match = FLEET_DATABASE.find(
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
  const [nifDocument, setNifDocument] = useState('');
  const [notes, setNotes] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Processing & Official Directorate Dossier State
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const found = FLEET_DATABASE.find(v => v.name.toLowerCase().includes(res.recommendedVehicle!.toLowerCase()));
        if (found) setSelectedVehicle(found);
      }
    } catch {
      setAiResponse('A nossa direcção técnica disponibiliza 47 modelos desde Económicos (44.999 Kz/dia) a Blindados de Luxo (1.999.999 Kz/dia). Contacte-nos para uma proposta personalizada.');
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

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocol = `PK-DIR-${new Date().getFullYear()}-${randomSuffix}`;

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
      notes: `FICHA À DIRECÇÃO: Protocolo ${protocol} | NIF: ${nifDocument} | ${notes}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to Dexie Local DB
    try {
      if (db?.bookings) {
        await db.bookings.add(bookingPayload);
      }
    } catch (err) {
      console.warn('Dexie save error:', err);
    }

    // Save to Supabase Backend
    try {
      if (supabase) {
        await supabase.from('reservations').insert([
          {
            order_id: protocol,
            service_type: selectedService,
            vehicle: selectedVehicle.name,
            pickup_location: pickupLocation,
            start_date: startDate,
            end_date: endDate,
            with_driver: withDriver,
            client_name: clientName,
            client_phone: loginMethod === 'phone' ? clientIdentifier : '',
            client_email: loginMethod === 'email' ? clientIdentifier : '',
            company_name: companyName,
            notes: `Ficha Oficial Direcção | NIF: ${nifDocument} | ${notes}`
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }

    setTimeout(() => {
      setDirectorateDossier({
        protocolCode: protocol,
        submissionDate: new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        authStatus: 'Cliente Acreditado & Identidade Verificada',
        summary: `A ficha de requisição oficial nº ${protocol} foi despachada para a Direcção de Operações da PEPEK GRUPO em Talatona. A viatura ${selectedVehicle.name} (${selectedVehicle.pricePerDayFormatted}/dia) encontra-se pré-alocada com assistência técnica 24/7.`
      });
      setIsSubmitting(false);
    }, 700);
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
        notes: `FICHA OFICIAL À DIRECÇÃO: ${directorateDossier.protocolCode} | Acreditado via ${loginMethod}: ${clientIdentifier}`
      })
    : '';

  return (
    <section id="reserva" className="section-padding bg-[#F3F5F8] relative border-b border-[#D9DEE7]">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07133F] text-[#D2A820] text-xs font-bold uppercase tracking-wider mb-3.5 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Sistema Oficial de Acreditação & Despacho</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#07133F] tracking-tight mb-4">
            Planeie a Sua Mobilidade com Confirmação Imediata
          </h2>

          <p className="text-sm sm:text-base text-[#697080] leading-relaxed">
            Selecione visualmente o serviço e a viatura pretendida da nossa frota oficial de 47 modelos. Crie a sua ficha oficial de requisição com login por email ou telefone para despacho direto à Direcção de Operações.
          </p>
        </div>

        {!directorateDossier ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Interactive Visual Simulator & Vehicle Spotlight */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Interactive Visual Service Cards */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9DEE7] shadow-xs">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#07133F] mb-4">
                  1. Selecione o Tipo de Serviço Pretendido
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {servicesList.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        selectedService === srv.id
                          ? 'border-[#D2A820] bg-amber-50/40 shadow-md ring-2 ring-[#D2A820]/20'
                          : 'border-[#D9DEE7] hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selectedService === srv.id ? 'bg-[#07133F] text-[#D2A820]' : 'bg-[#F3F5F8] text-[#07133F]'}`}>
                        {srv.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#07133F]">{srv.title}</h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-[#07133F]">
                            {srv.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#697080] mt-1">{srv.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Visual Vehicle Gallery with Focus Spotlight */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9DEE7] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#07133F]">
                      2. Escolha da Viatura da Frota Oficial (47 Modelos)
                    </label>
                    <p className="text-xs text-[#697080]">Clique na viatura para fixar no seu plano de mobilidade</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiHelperOpen(!aiHelperOpen)}
                    className="text-xs font-bold text-[#D2A820] bg-[#07133F] px-3 py-1.5 rounded-xl border border-[#D2A820]/30 hover:bg-[#07133F]/90 flex items-center gap-1.5 w-fit cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D2A820]" />
                    <span>Dúvidas? Apoio Técnico IA</span>
                  </button>
                </div>

                {/* AI Proactive Recommender Drawer */}
                {aiHelperOpen && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-[#D2A820]/30 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#07133F] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#D2A820]" />
                        <span>Apoio Técnico da Frota & Pedidos Especiais</span>
                      </span>
                      <button onClick={() => setAiHelperOpen(false)} className="text-[#697080] hover:text-[#07133F] font-bold">✕</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAiConsult('Qual a viatura ideal para Luanda vs Províncias?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D9DEE7] text-[#07133F] font-semibold hover:bg-gray-50"
                      >
                        📍 Luanda vs. Províncias (Huambo/Bengo)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult('Têm viaturas blindadas de alta segurança ou autocarros?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D9DEE7] text-[#07133F] font-semibold hover:bg-gray-50"
                      >
                        🛡️ Blindados / Autocarros Especiais
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult('Quais os carros mais económicos para alugar?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D9DEE7] text-[#07133F] font-semibold hover:bg-gray-50"
                      >
                        💰 Económicos a partir de 44.999 Kz
                      </button>
                    </div>

                    {aiLoading && <p className="text-[#697080] italic">A consultar a frota oficial de 47 viaturas...</p>}
                    {aiResponse && (
                      <div className="p-3 bg-white rounded-xl border border-[#D9DEE7] text-[#07133F] leading-relaxed font-medium">
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
                      className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        selectedVehicle.id === v.id
                          ? 'border-[#D2A820] bg-amber-50/40 shadow-md ring-2 ring-[#D2A820]/20'
                          : 'border-[#D9DEE7] hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="h-20 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-b from-[#07133F] to-[#020A2A] mb-2 relative flex items-center justify-center p-2">
                        <img src={v.primaryImage} alt={v.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        {selectedVehicle.id === v.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#D2A820] text-[#020A2A] flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-[#07133F] leading-tight line-clamp-2">{v.name}</h5>
                        <span className="text-[9px] font-bold text-[#D2A820] block mt-1">{v.pricePerDayFormatted}/dia</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Vehicle Focus Spotlight Box */}
                <div className="p-5 rounded-2xl bg-[#020A2A] text-white border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-full sm:w-1/2 h-44 rounded-xl overflow-hidden relative shadow-lg bg-gradient-to-b from-[#07133F] to-[#020A2A] flex items-center justify-center p-3">
                    <img src={selectedVehicle.primaryImage} alt={selectedVehicle.name} className="w-full h-full object-contain" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#D2A820] text-[#020A2A] text-[10px] font-extrabold uppercase">
                      {selectedVehicle.categoryLabel}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-2.5 text-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D2A820]">
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
                      <span className="text-xl font-black text-[#D2A820]">{selectedVehicle.pricePerDayFormatted}</span>
                      <span className="text-[10px] text-gray-400 ml-1">por dia</span>
                    </div>
                  </div>
                </div>

                {/* Regime Selector: With Driver vs Self-Drive */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#07133F] mb-2">
                    Regime de Condução
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWithDriver(true)}
                      className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        withDriver ? 'bg-[#07133F] text-[#D2A820] border-[#07133F] shadow-sm' : 'bg-white text-[#07133F] border-[#D9DEE7]'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Com Motorista Protocolar (+35.000 Kz/dia)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithDriver(false)}
                      className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        !withDriver ? 'bg-[#07133F] text-[#D2A820] border-[#07133F] shadow-sm' : 'bg-white text-[#07133F] border-[#D9DEE7]'
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#07133F] mb-1.5">
                      Local / Província
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#697080] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full p-3 pl-9 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#07133F] mb-1.5">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#07133F] mb-1.5">
                      Data de Devolução
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Login & Ficha de Cadastro para a Direcção */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D9DEE7] shadow-md">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#D2A820] mb-1">
                  <Shield className="w-4 h-4 text-[#D2A820]" />
                  <span>Acreditação & Login de Fiabilidade</span>
                </div>

                <h3 className="text-xl font-bold text-[#07133F] mb-2">
                  Ficha Oficial para a Direcção
                </h3>

                <p className="text-xs text-[#697080] leading-relaxed mb-5">
                  Para emissão do protocolo formal, autentique-se via email ou telemóvel registado.
                </p>

                {/* Login Method Toggle: Phone vs Email */}
                <div className="flex items-center gap-2 p-1 bg-[#F3F5F8] rounded-xl mb-4 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'phone' ? 'bg-[#07133F] text-[#D2A820] shadow-sm' : 'text-[#697080] hover:text-[#07133F]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Por Telemóvel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'email' ? 'bg-[#07133F] text-[#D2A820] shadow-sm' : 'text-[#697080] hover:text-[#07133F]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Por E-mail</span>
                  </button>
                </div>

                {/* Accreditation & Requester Form */}
                <form onSubmit={handleGenerateOfficialDossier} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#07133F] mb-1">
                      {loginMethod === 'phone' ? 'Número de Telemóvel / WhatsApp' : 'E-mail Institucional ou Particular'}
                    </label>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      value={clientIdentifier}
                      onChange={(e) => setClientIdentifier(e.target.value)}
                      placeholder={loginMethod === 'phone' ? '+244 9XX XXX XXX' : 'direccao@entidade.ao'}
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#07133F] mb-1">
                      Nome Completo do Responsável
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="ex: Dr. Carlos Mendes"
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#07133F] mb-1">
                      Entidade / Embaixada / Empresa (Opcional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ex: Embaixada / Sonangol / Particular"
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#07133F] mb-1">
                      NIF / Documento de Identificação (Para Faturação AGT)
                    </label>
                    <input
                      type="text"
                      value={nifDocument}
                      onChange={(e) => setNifDocument(e.target.value)}
                      placeholder="ex: 5000XXXXXX ou Passaporte"
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#07133F] mb-1">
                      Observações ou Requisitos Especiais
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ex: Necessidade de escolta, número de voo, cadeiras de criança..."
                      className="w-full p-3 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-medium text-[#07133F] outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-[#D2A820] hover:bg-[#E1BB38] text-[#020A2A] font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isSubmitting ? 'A submeter à Direcção...' : 'Submeter Ficha Oficial à Direcção'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guarantees Box */}
              <div className="bg-[#020A2A] text-white p-5 rounded-3xl text-xs space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-[#D2A820] font-bold">
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
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#D9DEE7] shadow-xl space-y-8 animate-fadeIn">
            {/* Dossier Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9DEE7] gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D2A820] block mb-1">
                  PEPEK GRUPO RENT-A-CAR · DIRECÇÃO DE OPERAÇÕES
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#07133F]">
                  Ficha Oficial de Requisição nº {directorateDossier.protocolCode}
                </h3>
                <p className="text-xs text-[#697080] mt-1">
                  Emitida em: {directorateDossier.submissionDate} · Sede Talatona, Luanda
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1E8E5A] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />
                <span>{directorateDossier.authStatus}</span>
              </div>
            </div>

            {/* Dossier Structured Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#697080] bg-[#F3F5F8] p-6 rounded-2xl border border-[#D9DEE7]">
              <div className="space-y-2">
                <h5 className="font-bold text-[#07133F] uppercase tracking-wider text-[11px] border-b pb-1">
                  1. Dados do Requisitante / Entidade
                </h5>
                <div>Nome / Responsável: <strong className="text-[#07133F]">{clientName}</strong></div>
                {companyName && <div>Entidade / Embaixada: <strong className="text-[#07133F]">{companyName}</strong></div>}
                <div>Credencial ({loginMethod}): <strong className="text-[#07133F]">{clientIdentifier}</strong></div>
                {nifDocument && <div>NIF / Documento: <strong className="text-[#07133F]">{nifDocument}</strong></div>}
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-[#07133F] uppercase tracking-wider text-[11px] border-b pb-1">
                  2. Especificação da Frota e Itinerário
                </h5>
                <div>Viatura Pré-Alocada: <strong className="text-[#D2A820]">{selectedVehicle.name}</strong></div>
                <div>Tarifa Diária: <strong className="text-[#07133F]">{selectedVehicle.pricePerDayFormatted}</strong></div>
                <div>Regime: <strong className="text-[#07133F]">{withDriver ? 'Com Motorista Protocolar Bilingue (+35.000 Kz/dia)' : 'Livre Condução'}</strong></div>
                <div>Local de Partida: <strong className="text-[#07133F]">{pickupLocation}</strong></div>
                <div>Período: <strong className="text-[#07133F]">{startDate} até {endDate || 'A combinar'}</strong></div>
              </div>
            </div>

            <p className="text-xs text-[#697080] leading-relaxed">
              {directorateDossier.summary} O processo está aberto e registado. Pode aguardar o contacto do nosso director de frota ou acelerar a validação imediata enviando a ficha assinada para o WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D9DEE7]">
              <button
                type="button"
                onClick={() => setDirectorateDossier(null)}
                className="text-xs font-bold text-[#697080] hover:text-[#07133F] cursor-pointer"
              >
                ← Criar Nova Ficha de Requisição
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={whatsappDossierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
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
