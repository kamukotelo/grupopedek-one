import React, { useState } from 'react';
import {
  Users,
  DoorClosed,
  Settings2,
  Gauge,
  Eye,
  Calendar,
  Check,
  Sparkles,
  Camera,
  ShieldCheck,
  MessageSquareText,
  Fuel,
  MapPin
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
  const studioImage = vehicle.primaryImage.replace('/rent_car/', '/rent_car_transparent/');
  const verifiedPhotoCount = vehicle.gallery.filter((image) => image.url.startsWith('/rent_car/')).length;
  const verifiedSecondaryImage = vehicle.secondaryImage?.startsWith('/rent_car/')
    ? vehicle.secondaryImage.replace('/rent_car/', '/rent_car_transparent/')
    : undefined;

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustBookedFeedback(true);
    onSelectBooking(vehicle.name);
    setTimeout(() => setJustBookedFeedback(false), 2000);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(generateVehicleWhatsAppUrl(vehicle.name, vehicle.pricePerDayAOA), '_blank');
  };

  return (
    <div className="rounded-3xl border border-[#D9DEE7] bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#D2A820]/70 transition-all duration-300 flex flex-col justify-between group">
      {/* ═══════════════════════════════════════════════════════
          DOMINANT VEHICLE SHOWROOM STAGE (Clean Studio Presentation)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="relative aspect-4/3 overflow-hidden bg-[#F8FAFC] bg-[url('/studio/fleet-studio-background.png')] bg-cover bg-center border-b border-[#D9DEE7] cursor-pointer select-none flex items-center justify-center p-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onInspect(vehicle)}
      >
        {/* Subtle Radial Stage Light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_75%,rgba(210,168,32,0.12)_0%,transparent_65%)] pointer-events-none" />

        {/* Primary Studio Cutout Image */}
        <img
          src={studioImage}
          alt={vehicle.name}
          className={`w-full h-full object-contain object-center transition-all duration-500 ease-out group-hover:scale-105 drop-shadow-[0_16px_18px_rgba(7,19,63,0.22)] ${
            isHovered && verifiedSecondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Secondary Angle / Interior Image (Crossfade on Hover) */}
        {verifiedSecondaryImage && (
          <img
            src={verifiedSecondaryImage}
            alt={`${vehicle.name} vista lateral/interior`}
            className={`absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-2xl transition-all duration-500 ease-out shadow-lg ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            loading="lazy"
          />
        )}

        {/* Top Badges Area */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {vehicle.badge && (
              <span className="px-3 py-1 rounded-full bg-[#07133F] text-[#D2A820] border border-[#D2A820]/30 text-[10.5px] font-black uppercase tracking-wider shadow-sm">
                {vehicle.badge}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-[#1E8E5A] text-white text-[10px] font-bold shadow-xs">
              {vehicle.availabilityTag || 'Disponível'}
            </span>
          </div>

          {/* Photo Count Chip */}
          <span className="px-2.5 py-1 rounded-full bg-[#07133F]/80 text-[#D2A820] text-[10px] font-bold backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-sm">
            <Camera className="w-3 h-3 text-[#D2A820]" />
            <span>{verifiedPhotoCount} {verifiedPhotoCount === 1 ? 'Foto' : 'Fotos'}</span>
          </span>
        </div>

        {/* Quick View Button Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10 backdrop-blur-[2px]">
          <span className="px-4 py-2 rounded-full bg-[#07133F] text-[#D2A820] font-black text-xs border border-[#D2A820] shadow-xl flex items-center gap-1.5 tracking-wide">
            <Eye className="w-4 h-4 text-[#D2A820]" />
            <span>Ver Ficha Técnica Completa</span>
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CARD CONTENT & SPECIFICATIONS
         ═══════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Header Title inside Content Area */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D2A820]" />
              <span className="text-[10.5px] font-black uppercase tracking-widest text-[#D2A820]">
                {vehicle.categoryLabel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#07133F] leading-snug">
              {vehicle.name}
            </h3>
          </div>

          {/* Price & Location Tag */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#D9DEE7]">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#1E8E5A] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#07133F]" />
                <span>Despacho em Talatona & Luanda</span>
              </div>
              <p className="text-[11px] text-[#697080] mt-0.5 font-medium">
                {vehicle.brand} · {vehicle.model}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg sm:text-xl font-black text-[#07133F] block leading-tight">
                {vehicle.pricePerDayFormatted}
              </span>
              <span className="text-[10px] text-[#697080] font-semibold uppercase tracking-wider block">
                por dia
              </span>
            </div>
          </div>

          <p className="text-xs text-[#697080] mb-4 leading-relaxed line-clamp-2">
            {vehicle.description}
          </p>

          {/* ═══════════════════════════════════════════════════════
              5 GOLD LINEAR ICONS INSIDE NAVY CIRCLES
             ═══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-5 gap-1.5 py-3 px-2 rounded-2xl bg-[#F3F5F8] border border-[#D9DEE7] mb-4 text-center">
            {/* 1. Passageiros */}
            <div className="flex flex-col items-center gap-1" title="Capacidade de passageiros">
              <div className="w-8 h-8 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                <Users className="w-4 h-4 text-[#D2A820]" />
              </div>
              <span className="text-[10px] font-bold text-[#07133F]">{vehicle.specs.passengers} Pass.</span>
            </div>

            {/* 2. Portas */}
            <div className="flex flex-col items-center gap-1" title="Número de portas">
              <div className="w-8 h-8 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                <DoorClosed className="w-4 h-4 text-[#D2A820]" />
              </div>
              <span className="text-[10px] font-bold text-[#07133F]">{vehicle.specs.doors} Portas</span>
            </div>

            {/* 3. Transmissão */}
            <div className="flex flex-col items-center gap-1" title="Transmissão">
              <div className="w-8 h-8 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                <Settings2 className="w-4 h-4 text-[#D2A820]" />
              </div>
              <span className="text-[10px] font-bold text-[#07133F] truncate max-w-[50px]">{vehicle.specs.transmission.split(' ')[0]}</span>
            </div>

            {/* 4. Combustível */}
            <div className="flex flex-col items-center gap-1" title="Tipo de combustível">
              <div className="w-8 h-8 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                <Fuel className="w-4 h-4 text-[#D2A820]" />
              </div>
              <span className="text-[10px] font-bold text-[#07133F] truncate max-w-[50px]">{vehicle.specs.fuelType.split(' ')[0]}</span>
            </div>

            {/* 5. Depósito / Tracção */}
            <div className="flex flex-col items-center gap-1" title={vehicle.specs.tankCapacity ? `Depósito: ${vehicle.specs.tankCapacity}` : 'Tracção'}>
              <div className="w-8 h-8 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                <Gauge className="w-4 h-4 text-[#D2A820]" />
              </div>
              <span className="text-[10px] font-bold text-[#07133F] truncate max-w-[50px]">
                {vehicle.specs.tankCapacity || vehicle.specs.traction?.split(' ')[0] || '4x4'}
              </span>
            </div>
          </div>

          {/* Quick Value Badge */}
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-[#07133F]">
            <ShieldCheck className="w-4 h-4 text-[#D2A820] shrink-0" />
            <span className="font-medium">Seguro Total VIP · Motorista Opcional · Apoio 24h</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            INTERACTIVE ACTIONS & CTAs
           ═══════════════════════════════════════════════════════ */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Ver Detalhes */}
            <button
              type="button"
              onClick={() => onInspect(vehicle)}
              className="py-2.5 px-2 rounded-xl border border-[#D9DEE7] hover:border-[#07133F] text-[#07133F] hover:bg-[#F3F5F8] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer bg-white"
            >
              <Eye className="w-3.5 h-3.5 text-[#07133F]" />
              <span className="hidden sm:inline">Ver detalhes</span>
              <span className="sm:hidden">Detalhes</span>
            </button>

            {/* 2. Direct WhatsApp Fast Inquiry */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              title="Consultar no WhatsApp oficial da Central"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* 3. Reservar Agora */}
            <button
              type="button"
              onClick={handleBookingClick}
              className={`text-xs font-black py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md ${
                justBookedFeedback
                  ? 'bg-[#1E8E5A] text-white'
                  : 'bg-[#D2A820] hover:bg-[#E1BB38] text-[#020A2A]'
              }`}
            >
              {justBookedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Pronto!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-[#020A2A]" />
                  <span className="hidden sm:inline">Reservar agora</span>
                  <span className="sm:hidden">Reservar</span>
                </>
              )}
            </button>
          </div>

          {/* Comparar Toggle */}
          <button
            type="button"
            onClick={() => onToggleCompare(vehicle)}
            className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              isCompared
                ? 'bg-amber-50 border-[#D2A820] text-[#020A2A] font-bold'
                : 'bg-[#F3F5F8] border-[#D9DEE7] text-[#697080] hover:bg-gray-100 hover:text-[#07133F]'
            }`}
          >
            {isCompared ? (
              <>
                <Check className="w-3 h-3 text-[#D2A820]" />
                <span>Na Lista de Comparação (Remover)</span>
              </>
            ) : (
              <span>+ Comparar com outras viaturas</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
