import React from 'react';
import { X, Users, Briefcase, Settings2, Gauge, ShieldCheck, Check, Phone, ArrowRight } from 'lucide-react';
import { VehicleCategory } from '../../types';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

interface VehicleModalProps {
  vehicle: VehicleCategory | null;
  onClose: () => void;
  onSelectForBooking: (vehicleName: string) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, onSelectForBooking }) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-scaleUp">
        {/* Header Bar */}
        <div className="relative h-72 sm:h-80 bg-gray-950 overflow-hidden shrink-0">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
            aria-label="Fechar detalhes da viatura"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Vehicle Title & Badge */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            {vehicle.badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-[#236199] text-[11px] font-extrabold uppercase tracking-wider mb-2 shadow">
                {vehicle.badge}
              </span>
            )}
            <span className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              {vehicle.subtitle}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-inter">
              {vehicle.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Narrative */}
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white shadow-xs text-[#236199]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Lotação</span>
                <span className="font-bold text-gray-900">{vehicle.passengers} Ocupantes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white shadow-xs text-[#236199]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Bagagem</span>
                <span className="font-bold text-gray-900">{vehicle.luggage} Malas Grandes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white shadow-xs text-[#236199]">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Caixa</span>
                <span className="font-bold text-gray-900">{vehicle.transmission}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white shadow-xs text-[#236199]">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Tracção</span>
                <span className="font-bold text-gray-900">{vehicle.traction}</span>
              </div>
            </div>
          </div>

          {/* Standard Inclusions & Protocol Amenities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Equipamento & Padrões Incluídos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                ...vehicle.features,
                'Higienização com Padrão Hospitalar',
                'Água Mineral Selada & Lenços a bordo',
                'Motorista com Certificação de Protocolo',
                'Rastreio por Satélite & Assistência 24/7'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <Check className="w-4 h-4 text-[#236199] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center gap-3 text-xs text-[#09172C]">
            <ShieldCheck className="w-5 h-5 text-[#236199] shrink-0" />
            <span>
              <strong>Garantia PEPEK:</strong> Viatura de substituição imediata em caso de qualquer eventualidade técnica em qualquer província.
            </span>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onSelectForBooking(vehicle.name);
              onClose();
              const el = document.getElementById('reserva');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2"
          >
            <span>Reservar Esta Viatura no Formulário</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={generateQuickWhatsAppUrl(`Proposta Imediata para ${vehicle.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Cotação Imediata no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
