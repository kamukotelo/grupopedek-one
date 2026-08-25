import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Car,
  Scale,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Filter,
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  CreditCard,
  Truck
} from 'lucide-react';
import { VehicleDetail } from '../../data/fleetData';
import { FLYER_FLEET_2026 } from '../../data/fleetFlyer2026';
import { VehicleCard } from '../fleet/VehicleCard';
import { VehicleGalleryModal } from '../fleet/VehicleGalleryModal';
import { VehicleComparatorModal } from '../fleet/VehicleComparatorModal';
import { BookingWizardModal } from '../fleet/BookingWizardModal';

interface FleetProps {
  onSelectVehicle?: (vehicleName: string) => void;
}

export const Fleet: React.FC<FleetProps> = ({ onSelectVehicle }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Category URL Param Sync
  const categoryParam = searchParams.get('categoria') || 'all';
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'name'>('popular');

  // Quick Search Bar Inputs
  const [heroPickupLocation, setHeroPickupLocation] = useState('Aeroporto Internacional 4 de Fevereiro (LAD)');
  const [heroDropoffLocation, setHeroDropoffLocation] = useState('Hub Central Pepek Talatona');
  const [heroDifferentDropoff, setHeroDifferentDropoff] = useState(false);
  const [heroPickupDate, setHeroPickupDate] = useState(() => {
    return new Date(Date.now() + 86400000).toISOString().split('T')[0];
  });
  const [heroDropoffDate, setHeroDropoffDate] = useState(() => {
    return new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
  });

  // Modals state
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<VehicleDetail | null>(null);
  const [comparedVehicles, setComparedVehicles] = useState<VehicleDetail[]>([]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardVehicleName, setWizardVehicleName] = useState<string>('');

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
    { id: 'all', label: 'Todas as Viaturas', count: versionedFleet.length },
    { id: 'luxo', label: 'Luxo e Executivo', count: versionedFleet.filter(v => v.category === 'luxo').length },
    { id: 'vans', label: 'Vans e Transporte', count: versionedFleet.filter(v => v.category === 'vans').length },
    { id: 'suvs', label: 'SUVs', count: versionedFleet.filter(v => v.category === 'suvs').length },
    { id: 'pickups', label: 'Pick-ups e Camiões', count: versionedFleet.filter(v => v.category === 'pickups').length },
    { id: 'economicos', label: 'Económicos', count: versionedFleet.filter(v => v.category === 'economicos').length },
    { id: 'eventos', label: 'Eventos Especiais', count: versionedFleet.filter(v => v.category === 'eventos').length },
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
        v.categoryLabel.toLowerCase().includes(q)
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
  }, [activeCategory, searchTerm, sortBy, versionedFleet]);

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
    setWizardVehicleName(vehicleName);
    setIsWizardOpen(true);
  };

  return (
    <section id="frota" className="section-padding relative bg-[#0C2E60] text-white">
      <div className="container-pepek">
        {/* ═══════════════════════════════════════════════════════
            SECTION HEADER
           ═══════════════════════════════════════════════════════ */}
        <div className="max-w-4xl mb-8">
          <div className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#FEC228]">
            <Car className="w-3.5 h-3.5" />
            <span>Frota Executiva · Disponibilidade sob consulta</span>
          </div>
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Conheça a Nossa Frota de Alto Padrão
          </h2>
          <p className="text-sm leading-relaxed text-white/65 sm:text-base">
            Coleção oficial dos flyers PEPEK 2026, com 46 viaturas, imagens autorizadas e tarifas Full Day e Transfer.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            QUICK SEARCH HERO BAR
           ═══════════════════════════════════════════════════════ */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-[#09172C] p-5 text-white shadow-xl sm:p-7">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D2A820]">
              <Sparkles className="w-4 h-4" />
              <span>Pesquisa Rápida de Disponibilidade</span>
            </div>
            <label className="text-xs text-gray-300 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={heroDifferentDropoff}
                onChange={(e) => setHeroDifferentDropoff(e.target.checked)}
                className="rounded text-[#D2A820]"
              />
              <span>Entregar noutro local</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Levantamento */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D2A820]" />
                Levantamento
              </label>
              <select
                value={heroPickupLocation}
                onChange={(e) => setHeroPickupLocation(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold text-white outline-hidden focus:ring-2 focus:ring-[#D2A820]"
              >
                <option value="Aeroporto Internacional 4 de Fevereiro (LAD)" className="text-gray-900">Aeroporto 4 de Fevereiro (LAD)</option>
                <option value="Hub Central Pepek Talatona" className="text-gray-900">Hub Central Pepek Talatona</option>
                <option value="Hotel Epic Sana Luanda" className="text-gray-900">Hotel Epic Sana Luanda</option>
                <option value="Miramar / Embaixadas" className="text-gray-900">Miramar / Embaixadas</option>
                <option value="Outro Endereço em Luanda" className="text-gray-900">Outro Endereço em Luanda</option>
              </select>
            </div>

            {/* Devolução */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1E8E5A]" />
                Devolução
              </label>
              {heroDifferentDropoff ? (
                <select
                  value={heroDropoffLocation}
                  onChange={(e) => setHeroDropoffLocation(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold text-white outline-hidden focus:ring-2 focus:ring-[#D2A820]"
                >
                  <option value="Hub Central Pepek Talatona" className="text-gray-900">Hub Central Pepek Talatona</option>
                  <option value="Aeroporto Internacional 4 de Fevereiro (LAD)" className="text-gray-900">Aeroporto 4 de Fevereiro (LAD)</option>
                  <option value="Hotel Epic Sana Luanda" className="text-gray-900">Hotel Epic Sana Luanda</option>
                  <option value="Outro Endereço em Luanda" className="text-gray-900">Outro Endereço em Luanda</option>
                </select>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 truncate">
                  {heroPickupLocation.split('(')[0]}
                </div>
              )}
            </div>

            {/* Data Levantamento */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D2A820]" />
                Data de Levantamento
              </label>
              <input
                type="date"
                value={heroPickupDate}
                onChange={(e) => setHeroPickupDate(e.target.value)}
                className="w-full p-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold text-white"
              />
            </div>

            {/* Data Devolução */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D2A820]" />
                Data de Devolução
              </label>
              <input
                type="date"
                value={heroDropoffDate}
                onChange={(e) => setHeroDropoffDate(e.target.value)}
                className="w-full p-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold text-white"
              />
            </div>
          </div>
        </div>

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
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
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
        <div className="bg-white p-4 rounded-2xl border border-[#D9DEE7] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#697080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por modelo ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs text-[#07133F] font-medium outline-hidden focus:ring-2 focus:ring-[#D2A820]"
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
            <span className="font-bold text-[#07133F]">
              <strong>{filteredFleet.length}</strong> {filteredFleet.length === 1 ? 'viatura encontrada' : 'viaturas encontradas'}
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#697080]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 bg-[#F3F5F8] border border-[#D9DEE7] rounded-xl text-xs font-semibold text-[#07133F] outline-hidden cursor-pointer"
              >
                <option value="popular">Mais Populares</option>
                <option value="price_asc">Preço: Menor para Maior</option>
                <option value="price_desc">Preço: Maior para Menor</option>
                <option value="name">Nome (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            4-STEP BOOKING GUIDE BAR
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-10 p-5 rounded-2xl bg-white border border-[#D9DEE7] shadow-xs text-xs">
          <div className="flex items-start gap-3 p-2">
            <div className="w-8 h-8 rounded-xl bg-[#07133F] text-[#D2A820] flex items-center justify-center font-black shrink-0 shadow-xs">
              1
            </div>
            <div>
              <strong className="block text-[#07133F] text-[13px] font-bold">Escolha a Viatura</strong>
              <p className="text-[#697080] text-[11px] mt-0.5">Explore fotografias, lotação e especificações das viaturas disponíveis.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-[#07133F] text-[#D2A820] flex items-center justify-center font-black shrink-0 shadow-xs">
              2
            </div>
            <div>
              <strong className="block text-[#07133F] text-[13px] font-bold">Adicione Extras</strong>
              <p className="text-[#697080] text-[11px] mt-0.5">Chauffeur profissional, tanque cheio garantido, cadeiras infantis ou Wi-Fi 5G.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-[#07133F] text-[#D2A820] flex items-center justify-center font-black shrink-0 shadow-xs">
              3
            </div>
            <div>
              <strong className="block text-[#07133F] text-[13px] font-bold">Cotação & Fatura AGT</strong>
              <p className="text-[#697080] text-[11px] mt-0.5">Emissão imediata de cotação formal com NIF para particulares ou empresas.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-[#1E8E5A] text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              4
            </div>
            <div>
              <strong className="block text-[#07133F] text-[13px] font-bold">Entrega VIP em Luanda</strong>
              <p className="text-[#697080] text-[11px] mt-0.5">Despacho com viatura selada e higienizada no Aeroporto ou Talatona.</p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            FLEET GRID (1 col mobile, 2 col tablet/desktop)
           ═══════════════════════════════════════════════════════ */}
        {filteredFleet.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D9DEE7] shadow-xs">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#07133F] mb-1">Nenhuma viatura encontrada</h3>
            <p className="text-xs text-[#697080] max-w-md mx-auto mb-4">
              Não encontramos nenhum modelo que corresponda à sua pesquisa. Tente limpar os filtros ou selecionar outra categoria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                handleCategoryChange('all');
              }}
              className="px-5 py-2.5 bg-[#07133F] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Ver Toda a Frota
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
          className="fixed left-4 right-4 sm:left-auto sm:right-8 z-40 bg-[#020A2A] text-white p-3.5 px-5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-4 animate-scaleUp"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D2A820] text-[#020A2A] flex items-center justify-center font-black text-xs">
              {comparedVehicles.length}
            </div>
            <div className="text-xs">
              <strong className="block text-white">Viaturas em Comparação</strong>
              <span className="text-gray-300 text-[10px]">
                {comparedVehicles.map(v => v.name.split(' ')[0]).join(' vs ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsComparatorOpen(true)}
              className="py-2 px-4 bg-[#D2A820] hover:bg-[#E1BB38] text-[#020A2A] text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Comparar ({comparedVehicles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setComparedVehicles([])}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Limpar seleção"
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

      {/* 4-Step Booking Wizard Modal */}
      <BookingWizardModal
        initialVehicleName={wizardVehicleName}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </section>
  );
};
