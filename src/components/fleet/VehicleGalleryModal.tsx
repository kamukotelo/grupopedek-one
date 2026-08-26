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
import { getFleetPeopleFreeInteriors } from '../../data/fleetUpgradeGallery';
import { FLEET_IMAGE_REVIEW_PLACEHOLDER, isFleetLocalImageApproved } from '../../data/fleetImagePolicy';
import { generateVehicleWhatsAppUrl } from '../../lib/whatsapp';
import { getVehicleStudioBackground } from '../../data/fleetPresentation';

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
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const isFlyerCollection = vehicle?.visualCollection === 'flyer';
  const peopleFreeInteriors = vehicle ? getFleetPeopleFreeInteriors(vehicle.id) : [];
  const localImageApproved = vehicle ? isFlyerCollection || isFleetLocalImageApproved(vehicle.id) : false;
  const originalLocalGallery = localImageApproved
    ? (vehicle?.gallery ?? []).filter((image) => isFlyerCollection || image.url.startsWith('/rent_car/'))
    : [];
  // A pesquisa externa permanece apenas no acervo de apoio. A frota pública
  // aceita somente material próprio/local ou produzido para este projeto.
  // A capa exterior vem sempre do catálogo oficial com fundo transparente.
  // As únicas imagens adicionais publicadas são interiores sem pessoas.
  const publicGallery = [...originalLocalGallery, ...peopleFreeInteriors];
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

  useEffect(() => {
    if (!vehicle || verifiedGallery.length < 2 || isAutoPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveImageIdx((current) => (current + 1) % verifiedGallery.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [vehicle, verifiedGallery.length, isAutoPaused]);

  if (!vehicle) return null;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#09172C]/90 backdrop-blur-lg animate-fadeIn select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-7xl h-[96vh]' : 'max-w-5xl max-h-[92vh]'
        } bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto border border-[#E2E8F0] animate-scaleUp flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="bg-[#09172C] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#FEC228] text-[10px] font-extrabold uppercase tracking-wider text-[#09172C]">
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
          {/* Complete visual dossier: the selected vehicle and every available view. */}
          <div
            className="relative w-full shrink-0 bg-[#D9DDE2] p-2 sm:p-3"
            style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}
            onMouseEnter={() => setIsAutoPaused(true)}
            onMouseLeave={() => setIsAutoPaused(false)}
            onFocusCapture={() => setIsAutoPaused(true)}
            onBlurCapture={() => setIsAutoPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative z-10 grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl bg-[#0C3D73] shadow-2xl">
              <button type="button" onClick={() => setActiveImageIdx(0)} className="group relative col-span-2 h-[260px] overflow-hidden bg-[#174B86] sm:h-[390px]">
                <img src={verifiedGallery[0].url} alt={verifiedGallery[0].altText} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.025] sm:p-7" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#09172C]/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{verifiedGallery[0].caption}</span>
              </button>
              {verifiedGallery.slice(1, 5).map((image, index) => (
                <button key={image.url} type="button" onClick={() => setActiveImageIdx(index + 1)} className="group relative h-36 overflow-hidden bg-[#174B86] sm:h-52">
                  <img src={image.url} alt={image.altText} className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${image.type === 'interior' ? 'object-cover' : 'object-contain p-3'}`} loading="lazy" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09172C] to-transparent px-3 pb-2 pt-8 text-left text-[11px] font-bold text-white sm:text-xs">{image.caption}</span>
                </button>
              ))}
              {Array.from({ length: Math.max(0, 5 - verifiedGallery.length) }).map((_, index) => (
                <div key={`pending-${index}`} className="flex h-36 items-center justify-center bg-[#174B86]/90 p-4 text-center sm:h-52">
                  <div><Camera className="mx-auto mb-2 h-6 w-6 text-[#FEC228]" /><p className="text-xs font-bold text-white">Vista em produção e validação</p><p className="mt-1 text-[10px] text-white/65">Sem imagem genérica</p></div>
                </div>
              ))}
            </div>

            {/* Left / Right Nav */}
            {verifiedGallery.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#FEC228] hover:text-[#09172C] transition-all cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#FEC228] hover:text-[#09172C] transition-all cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="pointer-events-none absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-[#09172C]/90 px-3 py-1.5 text-xs font-bold text-[#FEC228] backdrop-blur"><Camera className="mr-1 inline h-3.5 w-3.5" />{verifiedGallery.length} {verifiedGallery.length === 1 ? 'Foto' : 'Fotos'}</div>
          </div>

          {/* Thumbnails Bar */}
          {verifiedGallery.length > 1 && <div className="bg-[#09172C] px-4 py-3 border-b border-white/10 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0">
            {verifiedGallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#FEC228] scale-105 shadow-[0_0_15px_rgba(210,168,32,0.8)]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText}
                  className={img.type === 'interior' ? 'w-full h-full object-cover' : 'w-full h-full object-contain p-1'}
                  loading="lazy"
                />
                <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1 py-0.2 rounded font-mono text-white">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>}

          {/* Specs & Full Content (White Canvas) */}
          <div className="p-6 sm:p-8 bg-white space-y-6 flex-1 text-[#09172C]">
            {/* Header & Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FEC228] block mb-1">
                  {vehicle.brand} · {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#09172C]">
                  {vehicle.name}
                </h4>
              </div>

              <div className="text-left sm:text-right bg-[#F5F6F6] p-4 px-6 rounded-2xl border border-[#E2E8F0] shrink-0">
                <span className="text-[10px] text-[#555B64] font-bold uppercase block">Tarifa Oficial por Dia</span>
                <div className="text-xl sm:text-2xl font-extrabold text-[#09172C]">
                  {vehicle.pricePerDayFormatted}
                </div>
                <span className="text-xs font-bold text-[#236199]">Disponibilidade em Talatona & Luanda</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#555B64] leading-relaxed">
              {vehicle.description}
            </p>

            {/* 5 Core Specs Grid with Gold Icons inside Navy Circles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                  <Users className="w-5 h-5 text-[#FEC228]" />
                </div>
                <div>
                  <span className="text-[#555B64] block text-[10px] uppercase font-bold">Lotação</span>
                  <span className="font-extrabold text-[#09172C]">{vehicle.specs.passengers} Passageiros</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                  <DoorClosed className="w-5 h-5 text-[#FEC228]" />
                </div>
                <div>
                  <span className="text-[#555B64] block text-[10px] uppercase font-bold">Portas</span>
                  <span className="font-extrabold text-[#09172C]">{vehicle.specs.doors} Portas</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                  <Settings2 className="w-5 h-5 text-[#FEC228]" />
                </div>
                <div>
                  <span className="text-[#555B64] block text-[10px] uppercase font-bold">Transmissão</span>
                  <span className="font-extrabold text-[#09172C]">{vehicle.specs.transmission}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                  <Fuel className="w-5 h-5 text-[#FEC228]" />
                </div>
                <div>
                  <span className="text-[#555B64] block text-[10px] uppercase font-bold">Combustível</span>
                  <span className="font-extrabold text-[#09172C]">{vehicle.specs.fuelType}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#09172C] flex items-center justify-center text-[#FEC228] shrink-0 shadow-xs">
                  <Gauge className="w-5 h-5 text-[#FEC228]" />
                </div>
                <div>
                  <span className="text-[#555B64] block text-[10px] uppercase font-bold">Depósito / Tracção</span>
                  <span className="font-extrabold text-[#09172C]">{vehicle.specs.tankCapacity || vehicle.specs.traction || 'Integral'}</span>
                </div>
              </div>
            </div>

            {/* Features & Inclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0] space-y-2.5">
                <h5 className="font-bold text-[#09172C] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FEC228]" />
                  Equipamentos & Tecnologia
                </h5>
                <ul className="space-y-1.5 text-[#555B64]">
                  {vehicle.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FEC228]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0] space-y-2.5">
                <h5 className="font-bold text-[#09172C] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#236199]" />
                  Inclusões & Garantias Pepek
                </h5>
                <ul className="space-y-1.5 text-[#555B64]">
                  {vehicle.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#236199] shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#555B64] hidden sm:block">
            <span>Faturação e cotação oficial disponível para empresas e particulares</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onSelectForBooking(vehicle.name);
                onClose();
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#FEC228] hover:bg-[#FFD45F] text-[#09172C] text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Agora ({vehicle.pricePerDayFormatted}/dia)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#236199] hover:bg-[#0C2E60] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
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
