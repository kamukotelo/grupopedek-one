import React, { useState } from 'react';
import {
  Users,
  DoorClosed,
  Settings2,
  Gauge,
  Eye,
  Calendar,
  Check,
  Camera,
  ShieldCheck,
  MessageSquareText,
  Fuel
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { getFleetUpgradePhotoCount } from '../../data/fleetUpgradeGallery';
import { FLEET_IMAGE_REVIEW_PLACEHOLDER, isFleetLocalImageApproved } from '../../data/fleetImagePolicy';
import { generateVehicleWhatsAppUrl } from '../../lib/whatsapp';
import { getFleetImageScale, getVehicleStudioBackground } from '../../data/fleetPresentation';

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
    <div className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-[#3A72A8] bg-[#20558D] shadow-[0_16px_32px_rgba(9,23,44,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FEC228] hover:shadow-[0_24px_42px_rgba(9,23,44,0.28)]">
      {/* ═══════════════════════════════════════════════════════
          DOMINANT VEHICLE SHOWROOM STAGE (Clean Studio Presentation)
         ═══════════════════════════════════════════════════════ */}
      <div
        style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}
        className="relative aspect-[16/10] overflow-hidden bg-[#20558D] bg-cover bg-center border-b border-[#3A72A8] cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onInspect(vehicle)}
      >
        {/* A fotografia ocupa sempre toda a área do card. */}
        <img
          src={studioImage}
          alt={vehicle.name}
          style={{ '--fleet-image-scale': getFleetImageScale(vehicle.id) } as React.CSSProperties}
          className={`fleet-vehicle-image absolute inset-0 h-full w-full object-center object-contain p-7 sm:p-9 drop-shadow-[0_18px_16px_rgba(9,23,44,0.45)] ${
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
      <div className="flex flex-1 flex-col justify-between bg-[#20558D] p-5 text-white sm:p-6">
        <div>
          <h3 className="mb-4 text-2xl font-extrabold leading-tight text-white sm:text-[1.7rem]">{vehicle.name}</h3>

          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[#FEC228] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#09172C]">
              {vehicle.categoryLabel}
            </span>
            <span className="rounded-lg border-2 border-white px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
              {vehicle.specs.transmission}
            </span>
          </div>

          {/* ═══════════════════════════════════════════════════════
              5 GOLD LINEAR ICONS INSIDE NAVY CIRCLES
             ═══════════════════════════════════════════════════════ */}
          <div className="mb-5 grid grid-cols-5 gap-1.5 border-b border-white/45 pb-4 text-center">
            {/* 1. Passageiros */}
            <div className="flex flex-col items-center gap-1" title="Capacidade de passageiros">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#174B86] text-[#FEC228] shadow-xs">
                <Users className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white">{vehicle.specs.passengers} Pass.</span>
            </div>

            {/* 2. Portas */}
            <div className="flex flex-col items-center gap-1" title="Número de portas">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#174B86] text-[#FEC228] shadow-xs">
                <DoorClosed className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white">{vehicle.specs.doors} Portas</span>
            </div>

            {/* 3. Transmissão */}
            <div className="flex flex-col items-center gap-1" title="Transmissão">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#174B86] text-[#FEC228] shadow-xs">
                <Settings2 className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-[50px]">{vehicle.specs.transmission.split(' ')[0]}</span>
            </div>

            {/* 4. Combustível */}
            <div className="flex flex-col items-center gap-1" title="Tipo de combustível">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#174B86] text-[#FEC228] shadow-xs">
                <Fuel className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-[50px]">{vehicle.specs.fuelType.split(' ')[0]}</span>
            </div>

            {/* 5. Depósito / Tracção */}
            <div className="flex flex-col items-center gap-1" title={vehicle.specs.tankCapacity ? `Depósito: ${vehicle.specs.tankCapacity}` : 'Tracção'}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#174B86] text-[#FEC228] shadow-xs">
                <Gauge className="w-4 h-4 text-[#FEC228]" />
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-[50px]">
                {vehicle.specs.tankCapacity || vehicle.specs.traction?.split(' ')[0] || '4x4'}
              </span>
            </div>
          </div>

          <div className="mb-5">
            <span className="block text-sm font-medium text-white/75">A partir de</span>
            <strong className="mt-1 block text-[1.8rem] font-extrabold leading-tight text-[#FEC228]">
              {vehicle.pricePerDayFormatted} <span className="whitespace-nowrap text-xl">/ dia</span>
            </strong>
            {vehicle.transferPriceFormatted && <span className="mt-1 block text-xs font-semibold text-white/80">Transfer: {vehicle.transferPriceFormatted}</span>}
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#FEC228]/40 bg-[#174B86]/55 px-3 py-2 text-[11px] text-white">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#FEC228]" />
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
