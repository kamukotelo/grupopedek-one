import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Car,
  Scale,
  X,
  Filter,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { FLYER_FLEET_2026 } from '../../data/fleetFlyer2026';
import { VehicleCard } from '../fleet/VehicleCard';
import { VehicleGalleryModal } from '../fleet/VehicleGalleryModal';
import { VehicleComparatorModal } from '../fleet/VehicleComparatorModal';
import { useFleetText } from '../../i18n/fleetContent';

interface FleetProps {
  onSelectVehicle?: (vehicleName: string) => void;
}

export const Fleet: React.FC<FleetProps> = ({ onSelectVehicle }) => {
  const { t } = useTranslation();
  const ft = useFleetText();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Category URL Param Sync
  const categoryParam = searchParams.get('categoria') || 'all';
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'name'>('popular');


  // Modals state
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
      searchParams.set('categoria', catId);
      setSearchParams(searchParams, { replace: true });
    }
  };

  const versionedFleet = FLYER_FLEET_2026;

  const categories = [
    { id: 'all', label: t('fleet.allVehicles'), count: versionedFleet.length },
    { id: 'luxo', label: t('fleet.luxury'), count: versionedFleet.filter(v => v.category === 'luxo').length },
    { id: 'vans', label: t('fleet.vansTransport'), count: versionedFleet.filter(v => v.category === 'vans').length },
    { id: 'suvs', label: t('fleet.suvs'), count: versionedFleet.filter(v => v.category === 'suvs').length },
    { id: 'pickups', label: t('fleet.pickupsTrucks'), count: versionedFleet.filter(v => v.category === 'pickups').length },
    { id: 'economicos', label: t('fleet.economy'), count: versionedFleet.filter(v => v.category === 'economicos').length },
    { id: 'eventos', label: t('fleet.specialEvents'), count: versionedFleet.filter(v => v.category === 'eventos').length },
  ];

  // Filter and Sort Logic
  const filteredFleet = useMemo(() => {
    let result = activeCategory === 'all'
      ? versionedFleet
      : versionedFleet.filter(v => v.category === activeCategory);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.categoryLabel.toLowerCase().includes(q) ||
        ft(v.categoryLabel).toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') {
      result = [...result].sort((a, b) => a.pricePerDayAOA - b.pricePerDayAOA);
    } else if (sortBy === 'price_desc') {
      result = [...result].sort((a, b) => b.pricePerDayAOA - a.pricePerDayAOA);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, searchTerm, sortBy, versionedFleet, ft]);

  const handleToggleCompare = (vehicle: VehicleDetail) => {
    setComparedVehicles(prev => {
      const exists = prev.some(v => v.id === vehicle.id);
      if (exists) {
        return prev.filter(v => v.id !== vehicle.id);
      }
      if (prev.length >= 3) {
        alert(t('fleet.compareLimit'));
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  // Todos os botões "Reservar" levam ao formulário único com a viatura já escolhida.
  const handleBookingTrigger = (vehicleName: string) => {
    onSelectVehicle?.(vehicleName);
    const vehicle = versionedFleet.find((v) => v.name === vehicleName);
    navigate(`/reservar${vehicle ? `?viatura=${vehicle.id}` : ''}`);
  };

  return (
    <section id="frota" className="section-padding relative overflow-hidden bg-gradient-to-b from-[#001E4A] via-[#174B86] to-[#001E4A] text-white">
      <div className="pointer-events-none absolute -left-48 top-24 h-96 w-96 rounded-full bg-[#236199]/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[460px] w-[460px] rounded-full bg-[#09172C]/30 blur-[140px]" />
      <div className="container-pepek relative z-10">
        {/* ═══════════════════════════════════════════════════════
            CATEGORY TABS (Gold Active, Navy Baseline)
           ═══════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#FEC228] text-[#09172C] shadow-md scale-102'
                    : 'bg-white text-[#09172C] border border-white/20 hover:border-[#FEC228] hover:bg-[#F5F6F6]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-[#09172C] text-[#FEC228]' : 'bg-[#F5F6F6] text-[#555B64]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SEARCH & SORT TOOLBAR + COUNTER
           ═══════════════════════════════════════════════════════ */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#555B64] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('fleet.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs text-[#09172C] font-medium outline-hidden focus:ring-2 focus:ring-[#FEC228]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Counter and Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className="font-bold text-[#09172C]">
              <strong>{filteredFleet.length}</strong> {filteredFleet.length === 1 ? t('fleet.foundOne') : t('fleet.foundMany')}
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#555B64]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 bg-[#F5F6F6] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#09172C] outline-hidden cursor-pointer"
              >
                <option value="popular">{t('fleet.popular')}</option>
                <option value="price_asc">{t('fleet.priceAsc')}</option>
                <option value="price_desc">{t('fleet.priceDesc')}</option>
                <option value="name">{t('fleet.nameSort')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            FLEET GRID (1 col mobile, 2 col tablet/desktop)
           ═══════════════════════════════════════════════════════ */}
        {filteredFleet.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#09172C] mb-1">{t('fleet.noneTitle')}</h3>
            <p className="text-xs text-[#555B64] max-w-md mx-auto mb-4">
              {t('fleet.noneText')}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                handleCategoryChange('all');
              }}
              className="px-5 py-2.5 bg-[#09172C] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {t('fleet.viewAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
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
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          FLOATING STICKY COMPARATOR DRAWER (Bottom Bar)
         ═══════════════════════════════════════════════════════ */}
      {comparedVehicles.length > 0 && (
        <div
          className="fixed left-4 right-4 sm:left-auto sm:right-8 z-40 bg-[#09172C] text-white p-3.5 px-5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-4 animate-scaleUp"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FEC228] text-[#09172C] flex items-center justify-center font-extrabold text-xs">
              {comparedVehicles.length}
            </div>
            <div className="text-xs">
              <strong className="block text-white">{t('fleet.comparing')}</strong>
              <span className="text-gray-300 text-[10px]">
                {comparedVehicles.map(v => v.name.split(' ')[0]).join(' vs ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsComparatorOpen(true)}
              className="py-2 px-4 bg-[#FEC228] hover:bg-[#FFD45F] text-[#09172C] text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t('fleet.compare')} ({comparedVehicles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setComparedVehicles([])}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title={t('fleet.clearSelection')}
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
