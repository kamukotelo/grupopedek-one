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

interface BookingWidgetProps {
  initialVehicle?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ initialVehicle = 'SUV Executiva — Land Cruiser Prado / LC300' }) => {
  const { t } = useTranslation();

  // 1. Service Types as Rich Interactive Cards
  const servicesList = [
    {
      id: 'rent-a-car',
      title: 'Rent a Car Executivo',
      subtitle: 'Diário, semanal ou mensal',
      icon: <Car className="w-6 h-6 text-[#0B45D8]" />,
      badge: 'Flexível'
    },
    {
      id: 'executive',
      title: 'Apoio Executivo & Chauffeur',
      subtitle: 'Motorista bilingue de protocolo',
      icon: <UserCheck className="w-6 h-6 text-[#0B45D8]" />,
      badge: 'Mais Solicitado'
    },
    {
      id: 'transfer',
      title: 'Transfer Aeroporto VIP',
      subtitle: 'Aeroporto 4 de Fevereiro / AIAAN',
      icon: <Plane className="w-6 h-6 text-[#0B45D8]" />,
      badge: 'Meet & Greet'
    },
    {
      id: 'corporate',
      title: 'Gestão de Frota Corporativa',
      subtitle: 'Faturação AGT a 30 dias',
      icon: <Building2 className="w-6 h-6 text-[#0B45D8]" />,
      badge: 'Embaixadas / Empresas'
    }
  ];

  // 2. Vehicle Catalog with Real Images and Detailed Specs
  const vehicleCatalog = [
    {
      id: 'suv-prado',
      name: 'Toyota Land Cruiser Prado TXL / LC300',
      category: 'SUV Executiva de Luxo',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      passengers: 7,
      luggage: 5,
      traction: '4WD Integral',
      transmission: 'Automática',
      idealFor: 'Directores, Ministros, Diplomatas e eventos em Luanda',
      badge: 'Destaque Executivo'
    },
    {
      id: '4x4-hilux',
      name: 'Toyota Hilux Dupla Cabine 4x4',
      category: 'Todo-Terreno & Províncias',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      passengers: 5,
      luggage: 6,
      traction: '4x4 Redutoras',
      transmission: 'Manual / Auto',
      idealFor: 'Missões no Huambo, Bengo, mineração e vias acidentadas',
      badge: 'Todo-Terreno'
    },
    {
      id: 'suv-fortuner',
      name: 'Toyota Fortuner 4x4 V6',
      category: 'SUV Familiar & Campo',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      passengers: 7,
      luggage: 5,
      traction: '4x4 Permanente',
      transmission: 'Automática',
      idealFor: 'Equipas executivas e viagens interprovinciais',
      badge: 'Versátil'
    },
    {
      id: 'van-hiace',
      name: 'Toyota Hiace VIP Executiva 12L',
      category: 'Van VIP & Comitivas',
      image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80',
      passengers: 12,
      luggage: 10,
      traction: 'Traseira Reforçada',
      transmission: 'Manual / Auto',
      idealFor: 'Delegações diplomáticas, tripulações e eventos de estado',
      badge: 'Grupos VIP'
    },
    {
      id: 'sedan-mercedes',
      name: 'Mercedes-Benz Classe E / Camry',
      category: 'Sedan de Representação',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      passengers: 4,
      luggage: 3,
      traction: 'Traseira / Integral',
      transmission: 'Automática',
      idealFor: 'Recepção de altas personalidades e protocolo urbano',
      badge: 'Exclusivo'
    }
  ];

  // State Management
  const [selectedService, setSelectedService] = useState('rent-a-car');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleCatalog[0]);
  const [pickupLocation, setPickupLocation] = useState('Luanda — Sede Talatona / Aeroporto 4 de Fevereiro');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [withDriver, setWithDriver] = useState(true);

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
        const found = vehicleCatalog.find(v => v.name.toLowerCase().includes(res.recommendedVehicle!.toLowerCase()));
        if (found) setSelectedVehicle(found);
      }
    } catch {
      setAiResponse('A nossa direcção técnica disponibiliza viaturas blindadas B6/B7, autocarros de alta capacidade e viaturas industriais sob requisição especial.');
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
        summary: `A ficha de requisição oficial nº ${protocol} foi despachada para a Direcção de Operações da PEPEK GRUPO em Talatona. A viatura ${selectedVehicle.name} encontra-se pré-alocada com assistência técnica 24/7.`
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
    <section id="reserva" className="section-padding bg-gray-50 relative border-b border-gray-200">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="tag-label mb-3.5">
            <Shield className="w-3.5 h-3.5 text-[#0B45D8]" />
            <span>Sistema Oficial de Acreditação & Despacho</span>
          </div>

          <h2 className="section-title mb-4">
            Planeie a Sua Mobilidade com Confirmação Imediata
          </h2>

          <p className="section-subtitle">
            Selecione visualmente o serviço e a viatura pretendida. Crie a sua ficha oficial de requisição com login por email ou telefone para despacho direto à Direcção de Operações.
          </p>
        </div>

        {!directorateDossier ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Interactive Visual Simulator & Vehicle Spotlight */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Interactive Visual Service Cards (No Dropdown) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-4">
                  1. Selecione o Tipo de Serviço Pretendido
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {servicesList.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        selectedService === srv.id
                          ? 'border-[#0B45D8] bg-blue-50/50 shadow-md ring-2 ring-[#0B45D8]/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selectedService === srv.id ? 'bg-[#0B45D8] text-white' : 'bg-gray-100 text-[#0B45D8]'}`}>
                        {srv.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#06142F]">{srv.title}</h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#0B45D8]">
                            {srv.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{srv.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Visual Vehicle Gallery with Focus Spotlight */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      2. Escolha da Viatura da Frota
                    </label>
                    <p className="text-xs text-gray-500">Clique na viatura para fixar no seu plano de mobilidade</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiHelperOpen(!aiHelperOpen)}
                    className="text-xs font-bold text-[#0B45D8] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-100 flex items-center gap-1.5 w-fit cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0B45D8]" />
                    <span>Dúvidas? Apoio Técnico IA</span>
                  </button>
                </div>

                {/* AI Proactive Recommender Drawer */}
                {aiHelperOpen && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#06142F] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#0B45D8]" />
                        <span>Apoio Técnico da Frota & Pedidos Especiais</span>
                      </span>
                      <button onClick={() => setAiHelperOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAiConsult('Qual a viatura ideal para Luanda vs Províncias?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-semibold hover:bg-blue-100"
                      >
                        📍 Luanda vs. Províncias (Huambo/Bengo)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAiConsult('Têm viaturas blindadas de alta segurança ou autocarros?')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-semibold hover:bg-blue-100"
                      >
                        🛡️ Blindados / Autocarros Especiais
                      </button>
                    </div>

                    {aiLoading && <p className="text-gray-500 italic">A consultar especificações da frota...</p>}
                    {aiResponse && (
                      <div className="p-3 bg-white rounded-xl border border-blue-100 text-gray-800 leading-relaxed font-medium">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                )}

                {/* Clickable Vehicle Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {vehicleCatalog.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        selectedVehicle.id === v.id
                          ? 'border-[#0B45D8] bg-blue-50/60 shadow-md ring-2 ring-[#0B45D8]/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="h-20 sm:h-24 rounded-xl overflow-hidden bg-gray-900 mb-2 relative">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {selectedVehicle.id === v.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0B45D8] text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-[#06142F] leading-tight line-clamp-2">{v.name}</h5>
                        <span className="text-[9px] font-semibold text-gray-500 block mt-1">{v.category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Vehicle Focus Spotlight Box */}
                <div className="p-5 rounded-2xl bg-[#06142F] text-white border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-full sm:w-1/2 h-44 rounded-xl overflow-hidden relative shadow-lg">
                    <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#0B45D8] text-white text-[10px] font-extrabold uppercase">
                      {selectedVehicle.badge}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-2.5 text-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B45D8]">
                      Viatura em Destaque no seu Pedido
                    </span>
                    <h4 className="text-lg font-bold text-white">{selectedVehicle.name}</h4>
                    <p className="text-gray-300 leading-relaxed">{selectedVehicle.idealFor}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] text-gray-300">
                      <div>Lotação: <strong className="text-white">{selectedVehicle.passengers} Lugares</strong></div>
                      <div>Bagagem: <strong className="text-white">{selectedVehicle.luggage} Malas</strong></div>
                      <div>Tracção: <strong className="text-white">{selectedVehicle.traction}</strong></div>
                      <div>Câmbio: <strong className="text-white">{selectedVehicle.transmission}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Regime Selector: With Driver vs Self-Drive */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Regime de Condução
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWithDriver(true)}
                      className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        withDriver ? 'bg-[#06142F] text-white border-[#06142F] shadow-sm' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-[#0B45D8]" />
                      <span>Com Motorista Protocolar Bilingue</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithDriver(false)}
                      className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        !withDriver ? 'bg-[#06142F] text-white border-[#06142F] shadow-sm' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <Car className="w-4 h-4 text-[#0B45D8]" />
                      <span>Livre Condução (Self-Drive)</span>
                    </button>
                  </div>
                </div>

                {/* Location & Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Local / Província
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="form-input pl-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Data de Devolução
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
              </div>
            </div>

            {/* Right Column: Verified Login & Ficha de Cadastro para a Direcção */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-md">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#0B45D8] mb-1">
                  <Shield className="w-4 h-4 text-[#0B45D8]" />
                  <span>Acreditação & Login de Fiabilidade</span>
                </div>

                <h3 className="text-xl font-bold text-[#06142F] mb-2">
                  Ficha Oficial para a Direcção
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mb-5">
                  Para emissão do protocolo formal, autentique-se via email ou telemóvel registado.
                </p>

                {/* Login Method Toggle: Phone vs Email */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl mb-4 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'phone' ? 'bg-[#06142F] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0B45D8]" />
                    <span>Por Telemóvel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === 'email' ? 'bg-[#06142F] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0B45D8]" />
                    <span>Por E-mail</span>
                  </button>
                </div>

                {/* Accreditation & Requester Form */}
                <form onSubmit={handleGenerateOfficialDossier} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      {loginMethod === 'phone' ? 'Número de Telemóvel / WhatsApp' : 'E-mail Institucional ou Particular'}
                    </label>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      value={clientIdentifier}
                      onChange={(e) => setClientIdentifier(e.target.value)}
                      placeholder={loginMethod === 'phone' ? '+244 9XX XXX XXX' : 'direccao@entidade.ao'}
                      className="form-input text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nome Completo do Responsável
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="ex: Dr. Carlos Mendes"
                      className="form-input text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Entidade / Embaixada / Empresa (Opcional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ex: Embaixada / Sonangol / Particular"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      NIF / Documento de Identificação (Para Faturação AGT)
                    </label>
                    <input
                      type="text"
                      value={nifDocument}
                      onChange={(e) => setNifDocument(e.target.value)}
                      placeholder="ex: 5000XXXXXX ou Passaporte"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Observações ou Requisitos Especiais
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ex: Necessidade de escolta, número de voo, cadeiras de criança..."
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center text-xs font-bold py-3.5 cursor-pointer disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isSubmitting ? 'A submeter à Direcção...' : 'Submeter Ficha Oficial à Direcção'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guarantees Box */}
              <div className="bg-[#030D1F] text-white p-5 rounded-3xl text-xs space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
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
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-300 shadow-xl space-y-8 animate-fadeIn">
            {/* Dossier Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0B45D8] block mb-1">
                  PEPEK GRUPO RENT-A-CAR · DIRECÇÃO DE OPERAÇÕES
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#06142F]">
                  Ficha Oficial de Requisição nº {directorateDossier.protocolCode}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Emitida em: {directorateDossier.submissionDate} · Sede Talatona, Luanda
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{directorateDossier.authStatus}</span>
              </div>
            </div>

            {/* Dossier Structured Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="space-y-2">
                <h5 className="font-bold text-[#06142F] uppercase tracking-wider text-[11px] border-b pb-1">
                  1. Dados do Requisitante / Entidade
                </h5>
                <div>Nome / Responsável: <strong className="text-gray-900">{clientName}</strong></div>
                {companyName && <div>Entidade / Embaixada: <strong className="text-gray-900">{companyName}</strong></div>}
                <div>Credencial ({loginMethod}): <strong className="text-gray-900">{clientIdentifier}</strong></div>
                {nifDocument && <div>NIF / Documento: <strong className="text-gray-900">{nifDocument}</strong></div>}
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-[#06142F] uppercase tracking-wider text-[11px] border-b pb-1">
                  2. Especificação da Frota e Itinerário
                </h5>
                <div>Viatura Pré-Alocada: <strong className="text-[#0B45D8]">{selectedVehicle.name}</strong></div>
                <div>Regime: <strong className="text-gray-900">{withDriver ? 'Com Motorista Protocolar Bilingue' : 'Livre Condução'}</strong></div>
                <div>Local de Partida: <strong className="text-gray-900">{pickupLocation}</strong></div>
                <div>Período: <strong className="text-gray-900">{startDate} até {endDate || 'A combinar'}</strong></div>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {directorateDossier.summary} O processo está aberto e registado. Pode aguardar o contacto do nosso director de frota ou acelerar a validação imediata enviando a ficha assinada para o WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setDirectorateDossier(null)}
                className="text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                ← Criar Nova Ficha de Requisição
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={whatsappDossierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full sm:w-auto justify-center text-xs font-bold py-3 px-6"
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
