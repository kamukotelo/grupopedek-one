import React from 'react';
import {
  X,
  Scale,
  Users,
  DoorClosed,
  Settings2,
  Gauge,
  Calendar,
  Fuel,
  Trash2
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { getVehicleStudioBackground } from '../../data/fleetPresentation';

interface VehicleComparatorProps {
  comparedVehicles: VehicleDetail[];
  onRemoveVehicle: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (vehicleName: string) => void;
}

export const VehicleComparatorModal: React.FC<VehicleComparatorProps> = ({
  comparedVehicles,
  onRemoveVehicle,
  onClearAll,
  isOpen,
  onClose,
  onSelectBooking
}) => {
  if (!isOpen || comparedVehicles.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#09172C]/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto border border-[#E2E8F0] animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#09172C] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FEC228]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Comparador de Viaturas da Frota Pepek
              </h3>
              <p className="text-xs text-gray-400">
                Análise comparativa direta de especificações técnicas e valores diários.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-[#E4AD28] hover:text-[#E4AD28] font-bold flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Tudo</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Table */}
        <div className="overflow-x-auto p-5 sm:p-7 flex-1 bg-[#F5F6F6] text-xs">
          <div className={`grid grid-cols-${comparedVehicles.length} min-w-[650px] gap-4`}>
            {comparedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-[#174B86] text-white rounded-2xl p-4 border border-[#236199]/55 shadow-xs flex flex-col justify-between space-y-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => onRemoveVehicle(vehicle.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-[#FEC228] transition-colors cursor-pointer z-10"
                  title="Remover viatura da comparação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="aspect-4/3 rounded-xl overflow-hidden bg-cover bg-center border border-white/10 p-3 flex items-center justify-center relative" style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}>
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.name}
                    className="w-full h-full object-contain drop-shadow-[0_8px_12px_rgba(9,23,44,0.2)]"
                  />
                  <span className="absolute bottom-1.5 left-2 right-2 text-[10.5px] font-extrabold text-white leading-tight line-clamp-1 bg-[#09172C]/85 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs text-center">
                    {vehicle.name}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-extrabold text-[#FEC228]">
                    {vehicle.pricePerDayFormatted} <span className="text-[10px] text-white/65 font-normal">/ dia</span>
                  </div>
                  <div className="text-[11px] font-bold text-white/80">
                    {vehicle.categoryLabel}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectBooking(vehicle.name);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 bg-[#FEC228] hover:bg-[#FFD45F] text-[#09172C] text-xs font-extrabold rounded-xl justify-center flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar Esta</span>
                </button>
              </div>
            ))}
          </div>

          {/* Specs Comparison Table */}
          <div className="mt-6 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden divide-y divide-gray-100">
            {/* Lotação */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#09172C] text-[11px] uppercase tracking-wider">
              Capacidade de Passageiros & Portas
            </div>
            <div className={`grid grid-cols-${comparedVehicles.length} divide-x divide-gray-100 p-3.5`}>
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#09172C]">
                    <Users className="w-4 h-4 text-[#FEC228]" />
                    <span>{v.specs.passengers} Passageiros</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#555B64]">
                    <DoorClosed className="w-4 h-4 text-gray-400" />
                    <span>{v.specs.doors} Portas</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mecânica & Transmissão */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#09172C] text-[11px] uppercase tracking-wider">
              Transmissão & Combustível
            </div>
            <div className={`grid grid-cols-${comparedVehicles.length} divide-x divide-gray-100 p-3.5`}>
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#09172C]">
                    <Settings2 className="w-4 h-4 text-[#FEC228]" />
                    <span>{v.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#555B64]">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <span>{v.specs.fuelType}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracção & Depósito */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#09172C] text-[11px] uppercase tracking-wider">
              Tracção & Depósito
            </div>
            <div className={`grid grid-cols-${comparedVehicles.length} divide-x divide-gray-100 p-3.5`}>
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#09172C]">
                    <Gauge className="w-4 h-4 text-[#FEC228]" />
                    <span>{v.specs.tankCapacity || 'Depósito padrão'}</span>
                  </div>
                  <div className="text-[11px] text-[#555B64]">
                    <span>{v.specs.traction || 'Tração Dianteira/Traseira'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
