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
import { getFleetUpgradePhotoCount } from '../../data/fleetUpgradeGallery';
import { FLEET_IMAGE_REVIEW_PLACEHOLDER, isFleetLocalImageApproved } from '../../data/fleetImagePolicy';
import { generateVehicleWhatsAppUrl } from '../../lib/whatsapp';
import { getVehicleStudioBackground } from '../../data/fleetPresentation';

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
  const isFlyerCollection = vehicle.visualCollection === 'flyer';
  const upgradePhotoCount = getFleetUpgradePhotoCount(vehicle.id);
  const localImageApproved = isFlyerCollection || isFleetLocalImageApproved(vehicle.id);
  const studioImage = !localImageApproved ? FLEET_IMAGE_REVIEW_PLACEHOLDER : vehicle.primaryImage.startsWith('/rent_car/')
    ? vehicle.primaryImage.replace('/rent_car/', '/rent_car_hd/')
    : vehicle.primaryImage;
  const localPhotoCount = localImageApproved
    ? vehicle.gallery?.filter((image) => isFlyerCollection || image.url.startsWith('/rent_car/')).length || 1
    : 0;
  const verifiedPhotoCount = upgradePhotoCount + localPhotoCount;
  // Não cruzar o acervo premium com uma fotografia antiga durante o hover.
  const verifiedSecondaryImage = localImageApproved && vehicle.secondaryImage
    ? vehicle.secondaryImage.startsWith('/rent_car/')
      ? vehicle.secondaryImage.replace('/rent_car/', '/rent_car_hd/')
      : vehicle.secondaryImage
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
    <div className="rounded-2xl border border-[#236199]/55 bg-[#174B86] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:border-[#FEC228]/80 transition-all duration-300 flex flex-col justify-between group">
      {/* ═══════════════════════════════════════════════════════
          DOMINANT VEHICLE SHOWROOM STAGE (Clean Studio Presentation)
         ═══════════════════════════════════════════════════════ */}
      <div
        style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}
        className="relative aspect-4/3 overflow-hidden bg-[#09172C] bg-cover bg-center border-b border-[#E2E8F0] cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onInspect(vehicle)}
      >
        {/* A fotografia ocupa sempre toda a área do card. */}
        <img
          src={studioImage}
          alt={vehicle.name}
          className={`absolute inset-0 w-full h-full object-center object-contain p-8 sm:p-10 drop-shadow-[0_18px_16px_rgba(9,23,44,0.45)] transition-all duration-500 ease-out group-hover:scale-[1.025] ${
            isHovered && verifiedSecondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Secondary Angle / Interior Image (Crossfade on Hover) */}
        {verifiedSecondaryImage && (
          <img
            src={verifiedSecondaryImage}
            alt={`${vehicle.name} vista lateral/interior`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            loading="lazy"
          />
        )}

        {/* Top Badges Area */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {vehicle.badge && (
              <span className="px-3 py-1 rounded-full bg-[#09172C] text-[#FEC228] border border-[#FEC228]/30 text-[10.5px] font-extrabold uppercase tracking-wider shadow-sm">
                {vehicle.badge}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-[#236199] text-white text-[10px] font-bold shadow-xs">
              Sob confirmação
            </span>
          </div>

          {/* Photo Count Chip */}
          <span className="px-2.5 py-1 rounded-full bg-[#09172C]/80 text-[#FEC228] text-[10px] font-bold backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-sm">
            <Camera className="w-3 h-3 text-[#FEC228]" />
            <span>{verifiedPhotoCount ? `${verifiedPhotoCount} ${verifiedPhotoCount === 1 ? 'Foto' : 'Fotos'}` : 'Imagens em revisão'}</span>
          </span>
        </div>

        {/* Quick View Button Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/15">
          <span className="px-4 py-2 rounded-full bg-[#09172C] text-[#FEC228] font-extrabold text-xs border border-[#FEC228] shadow-xl flex items-center gap-1.5 tracking-wide">
            <Eye className="w-4 h-4 text-[#FEC228]" />
            <span>Ver Ficha Técnica Completa</span>
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CARD CONTENT & SPECIFICATIONS
         ═══════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-[#174B86] text-white">
        <div>
          {/* Header Title inside Content Area */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FEC228]" />
              <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#FEC228]">
                {vehicle.categoryLabel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
              {vehicle.name}
            </h3>
          </div>

          {/* Price & Location Tag */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-white/35">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/85 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#FEC228]" />
                <span>Despacho em Talatona & Luanda</span>
              </div>
              <p className="text-[11px] text-white/55 mt-0.5 font-medium">
                {vehicle.brand} · {vehicle.model}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg sm:text-xl font-extrabold text-[#FEC228] block leading-tight">
                {vehicle.pricePerDayFormatted}
              </span>
              <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider block">
                {isFlyerCollection ? 'Full Day' : 'por dia'}
              </span>
              {vehicle.transferPriceFormatted && (
                <span className="text-[10px] text-white font-bold block mt-1">
                  Transfer: {vehicle.transferPriceFormatted}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-white/70 mb-4 leading-relaxed line-clamp-2">
            {vehicle.description}
          </p>

          {/* ═══════════════════════════════════════════════════════
              5 GOLD LINEAR ICONS INSIDE NAVY CIRCLES
             ═══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-5 gap-1.5 py-3 px-2 rounded-2xl bg-[#0C3D73] border border-white/15 mb-4 text-center">
            {/* 1. Passageiros */}
            <div className="flex flex-col items-center gap-1" title="Capacidade de passageiros">
              <div className="w-8 h-8 rounded-lg bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                <Users className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white">{vehicle.specs.passengers} Pass.</span>
            </div>

            {/* 2. Portas */}
            <div className="flex flex-col items-center gap-1" title="Número de portas">
              <div className="w-8 h-8 rounded-lg bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                <DoorClosed className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white">{vehicle.specs.doors} Portas</span>
            </div>

            {/* 3. Transmissão */}
            <div className="flex flex-col items-center gap-1" title="Transmissão">
              <div className="w-8 h-8 rounded-lg bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                <Settings2 className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-[50px]">{vehicle.specs.transmission.split(' ')[0]}</span>
            </div>

            {/* 4. Combustível */}
            <div className="flex flex-col items-center gap-1" title="Tipo de combustível">
              <div className="w-8 h-8 rounded-lg bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                <Fuel className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-[50px]">{vehicle.specs.fuelType.split(' ')[0]}</span>
            </div>

            {/* 5. Depósito / Tracção */}
            <div className="flex flex-col items-center gap-1" title={vehicle.specs.tankCapacity ? `Depósito: ${vehicle.specs.tankCapacity}` : 'Tracção'}>
              <div className="w-8 h-8 rounded-lg bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                <Gauge className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-[50px]">
                {vehicle.specs.tankCapacity || vehicle.specs.traction?.split(' ')[0] || '4x4'}
              </span>
            </div>
          </div>

          {/* Quick Value Badge */}
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-[#FEC228] border border-[#E4AD28] text-[11px] text-[#09172C]">
            <ShieldCheck className="w-4 h-4 text-[#09172C] shrink-0" />
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
              className="py-2.5 px-2 rounded-xl border border-white/40 hover:border-[#FEC228] text-white hover:bg-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer bg-transparent"
            >
              <Eye className="w-3.5 h-3.5 text-[#FEC228]" />
              <span className="hidden sm:inline">Ver detalhes</span>
              <span className="sm:hidden">Detalhes</span>
            </button>

            {/* 2. Direct WhatsApp Fast Inquiry */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="py-2.5 px-2 rounded-xl bg-[#236199] hover:bg-[#0C2E60] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              title="Consultar no WhatsApp oficial da Central"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* 3. Reservar Agora */}
            <button
              type="button"
              onClick={handleBookingClick}
              className={`text-xs font-extrabold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md ${
                justBookedFeedback
                  ? 'bg-[#236199] text-white'
                  : 'bg-[#FEC228] hover:bg-[#FFD45F] text-[#09172C]'
              }`}
            >
              {justBookedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Pronto!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-[#09172C]" />
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
                ? 'bg-[#FEC228] border-[#FEC228] text-[#09172C] font-bold'
                : 'bg-[#F5F6F6] border-[#E2E8F0] text-[#555B64] hover:bg-gray-100 hover:text-[#09172C]'
            }`}
          >
            {isCompared ? (
              <>
                <Check className="w-3 h-3 text-[#FEC228]" />
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
