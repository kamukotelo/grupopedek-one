import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Settings2,
  Gauge,
  Eye,
  Calendar,
  Check,
  Plus,
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  MapPin,
  MessageSquareText,
  Fuel
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { generateVehicleWhatsAppUrl } from '../../lib/whatsapp';

interface VehicleCardProps {
  vehicle: VehicleDetail;
  isCompared: boolean;
  onToggleCompare: (vehicle: VehicleDetail) => void;
  onInspect: (vehicle: VehicleDetail) => void;
  onSelectBooking: (vehicleName: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isCompared,
  onToggleCompare,
  onInspect,
  onSelectBooking
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justBookedFeedback, setJustBookedFeedback] = useState(false);

  const handleBookingClick = () => {
    setJustBookedFeedback(true);
    onSelectBooking(vehicle.name);
    setTimeout(() => setJustBookedFeedback(false), 2000);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(generateVehicleWhatsAppUrl(vehicle.name, vehicle.pricePerDayAOA), '_blank');
  };

  return (
    <div className="rounded-3xl border border-gray-200/90 bg-white overflow-hidden shadow-md hover:shadow-2xl hover:border-[#0B45D8]/50 transition-all duration-300 flex flex-col justify-between group">
      {/* ═══════════════════════════════════════════════════════
          DOMINANT VEHICLE IMAGE AREA (Visual-First, Wide 16:9)
          Desktop: Crossfade to Secondary Image on Hover
         ═══════════════════════════════════════════════════════ */}
      <div
        className="relative h-64 sm:h-80 overflow-hidden bg-gray-950 cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onInspect(vehicle)}
      >
        {/* Primary Image */}
        <img
          src={vehicle.primaryImage}
          alt={vehicle.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && vehicle.secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Secondary Angle Image (Crossfade on Hover) */}
        {vehicle.secondaryImage && (
          <img
            src={vehicle.secondaryImage}
            alt={`${vehicle.name} vista lateral/interior`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Top Badges Area */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {vehicle.badge && (
              <span className="px-3 py-1 rounded-full bg-[#0B45D8] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                {vehicle.badge}
              </span>
            )}
            {vehicle.availabilityTag && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs hidden sm:inline-block">
                {vehicle.availabilityTag}
              </span>
            )}
          </div>

          {/* Photo Count Chip */}
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md border border-white/20 flex items-center gap-1">
            <Camera className="w-3 h-3 text-amber-400" />
            <span>{vehicle.gallery.length} Fotos</span>
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/30 shadow-xl flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Ver Ficha Técnica Completa</span>
          </span>
        </div>

        {/* Bottom Overlay Title & Subtitle */}
        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 drop-shadow-sm">
              {vehicle.categoryLabel}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-inter drop-shadow-md">
            {vehicle.name}
          </h3>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CARD CONTENT & SPECIFICATIONS
         ═══════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Price & Tagline */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-[200px] sm:max-w-xs">
                {vehicle.subtitle}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-semibold">
                <MapPin className="w-3 h-3 text-[#0B45D8]" />
                <span>Despacho em Talatona & Luanda</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#06142F] block">
                {vehicle.pricePerDayAOA.toLocaleString('pt-AO')} AOA
              </span>
              <span className="text-[11px] text-gray-500 font-bold">≈ €{vehicle.pricePerDayEUR}/dia</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {vehicle.description}
          </p>

          {/* 4 Core Quick Specs Icons (Harmonized Styling) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 rounded-2xl bg-gray-50/80 border border-gray-200/60 mb-4 text-[11px] text-gray-800">
            <div className="flex items-center gap-1.5" title="Capacidade de passageiros">
              <div className="w-6 h-6 rounded-lg bg-[#0B45D8]/10 flex items-center justify-center text-[#0B45D8] shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">{vehicle.specs.passengers} Lugares</span>
            </div>
            <div className="flex items-center gap-1.5" title="Capacidade de bagagem">
              <div className="w-6 h-6 rounded-lg bg-[#0B45D8]/10 flex items-center justify-center text-[#0B45D8] shrink-0">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">{vehicle.specs.luggage} Malas</span>
            </div>
            <div className="flex items-center gap-1.5" title="Transmissão">
              <div className="w-6 h-6 rounded-lg bg-[#0B45D8]/10 flex items-center justify-center text-[#0B45D8] shrink-0">
                <Settings2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold truncate">{vehicle.specs.transmission.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Tracção / Motor">
              <div className="w-6 h-6 rounded-lg bg-[#0B45D8]/10 flex items-center justify-center text-[#0B45D8] shrink-0">
                <Gauge className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold truncate">{vehicle.specs.traction.split(' ')[0]}</span>
            </div>
          </div>

          {/* 3 Value Inclusions Chips (Clear Information For Customer) */}
          <div className="space-y-1.5 mb-5 text-[11px] text-gray-700 bg-blue-50/40 p-3 rounded-2xl border border-blue-100/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">Seguro Total VIP com cobertura completa</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span className="font-medium">Motorista bilingue protocolar ou livre condução</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-medium">Substituição imediata garantida em &lt;45 min</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            INTERACTIVE ACTIONS & ACTIONABLE CTAs
           ═══════════════════════════════════════════════════════ */}
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 1. Quick Inspect */}
            <button
              type="button"
              onClick={() => onInspect(vehicle)}
              className="py-2.5 px-2.5 rounded-xl border border-gray-200 hover:border-[#0B45D8] text-gray-800 hover:text-[#0B45D8] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white hover:bg-blue-50/40"
            >
              <Eye className="w-3.5 h-3.5 text-[#0B45D8]" />
              <span>Ver Ficha</span>
            </button>

            {/* 2. Direct WhatsApp Fast Inquiry */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="py-2.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Consultar no WhatsApp oficial da Central"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* 3. Instant Reserve */}
            <button
              type="button"
              onClick={handleBookingClick}
              className={`text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md ${
                justBookedFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'btn-primary'
              }`}
            >
              {justBookedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selecionado!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar</span>
                </>
              )}
            </button>
          </div>

          {/* Compare Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleCompare(vehicle)}
            className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              isCompared
                ? 'bg-blue-50 border-[#0B45D8] text-[#0B45D8]'
                : 'bg-gray-50 border-gray-200/80 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {isCompared ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0B45D8]" />
                <span>Na Lista de Comparação (Clique para remover)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-gray-400" />
                <span>Comparar Especificações com Outras</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

