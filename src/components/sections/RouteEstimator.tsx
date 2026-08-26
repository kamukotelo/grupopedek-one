import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Clock, MapPin, ArrowRight, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

interface RouteOption {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  vehicle: string;
  badge?: string;
  description: string;
}

export const RouteEstimator: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-airport-talatona');
  const [currency, setCurrency] = useState<'AOA' | 'USD' | 'EUR'>('AOA');

  const routes: RouteOption[] = [
    {
      id: 'route-airport-talatona',
      name: 'Transfer Aeroporto ➔ Talatona Executivo',
      from: 'Aeroporto 4 de Fevereiro / AIAAN',
      to: 'Talatona (Hotéis & Centros Empresariais)',
      distance: '32 km',
      estimatedTime: '35 – 45 min',
      vehicle: 'SUV Executiva (Novo Toyota Prado 2024 / LC300)',
      badge: 'Mais Frequente',
      description: 'Recepção VIP Meet & Greet no desembarque internacional, auxílio com bagagem e transporte climatizado directo ao hotel/residência.'
    },
    {
      id: 'route-airport-miramar',
      name: 'Transfer Aeroporto ➔ Miramar & Zona Diplomática',
      from: 'Aeroporto Internacional de Luanda',
      to: 'Miramar / Alvalade / Zona das Embaixadas',
      distance: '14 km',
      estimatedTime: '20 – 30 min',
      vehicle: 'Sedan / SUV de Luxo (Mercedes Classe S 2025 / Lexus 600)',
      badge: 'Corpo Diplomático',
      description: 'Percurso com piloto treinado em protocolo de segurança e conduta discreta para diplomatas e delegações oficiais.'
    },
    {
      id: 'route-luanda-viana',
      name: 'Luanda Centro ➔ Pólo Industrial de Viana / Cacuaco',
      from: 'Centro de Luanda / Maianga / Ingombota',
      to: 'Parques Industriais de Viana & Cacuaco',
      distance: '28 km',
      estimatedTime: '40 – 50 min',
      vehicle: '4x4 Todo-Terreno (Toyota Hilux Dupla Cabine / Fortuner)',
      badge: 'Empresarial & Campo',
      description: 'Ideal para engenheiros, directores técnicos e visitas de inspecção fabril ou logística.'
    },
    {
      id: 'route-luanda-bengo',
      name: 'Luanda ➔ Província do Bengo (Caxito / Panguila)',
      from: 'Luanda',
      to: 'Caxito / Bengo',
      distance: '68 km',
      estimatedTime: '1h 15 min',
      vehicle: '4x4 / Pick-up (Toyota LC HZ / Mitsubishi L200)',
      badge: 'Interprovincial Litoral',
      description: 'Viagem técnica ou institucional com viatura robusta e suporte operacional em tempo real.'
    },
    {
      id: 'route-luanda-huambo',
      name: 'Missão Luanda ➔ Huambo (Planalto Central)',
      from: 'Luanda (Sede PEPEK)',
      to: 'Huambo (Pólo Regional)',
      distance: '580 km',
      estimatedTime: 'Itinerário de Longa Distância',
      vehicle: '4x4 / SUV de Longo Curso (Toyota LC V8 / Hilux 4x4)',
      badge: 'Expedição Nacional',
      description: 'Pacote completo de missão interprovincial com viatura revista, equipamento de emergência e assistência técnica em todo o percurso.'
    }
  ];

  const currentRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <section id="rotas" className="section-padding bg-gradient-to-b from-[#0C3D73] to-[#174B86] text-white relative overflow-hidden">
      {/* Background visual glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#FEC228]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-pepek relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#FEC228]/30 backdrop-blur-md text-xs font-bold text-[#FEC228] uppercase tracking-widest mb-4">
              <Compass className="w-4 h-4 text-[#FEC228]" />
              <span>Rotas & Itinerários Estratégicos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Simulador de Rotas Executivas
            </h2>
            <p className="text-base text-gray-300 mt-3">
              Consulte as rotas mais frequentes em Angola com tempos estimados e especificações técnicas de mobilidade protocolar.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15">
            <span className="text-xs text-gray-300 font-semibold px-2">Facturação:</span>
            {(['AOA', 'USD', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === curr
                    ? 'bg-[#FEC228] text-[#09172C] shadow font-extrabold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Layout: Selector on left, Details on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Route Options List */}
          <div className="lg:col-span-5 space-y-3">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/15 border-[#FEC228] shadow-lg ring-1 ring-[#FEC228]'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#FEC228] uppercase tracking-wider">
                      {route.badge}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {route.distance}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {route.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-300 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FEC228]" />
                      <span>{route.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FEC228]" />
                      <span className="truncate max-w-[150px]">{route.to}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Route Summary & Action Card */}
          <div className="lg:col-span-7">
            <div className="h-full p-8 sm:p-10 rounded-2xl bg-white text-gray-900 border border-[#E2E8F0] shadow-2xl flex flex-col justify-between">
              <div>
                {/* Header of summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-xs font-bold text-[#FEC228] uppercase tracking-wider block mb-1">
                      Itinerário Seleccionado
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#09172C]">
                      {currentRoute.name}
                    </h3>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-full bg-[#236199] text-[#236199] text-xs font-bold border border-[#236199] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#236199] animate-pulse"></span>
                    <span>Disponibilidade Imediata</span>
                  </div>
                </div>

                {/* Narrative */}
                <p className="text-sm text-[#555B64] mb-8 leading-relaxed">
                  {currentRoute.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0]">
                    <span className="text-xs text-[#555B64] block mb-1 font-semibold uppercase">Ponto de Partida</span>
                    <span className="text-sm font-bold text-[#09172C] block">{currentRoute.from}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0]">
                    <span className="text-xs text-[#555B64] block mb-1 font-semibold uppercase">Destino</span>
                    <span className="text-sm font-bold text-[#09172C] block">{currentRoute.to}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0]">
                    <span className="text-xs text-[#555B64] block mb-1 font-semibold uppercase">Viatura Indicada</span>
                    <span className="text-sm font-bold text-[#FEC228] block">{currentRoute.vehicle}</span>
                  </div>
                </div>

                {/* Quality Inclusions */}
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#09172C]">
                    <CheckCircle2 className="w-4 h-4 text-[#236199] shrink-0" />
                    <span>Facturação em {currency} com conformidade legal AGT</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#09172C]">
                    <CheckCircle2 className="w-4 h-4 text-[#236199] shrink-0" />
                    <span>Tolerância de espera de 60 minutos em voos atrasados sem custo adicional</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#09172C]">
                    <CheckCircle2 className="w-4 h-4 text-[#236199] shrink-0" />
                    <span>Água mineral lacrada, climatização independente e carregadores móveis a bordo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#555B64] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FEC228]" />
                  <span>Confirmação em menos de 15 minutos</span>
                </div>

                <a
                  href={generateQuickWhatsAppUrl(`Reserva de Rota: ${currentRoute.name} (${currency})`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#236199] hover:bg-[#0C2E60] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Confirmar Esta Rota no WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
