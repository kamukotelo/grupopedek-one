import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Briefcase,
  Settings2,
  Gauge,
  ShieldCheck,
  Check,
  Phone,
  ArrowRight,
  Sparkles,
  Camera,
  Calendar
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

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

  // Reset index when vehicle changes
  useEffect(() => {
    setActiveImageIdx(0);
    setIsFullscreen(false);
  }, [vehicle]);

  // Keyboard navigation (Left, Right, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!vehicle) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveImageIdx((prev) => (prev + 1) % vehicle.gallery.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIdx((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vehicle, onClose]);

  if (!vehicle) return null;

  const currentImg = vehicle.gallery[activeImageIdx] || vehicle.gallery[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % vehicle.gallery.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);
  };

  // Mobile Touch Swipe
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-vehicle-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-7xl h-[96vh]' : 'max-w-5xl max-h-[92vh]'
        } bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-gray-200 animate-scaleUp flex flex-col transition-all duration-300`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#06142F] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0B45D8] text-[10px] font-extrabold uppercase tracking-wider text-white">
              {vehicle.categoryLabel}
            </span>
            <h3 id="gallery-vehicle-title" className="text-base sm:text-lg font-bold text-white truncate max-w-[280px] sm:max-w-md">
              {vehicle.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-bold"
              aria-label={isFullscreen ? 'Reduzir ecrã' : 'Ecrã inteiro'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'Reduzir' : 'Expandir'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fechar galeria"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 flex flex-col bg-gray-900">
          {/* ═══════════════════════════════════════════════════════
              HERO LARGE IMAGE SHOWCASE (Dominant Visual)
             ═══════════════════════════════════════════════════════ */}
          <div
            className="relative w-full h-[320px] sm:h-[440px] md:h-[500px] bg-black flex items-center justify-center overflow-hidden shrink-0 group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Active Image with Eager Loading & High Res */}
            <img
              key={currentImg.url}
              src={currentImg.url}
              alt={currentImg.altText}
              className="w-full h-full object-cover object-center transition-all duration-300 animate-fadeIn"
              fetchPriority="high"
            />

            {/* Subtle Vignette for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Left / Right Arrow Controls (Desktop) */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#0B45D8] transition-all cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100 hover:scale-110"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#0B45D8] transition-all cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100 hover:scale-110"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Photo Counter Pill & Caption */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-white max-w-xl">
                <p className="text-xs sm:text-sm font-semibold">{currentImg.caption}</p>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white text-xs font-mono font-bold shrink-0">
                <Camera className="w-3.5 h-3.5 inline mr-1 text-[#0B45D8]" />
                <span>{activeImageIdx + 1} / {vehicle.gallery.length}</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              THUMBNAILS CAROUSEL (Clickable)
             ═══════════════════════════════════════════════════════ */}
          <div className="bg-[#06142F] px-4 py-3 border-b border-white/10 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0">
            {vehicle.gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#0B45D8] scale-105 shadow-[0_0_15px_rgba(11,69,216,0.8)]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Ver foto ${idx + 1}: ${img.caption}`}
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
          </div>

          {/* ═══════════════════════════════════════════════════════
              VEHICLE SPECIFICATIONS & INCLUSIONS (White Canvas)
             ═══════════════════════════════════════════════════════ */}
          <div className="p-6 sm:p-8 bg-white space-y-6 flex-1 text-gray-900">
            {/* Header & Starting Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0B45D8] block mb-1">
                  {vehicle.subtitle}
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#06142F] font-inter">
                  {vehicle.name}
                </h4>
              </div>

              <div className="text-left sm:text-right bg-blue-50/70 p-3.5 px-5 rounded-2xl border border-blue-100 shrink-0">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Tarifa Diária Indicativa</span>
                <div className="text-xl sm:text-2xl font-black text-[#06142F]">
                  {vehicle.pricePerDayAOA.toLocaleString('pt-AO')} AOA
                </div>
                <span className="text-xs font-bold text-[#0B45D8]">≈ €{vehicle.pricePerDayEUR} EUR / dia</span>
              </div>
            </div>

            {/* Description Narrative */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {vehicle.description}
            </p>

            {/* 4 Core Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#0B45D8]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Lotação</span>
                  <span className="font-extrabold text-gray-900">{vehicle.specs.passengers} Ocupantes</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#0B45D8]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Bagageira</span>
                  <span className="font-extrabold text-gray-900">{vehicle.specs.luggage} Malas Grandes</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#0B45D8]">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Transmissão</span>
                  <span className="font-extrabold text-gray-900">{vehicle.specs.transmission}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#0B45D8]">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Tracção</span>
                  <span className="font-extrabold text-gray-900">{vehicle.specs.traction}</span>
                </div>
              </div>
            </div>

            {/* Technical Highlights & Engine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <h5 className="font-bold text-[#06142F] uppercase tracking-wider text-[11px]">Motorização & Performance</h5>
                <p className="text-gray-700"><strong>Motor:</strong> {vehicle.specs.engine}</p>
                <p className="text-gray-700"><strong>Combustível:</strong> {vehicle.specs.fuelType}</p>
                {vehicle.specs.armorProtection && (
                  <p className="text-[#0B45D8] font-bold"><strong>Segurança:</strong> {vehicle.specs.armorProtection}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <h5 className="font-bold text-[#06142F] uppercase tracking-wider text-[11px]">Conforto & Conectividade</h5>
                <p className="text-gray-700"><strong>Climatização:</strong> {vehicle.specs.airConditioning}</p>
                <p className="text-gray-700"><strong>Conexão:</strong> {vehicle.specs.connectivity}</p>
              </div>
            </div>

            {/* Standard Inclusions Checklist */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Padrão de Serviço & Inclusões PEPEK GRUPO
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Assurance Banner */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center gap-3 text-xs text-[#06142F]">
              <ShieldCheck className="w-6 h-6 text-[#0B45D8] shrink-0" />
              <span>
                <strong>Garantia de Substituição Operacional:</strong> Em caso de qualquer contingência mecânica, garantimos a alocação imediata de viatura de categoria equivalente ou superior nas 18 províncias.
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            STICKY ACTION FOOTER (High-Impact CTAs)
           ═══════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 hidden sm:block">
            <span>Disponibilidade imediata na Central de Talatona</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onSelectForBooking(vehicle.name);
                onClose();
              }}
              className="btn-primary w-full sm:w-auto text-xs font-bold py-3.5 px-7 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Este Modelo Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={generateQuickWhatsAppUrl(`Proposta Imediata para ${vehicle.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Imediato</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
