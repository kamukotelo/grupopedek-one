import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  DoorClosed,
  Settings2,
  Gauge,
  ShieldCheck,
  Check,
  Phone,
  ArrowRight,
  Sparkles,
  Camera,
  Calendar,
  Fuel,
  Palette,
  Snowflake,
  MessageSquareText
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { FLEET_UPGRADE_GALLERY } from '../../data/fleetUpgradeGallery';
import { FLEET_IMAGE_REVIEW_PLACEHOLDER, isFleetLocalImageApproved } from '../../data/fleetImagePolicy';
import { generateVehicleWhatsAppUrl } from '../../lib/whatsapp';

interface VehicleGalleryModalProps {
  vehicle: VehicleDetail | null;
  onClose: () => void;
  onSelectForBooking: (vehicleName: string) => void;
}

export const VehicleGalleryModal: React.FC<VehicleGalleryModalProps> = ({
  vehicle,
  onClose,
  onSelectForBooking
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const upgradeGallery = vehicle ? FLEET_UPGRADE_GALLERY[vehicle.id] ?? [] : [];
  const localImageApproved = vehicle ? isFleetLocalImageApproved(vehicle.id) : false;
  const originalLocalGallery = localImageApproved
    ? (vehicle?.gallery ?? []).filter((image) => image.url.startsWith('/rent_car/'))
    : [];
  // A pesquisa externa permanece apenas no acervo de apoio. A frota pública
  // aceita somente material próprio/local ou produzido para este projeto.
  const publicGallery = upgradeGallery.length ? upgradeGallery : originalLocalGallery;
  const verifiedGallery = (publicGallery.length ? publicGallery : [{
    url: FLEET_IMAGE_REVIEW_PLACEHOLDER,
    caption: 'Imagens desta viatura em revisão',
    altText: `${vehicle?.name ?? 'Viatura'} — imagens em revisão`,
    type: 'context' as const
  }]).map((image) => ({
    ...image,
    url: image.url.startsWith('/rent_car/')
      ? image.url.replace('/rent_car/', '/rent_car_hd/')
      : image.url
  }));

  // Reset index when vehicle changes
  useEffect(() => {
    setActiveImageIdx(0);
    setIsFullscreen(false);
  }, [vehicle]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!vehicle) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveImageIdx((prev) => (prev + 1) % verifiedGallery.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIdx((prev) => (prev - 1 + verifiedGallery.length) % verifiedGallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vehicle, onClose, verifiedGallery.length]);

  if (!vehicle) return null;

  const currentImg = verifiedGallery[activeImageIdx] || verifiedGallery[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % verifiedGallery.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + verifiedGallery.length) % verifiedGallery.length);
  };

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handleWhatsApp = () => {
    window.open(generateVehicleWhatsAppUrl(vehicle.name, vehicle.pricePerDayAOA), '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#020A2A]/90 backdrop-blur-lg animate-fadeIn select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-7xl h-[96vh]' : 'max-w-5xl max-h-[92vh]'
        } bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-[#D9DEE7] animate-scaleUp flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="bg-[#020A2A] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#D2A820] text-[10px] font-black uppercase tracking-wider text-[#020A2A]">
              {vehicle.categoryLabel}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[280px] sm:max-w-md">
              {vehicle.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-bold"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'Reduzir' : 'Expandir'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 flex flex-col bg-gray-950">
          {/* Main Visual Display */}
          <div
            className={`relative w-full h-[320px] sm:h-[440px] md:h-[480px] flex items-center justify-center overflow-hidden shrink-0 group ${
              'bg-[#F8FAFC] bg-cover bg-center p-8 sm:p-12'
            }`}
            style={{ backgroundImage: "url('/studio/fleet-studio-background.png')" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Subtle Studio Spotlight for cutouts */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_75%,rgba(210,168,32,0.12)_0%,transparent_68%)] pointer-events-none" />

            <img
              key={currentImg.url}
              src={currentImg.url}
              alt={currentImg.altText}
              className="transition-all duration-300 animate-fadeIn w-full h-full object-contain object-center drop-shadow-[0_24px_30px_rgba(7,19,63,0.28)] relative z-10"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Left / Right Nav */}
            {verifiedGallery.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#D2A820] hover:text-[#020A2A] transition-all cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#D2A820] hover:text-[#020A2A] transition-all cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Caption & Counter */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-white max-w-xl">
                <p className="text-xs sm:text-sm font-semibold">{currentImg.caption}</p>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white text-xs font-mono font-bold shrink-0">
                <Camera className="w-3.5 h-3.5 inline mr-1 text-[#D2A820]" />
                <span>{activeImageIdx + 1} / {verifiedGallery.length}</span>
              </div>
            </div>
          </div>

          {/* Thumbnails Bar */}
          {verifiedGallery.length > 1 && <div className="bg-[#020A2A] px-4 py-3 border-b border-white/10 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0">
            {verifiedGallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#D2A820] scale-105 shadow-[0_0_15px_rgba(210,168,32,0.8)]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1 py-0.2 rounded font-mono text-white">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>}

          {/* Specs & Full Content (White Canvas) */}
          <div className="p-6 sm:p-8 bg-white space-y-6 flex-1 text-[#07133F]">
            {/* Header & Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9DEE7]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D2A820] block mb-1">
                  {vehicle.brand} · {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#07133F]">
                  {vehicle.name}
                </h4>
              </div>

              <div className="text-left sm:text-right bg-[#F3F5F8] p-4 px-6 rounded-2xl border border-[#D9DEE7] shrink-0">
                <span className="text-[10px] text-[#697080] font-bold uppercase block">Tarifa Oficial por Dia</span>
                <div className="text-xl sm:text-2xl font-black text-[#07133F]">
                  {vehicle.pricePerDayFormatted}
                </div>
                <span className="text-xs font-bold text-[#1E8E5A]">Disponibilidade em Talatona & Luanda</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#697080] leading-relaxed">
              {vehicle.description}
            </p>

            {/* 5 Core Specs Grid with Gold Icons inside Navy Circles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#F3F5F8] border border-[#D9DEE7] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                  <Users className="w-5 h-5 text-[#D2A820]" />
                </div>
                <div>
                  <span className="text-[#697080] block text-[10px] uppercase font-bold">Lotação</span>
                  <span className="font-extrabold text-[#07133F]">{vehicle.specs.passengers} Passageiros</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                  <DoorClosed className="w-5 h-5 text-[#D2A820]" />
                </div>
                <div>
                  <span className="text-[#697080] block text-[10px] uppercase font-bold">Portas</span>
                  <span className="font-extrabold text-[#07133F]">{vehicle.specs.doors} Portas</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                  <Settings2 className="w-5 h-5 text-[#D2A820]" />
                </div>
                <div>
                  <span className="text-[#697080] block text-[10px] uppercase font-bold">Transmissão</span>
                  <span className="font-extrabold text-[#07133F]">{vehicle.specs.transmission}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                  <Fuel className="w-5 h-5 text-[#D2A820]" />
                </div>
                <div>
                  <span className="text-[#697080] block text-[10px] uppercase font-bold">Combustível</span>
                  <span className="font-extrabold text-[#07133F]">{vehicle.specs.fuelType}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#07133F] flex items-center justify-center text-[#D2A820] shrink-0 shadow-xs">
                  <Gauge className="w-5 h-5 text-[#D2A820]" />
                </div>
                <div>
                  <span className="text-[#697080] block text-[10px] uppercase font-bold">Depósito / Tracção</span>
                  <span className="font-extrabold text-[#07133F]">{vehicle.specs.tankCapacity || vehicle.specs.traction || 'Integral'}</span>
                </div>
              </div>
            </div>

            {/* Features & Inclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#F3F5F8] border border-[#D9DEE7] space-y-2.5">
                <h5 className="font-bold text-[#07133F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D2A820]" />
                  Equipamentos & Tecnologia
                </h5>
                <ul className="space-y-1.5 text-[#697080]">
                  {vehicle.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D2A820]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#F3F5F8] border border-[#D9DEE7] space-y-2.5">
                <h5 className="font-bold text-[#07133F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1E8E5A]" />
                  Inclusões & Garantias Pepek
                </h5>
                <ul className="space-y-1.5 text-[#697080]">
                  {vehicle.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1E8E5A] shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#697080] hidden sm:block">
            <span>Faturação e cotação oficial disponível para empresas e particulares</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onSelectForBooking(vehicle.name);
                onClose();
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#D2A820] hover:bg-[#E1BB38] text-[#020A2A] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Agora ({vehicle.pricePerDayFormatted}/dia)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>WhatsApp Imediato</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
