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
  ArrowRight
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';

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

  return (
    <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-2xl hover:border-[#0B45D8]/50 transition-all duration-300 flex flex-col justify-between group">
      {/* ═══════════════════════════════════════════════════════
          DOMINANT VEHICLE IMAGE AREA (Visual-First, Wide 16:9)
          Desktop: Crossfade to Secondary Image on Hover
         ═══════════════════════════════════════════════════════ */}
      <div
        className="relative h-64 sm:h-80 md:h-84 overflow-hidden bg-gray-950 cursor-pointer select-none"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

        {/* Top Badges Area */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {vehicle.badge && (
              <span className="px-3 py-1 rounded-full bg-[#0B45D8] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                {vehicle.badge}
              </span>
            )}
            {vehicle.availabilityTag && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs hidden sm:inline-block">
                {vehicle.availabilityTag}
              </span>
            )}
          </div>

          {/* Photo Count Chip */}
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md border border-white/20 flex items-center gap-1">
            <Camera className="w-3 h-3 text-[#0B45D8]" />
            <span>{vehicle.gallery.length} Fotos</span>
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/30 shadow-xl flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0B45D8]" />
            <span>Explorar Galeria & Specs</span>
          </span>
        </div>

        {/* Bottom Overlay Title & Subtitle */}
        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0B45D8] drop-shadow-sm block mb-0.5">
            {vehicle.categoryLabel}
          </span>
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
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px] sm:max-w-xs">
              {vehicle.subtitle}
            </p>
            <div className="text-right">
              <span className="text-sm font-black text-[#06142F] block">
                {vehicle.pricePerDayAOA.toLocaleString('pt-AO')} AOA
              </span>
              <span className="text-[10px] text-gray-400 font-bold">≈ €{vehicle.pricePerDayEUR}/dia</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-5 leading-relaxed line-clamp-2">
            {vehicle.description}
          </p>

          {/* 4 Core Quick Specs Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 px-3 rounded-2xl bg-gray-50 border border-gray-100 mb-5 text-[11px] text-gray-800">
            <div className="flex items-center gap-1.5" title="Capacidade de passageiros">
              <Users className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span className="font-semibold">{vehicle.specs.passengers} Lugares</span>
            </div>
            <div className="flex items-center gap-1.5" title="Capacidade de bagagem">
              <Briefcase className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span className="font-semibold">{vehicle.specs.luggage} Malas</span>
            </div>
            <div className="flex items-center gap-1.5" title="Transmissão">
              <Settings2 className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span className="font-semibold truncate">{vehicle.specs.transmission.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Tracção">
              <Gauge className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span className="font-semibold truncate">{vehicle.specs.traction.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            INTERACTIVE ACTIONS & COMPARATOR
           ═══════════════════════════════════════════════════════ */}
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Quick Inspect Button */}
            <button
              type="button"
              onClick={() => onInspect(vehicle)}
              className="py-3 px-3 rounded-xl border border-gray-200 hover:border-[#0B45D8] text-gray-800 hover:text-[#0B45D8] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white hover:bg-blue-50/50"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Galeria ({vehicle.gallery.length})</span>
            </button>

            {/* Instant Reserve Button */}
            <button
              type="button"
              onClick={handleBookingClick}
              className={`text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md ${
                justBookedFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'btn-primary'
              }`}
            >
              {justBookedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Selecionado!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Esta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
