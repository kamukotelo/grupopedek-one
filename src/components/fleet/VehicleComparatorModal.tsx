import React from 'react';
import {
  X,
  Scale,
  Users,
  Briefcase,
  Settings2,
  Gauge,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Sparkles,
  Trash2
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparator-modal-title"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-gray-200 animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#06142F] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#0B45D8]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 id="comparator-modal-title" className="text-base sm:text-lg font-bold text-white font-inter">
                Comparador de Viaturas da Frota PEPEK
              </h3>
              <p className="text-xs text-gray-400">
                Análise comparativa de especificações técnicas para suporte à decisão corporativa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Tudo</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fechar comparador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Table */}
        <div className="overflow-x-auto p-5 sm:p-7 flex-1 bg-gray-50 text-xs">
          <div className={`grid grid-cols-${comparedVehicles.length + 1} min-w-[650px] gap-4`}>
            {/* Top Row: Vehicle Cards */}
            {comparedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between space-y-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => onRemoveVehicle(vehicle.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer z-10"
                  title="Remover viatura da comparação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="h-32 sm:h-36 rounded-xl overflow-hidden bg-gray-900 relative">
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-[11px] font-bold text-white leading-tight">
                    {vehicle.name}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-black text-[#06142F]">
                    {vehicle.pricePerDayAOA.toLocaleString('pt-AO')} AOA <span className="text-[10px] text-gray-500 font-normal">/ dia</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#0B45D8]">
                    ≈ €{vehicle.pricePerDayEUR} EUR
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectBooking(vehicle.name);
                    onClose();
                  }}
                  className="btn-primary w-full py-2.5 px-3 text-xs font-bold justify-center"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar Esta</span>
                </button>
              </div>
            ))}
          </div>

          {/* Specs Rows */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {/* Lotação */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#06142F] text-[11px] uppercase tracking-wider">
              Capacidade de Passageiros & Bagagem
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-3.5">
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <Users className="w-4 h-4 text-[#0B45D8]" />
                    <span>{v.specs.passengers} Ocupantes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{v.specs.luggage} Malas Grandes</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracção & Motor */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#06142F] text-[11px] uppercase tracking-wider">
              Mecânica, Tracção & Motor
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-3.5">
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1">
                  <div className="font-bold text-gray-900">{v.specs.traction}</div>
                  <div className="text-gray-600">{v.specs.transmission}</div>
                  <div className="text-gray-500 text-[10px]">{v.specs.engine}</div>
                </div>
              ))}
            </div>

            {/* Climatização & Segurança */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#06142F] text-[11px] uppercase tracking-wider">
              Segurança & Conforto VIP
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-3.5">
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1">
                  <div className="text-gray-800 font-semibold">{v.specs.airConditioning}</div>
                  <div className="text-[#0B45D8] font-bold">
                    {v.specs.armorProtection || 'Proteção Standard Reforçada'}
                  </div>
                </div>
              ))}
            </div>

            {/* Destaques Principais */}
            <div className="p-3.5 bg-gray-50 font-bold text-[#06142F] text-[11px] uppercase tracking-wider">
              Equipamento & Destaques
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-3.5">
              {comparedVehicles.map((v) => (
                <div key={v.id} className="p-2 space-y-1.5">
                  {v.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="text-gray-700 flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
