import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Car,
  Scale,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Filter,
  Layers
} from 'lucide-react';
import { FLEET_DATABASE, VehicleDetail } from '../../data/fleetData';
import { VehicleCard } from '../fleet/VehicleCard';
import { VehicleGalleryModal } from '../fleet/VehicleGalleryModal';
import { VehicleComparatorModal } from '../fleet/VehicleComparatorModal';

interface FleetProps {
  onSelectVehicle?: (vehicleName: string) => void;
}

export const Fleet: React.FC<FleetProps> = ({ onSelectVehicle }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Category URL Param Sync
  const categoryParam = searchParams.get('categoria') || 'all';
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<VehicleDetail | null>(null);
  const [comparedVehicles, setComparedVehicles] = useState<VehicleDetail[]>([]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

  // Keep state in sync with URL
  useEffect(() => {
    const cat = searchParams.get('categoria') || 'all';
    setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('categoria');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ categoria: catId }, { replace: true });
    }
  };

  const filteredFleet = activeCategory === 'all'
    ? FLEET_DATABASE
    : FLEET_DATABASE.filter(v => v.category === activeCategory);

  const handleToggleCompare = (vehicle: VehicleDetail) => {
    setComparedVehicles(prev => {
      const exists = prev.some(v => v.id === vehicle.id);
      if (exists) {
        return prev.filter(v => v.id !== vehicle.id);
      }
      if (prev.length >= 3) {
        alert('Pode comparar até 3 viaturas em simultâneo.');
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const handleBookingTrigger = (vehicleName: string) => {
    if (onSelectVehicle) {
      onSelectVehicle(vehicleName);
    }
    // Navigate to booking page with vehicle pre-filled
    navigate(`/reservar?viatura=${encodeURIComponent(vehicleName)}`);
    const el = document.getElementById('reserva');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [
    { id: 'all', label: 'Toda a Frota', count: FLEET_DATABASE.length },
    { id: 'suv', label: 'SUVs Executivas', count: FLEET_DATABASE.filter(v => v.category === 'suv').length },
    { id: '4x4', label: '4x4 Todo-Terreno', count: FLEET_DATABASE.filter(v => v.category === '4x4').length },
    { id: 'van', label: 'Vans & Comitivas', count: FLEET_DATABASE.filter(v => v.category === 'van').length },
    { id: 'protocol', label: 'Segurança & Estado', count: FLEET_DATABASE.filter(v => v.category === 'protocol').length },
  ];

  return (
    <section id="frota" className="section-padding bg-gray-50/50 relative">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="tag-label mb-3.5">
              <Car className="w-4 h-4" />
              <span>Frota Certificada de Alta Gama · Talatona Hub</span>
            </div>
            <h2 className="section-title mb-3">
              A Nossa Frota em Destaque
            </h2>
            <p className="section-subtitle">
              Viaturas novas com higienização hospitalar, manutenção preventiva rigorosa e acompanhamento por motoristas bilingues formados em protocolo diplomático.
            </p>
          </div>

          {/* Interactive URL-Synced Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-gray-200 shadow-xs">
            {categories.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategoryChange(tab.id)}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-[#06142F] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Category Availability Counter */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/80 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4 text-[#0B45D8]" />
            <span>
              A mostrar <strong>{filteredFleet.length}</strong> viaturas disponíveis com despacho imediato
            </span>
          </div>

          <div className="text-gray-500 hidden sm:block">
            <span>Fotos reais de cada viatura com galeria e ficha técnica</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            VIP BOOKING WORKFLOW & SERVICE GUARANTEES BAR
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-10 p-5 rounded-3xl bg-white border border-gray-200/90 shadow-sm text-xs">
          <div className="flex items-start gap-3 p-2">
            <div className="w-8 h-8 rounded-xl bg-[#0B45D8]/10 text-[#0B45D8] flex items-center justify-center font-black shrink-0">
              1
            </div>
            <div>
              <strong className="block text-gray-900 text-[13px] font-bold">Escolha a Viatura</strong>
              <p className="text-gray-500 text-[11px] mt-0.5">Explore fotos reais, lotação e especificações técnicas completas.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-[#0B45D8]/10 text-[#0B45D8] flex items-center justify-center font-black shrink-0">
              2
            </div>
            <div>
              <strong className="block text-gray-900 text-[13px] font-bold">Proposta Formal AGT</strong>
              <p className="text-gray-500 text-[11px] mt-0.5">Emissão imediata de cotação com NIF da sua empresa ou embaixada.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-[#0B45D8]/10 text-[#0B45D8] flex items-center justify-center font-black shrink-0">
              3
            </div>
            <div>
              <strong className="block text-gray-900 text-[13px] font-bold">Pagamento Flexível</strong>
              <p className="text-gray-500 text-[11px] mt-0.5">Multicaixa Express, Transferência BAI/BFA, Stripe Internacional ou Faturação a 30 dias.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black shrink-0">
              4
            </div>
            <div>
              <strong className="block text-emerald-900 text-[13px] font-bold">Despacho & Entrega VIP</strong>
              <p className="text-gray-500 text-[11px] mt-0.5">Entrega gratuita no Aeroporto 4 de Fevereiro, Talatona ou Miramar com viatura selada.</p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            VISUAL-FIRST FLEET GRID (Dominant Images)
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFleet.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isCompared={comparedVehicles.some(v => v.id === vehicle.id)}
              onToggleCompare={handleToggleCompare}
              onInspect={(v) => setSelectedVehicleForModal(v)}
              onSelectBooking={handleBookingTrigger}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FLOATING STICKY COMPARATOR DRAWER (Bottom Bar)
         ═══════════════════════════════════════════════════════ */}
      {comparedVehicles.length > 0 && (
        <div
          className="fixed left-4 right-4 sm:left-auto sm:right-8 z-40 bg-[#06142F] text-white p-3.5 px-5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-4 animate-scaleUp"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0B45D8] flex items-center justify-center text-white font-bold text-xs">
              {comparedVehicles.length}
            </div>
            <div className="text-xs">
              <strong className="block text-white">Viaturas em Comparação</strong>
              <span className="text-gray-300 text-[10px]">
                {comparedVehicles.map(v => v.name.split(' ')[0] + ' ' + v.name.split(' ')[1]).join(' vs ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsComparatorOpen(true)}
              className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Comparar Agora ({comparedVehicles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setComparedVehicles([])}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Limpar selecção"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Gallery & Specs Modal */}
      <VehicleGalleryModal
        vehicle={selectedVehicleForModal}
        onClose={() => setSelectedVehicleForModal(null)}
        onSelectForBooking={handleBookingTrigger}
      />

      {/* Side-by-Side Vehicle Comparator Modal */}
      <VehicleComparatorModal
        comparedVehicles={comparedVehicles}
        onRemoveVehicle={(id) => setComparedVehicles(prev => prev.filter(v => v.id !== id))}
        onClearAll={() => setComparedVehicles([])}
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        onSelectBooking={handleBookingTrigger}
      />
    </section>
  );
};
