import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Briefcase, Settings2, Gauge, Shield, ArrowRight } from 'lucide-react';
import { VehicleCategory } from '../../types';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Fleet: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'suv' | '4x4' | 'van' | 'protocol'>('all');

  const fleetData: VehicleCategory[] = [
    {
      id: 'suv-prado',
      name: 'SUV Executiva — Land Cruiser Prado / LC300',
      subtitle: 'Topo de Gama & Conforto Máximo',
      category: 'suv',
      description: 'A referência absoluta em mobilidade executiva em Angola. Ideal para membros de direção, ministros e embaixadores.',
      passengers: 7,
      luggage: 5,
      transmission: 'Automática',
      traction: '4WD Permanente',
      features: ['Ar condicionado duplo', 'Bancos em couro premium', 'Vidros fumados de segurança', 'GPS Tracker 24/7'],
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      badge: 'Mais Solicitado'
    },
    {
      id: '4x4-hilux',
      name: '4x4 Todo-Terreno — Toyota Hilux / Fortuner',
      subtitle: 'Robustez & Operações de Campo',
      category: '4x4',
      description: 'Preparadas para os trajectos mais exigentes em Luanda e no interior de Angola (Huambo, Bengo e províncias).',
      passengers: 5,
      luggage: 6,
      transmission: 'Manual / Automática',
      traction: '4x4 com Redutoras',
      features: ['Suspensão reforçada', 'Pneus todo-o-terreno', 'Protecção de cárter', 'Comunicação rádio'],
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'van-hiace-vip',
      name: 'Van Executiva VIP — Toyota Hiace / Quantum',
      subtitle: 'Transporte de Comitivas & Delegações',
      category: 'van',
      description: 'Espaço generoso, assentos reclináveis individuais e climatização total para equipas técnicas e transfer de grupos.',
      passengers: 12,
      luggage: 10,
      transmission: 'Manual / Automática',
      traction: 'Traseira / 4x2',
      features: ['Bancos individuais reclináveis', 'Entradas USB individuais', 'Climatização traseira dedicada', 'Porta lateral assistida'],
      image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80',
      badge: 'Ideal para Grupos'
    },
    {
      id: 'protocol-comitiva',
      name: 'Comboio Protocolar & Segurança Especial',
      subtitle: 'Comitivas Diplomáticas & Chefes de Estado',
      category: 'protocol',
      description: 'Soluções integradas com múltiplas viaturas idênticas, escoltas credenciadas e coordenação de tráfego protocolar.',
      passengers: 15,
      luggage: 20,
      transmission: 'Automática',
      traction: '4WD / Integral',
      features: ['Pilotos de protocolo dedicados', 'Veículo de reserva em prontidão', 'Planeamento de rotas de segurança', 'Coordenação aeroporto'],
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      badge: 'Serviço de Estado'
    }
  ];

  const filteredFleet = activeTab === 'all'
    ? fleetData
    : fleetData.filter(v => v.category === activeTab);

  return (
    <section id="frota" className="section-padding bg-white relative">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="tag-label mb-4">
              <span>{t('fleet.tag')}</span>
            </div>
            <h2 className="section-title mb-4">
              {t('fleet.title')}
            </h2>
            <p className="section-subtitle">
              {t('fleet.subtitle')}
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-gray-100 border border-gray-200">
            {[
              { id: 'all', label: t('fleet.all') },
              { id: 'suv', label: t('fleet.suv') },
              { id: '4x4', label: t('fleet.offroad') },
              { id: 'van', label: t('fleet.van') },
              { id: 'protocol', label: t('fleet.protocol') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'suv' | '4x4' | 'van' | 'protocol')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#06142F] text-white shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0B45D8]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Banner */}
              <div className="relative h-64 overflow-hidden bg-gray-900">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {vehicle.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0B45D8] text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
                    {vehicle.badge}
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    {vehicle.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {vehicle.name}
                  </h3>
                </div>
              </div>

              {/* Specs & Description */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {vehicle.description}
                  </p>

                  {/* Spec Icons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-100 mb-6 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0B45D8]" />
                      <span>{vehicle.passengers} Lugares</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#0B45D8]" />
                      <span>{vehicle.luggage} Malas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-[#0B45D8]" />
                      <span>{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-[#0B45D8]" />
                      <span>{vehicle.traction}</span>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {vehicle.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Request Action */}
                <a
                  href={generateQuickWhatsAppUrl(`Reserva de ${vehicle.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-xs font-bold py-3.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>{t('fleet.requestQuote')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
