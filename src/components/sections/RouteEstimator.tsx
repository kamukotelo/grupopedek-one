import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Clock, MapPin, ArrowRight, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';

interface RouteOption {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  vehicle: string;
  vehicleId: string;
  badge?: string;
  description: string;
  /** Mostra no cartão o preço de transfer mais baixo da frota. */
  showTransferFrom?: boolean;
  /** Taxa de deslocação do "Tarifário de Rotas Interprovinciais (2026)"; somada à diária da viatura. */
  displacementFeeAOA?: number;
}

const officialVehicleImages = new Map(
  PUBLIC_FLEET.map((vehicle) => [vehicle.id, {
    src: vehicle.primaryImage,
    name: vehicle.name,
  }])
);

const publicFleetById = new Map(PUBLIC_FLEET.map((vehicle) => [vehicle.id, vehicle]));

// Preço mínimo de um percurso interprovincial: 1 dia de aluguer da viatura indicada + taxa de deslocação.
const interprovincialMinPrice = (route: RouteOption): number | undefined => {
  const vehicle = publicFleetById.get(route.vehicleId);
  return vehicle && route.displacementFeeAOA !== undefined
    ? vehicle.pricePerDayAOA + route.displacementFeeAOA
    : undefined;
};

// Transfer mais barato da frota pública — acompanha a tabela de preços sem valor fixo no código.
const lowestTransferAOA = Math.min(
  ...PUBLIC_FLEET.map((vehicle) => vehicle.transferPriceAOA ?? Infinity)
);
const formatKz = (value: number) => `${new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(value)} Kz`;

export const RouteEstimator: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-airport-talatona');
  const [currency, setCurrency] = useState<'AOA' | 'USD' | 'EUR'>('AOA');

  const routes: RouteOption[] = [
    {
      id: 'route-airport-talatona',
      name: t('routes.items.route-airport-talatona.name'),
      from: t('routes.items.route-airport-talatona.from'),
      to: t('routes.items.route-airport-talatona.to'),
      distance: '32 km',
      estimatedTime: t('routes.items.route-airport-talatona.estimatedTime'),
      vehicle: t('routes.items.route-airport-talatona.vehicle'),
      vehicleId: 'new-toyota-prado',
      badge: t('routes.items.route-airport-talatona.badge'),
      description: t('routes.items.route-airport-talatona.description'),
      showTransferFrom: true
    },
    {
      id: 'route-airport-miramar',
      name: t('routes.items.route-airport-miramar.name'),
      from: t('routes.items.route-airport-miramar.from'),
      to: t('routes.items.route-airport-miramar.to'),
      distance: '14 km',
      estimatedTime: t('routes.items.route-airport-miramar.estimatedTime'),
      vehicle: t('routes.items.route-airport-miramar.vehicle'),
      vehicleId: 'mercedes-class-s-2025',
      badge: t('routes.items.route-airport-miramar.badge'),
      description: t('routes.items.route-airport-miramar.description'),
      showTransferFrom: true
    },
    {
      id: 'route-luanda-viana',
      name: t('routes.items.route-luanda-viana.name'),
      from: t('routes.items.route-luanda-viana.from'),
      to: t('routes.items.route-luanda-viana.to'),
      distance: '28 km',
      estimatedTime: t('routes.items.route-luanda-viana.estimatedTime'),
      vehicle: t('routes.items.route-luanda-viana.vehicle'),
      vehicleId: 'toyota-hilux',
      badge: t('routes.items.route-luanda-viana.badge'),
      description: t('routes.items.route-luanda-viana.description')
    },
    {
      id: 'route-luanda-bengo',
      name: t('routes.items.route-luanda-bengo.name'),
      from: t('routes.items.route-luanda-bengo.from'),
      to: t('routes.items.route-luanda-bengo.to'),
      distance: '68 km',
      estimatedTime: t('routes.items.route-luanda-bengo.estimatedTime'),
      vehicle: t('routes.items.route-luanda-bengo.vehicle'),
      vehicleId: 'toyota-lc-hz',
      badge: t('routes.items.route-luanda-bengo.badge'),
      displacementFeeAOA: 100000,
      description: t('routes.items.route-luanda-bengo.description')
    },
    {
      id: 'route-luanda-huambo',
      name: t('routes.items.route-luanda-huambo.name'),
      from: t('routes.items.route-luanda-huambo.from'),
      to: t('routes.items.route-luanda-huambo.to'),
      distance: '580 km',
      estimatedTime: t('routes.items.route-luanda-huambo.estimatedTime'),
      vehicle: t('routes.items.route-luanda-huambo.vehicle'),
      vehicleId: 'toyota-lc-v8-2021',
      badge: t('routes.items.route-luanda-huambo.badge'),
      displacementFeeAOA: 300000,
      description: t('routes.items.route-luanda-huambo.description')
    }
  ];

  const currentRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const currentVehicleImage = officialVehicleImages.get(currentRoute.vehicleId);
  const currentVehicle = publicFleetById.get(currentRoute.vehicleId);
  // Transfers de aeroporto usam a tarifa de transfer; os restantes percursos, a diária da viatura.
  const currentRouteMinPrice = interprovincialMinPrice(currentRoute);
  const currentVehicleMinPrice = currentRouteMinPrice ?? (currentVehicle
    ? (currentRoute.showTransferFrom ? currentVehicle.transferPriceAOA : currentVehicle.pricePerDayAOA)
    : undefined);
  const currentPriceLabel = currentRouteMinPrice !== undefined
    ? t('routes.minPriceFromOneDay')
    : currentRoute.showTransferFrom ? t('routes.transferFrom') : t('routes.dailyFrom');

  return (
    <section id="rotas" className="section-padding bg-gradient-to-b from-[#001E4A] to-[#174B86] text-white relative overflow-hidden">
      {/* Background visual glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#FEC228]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-pepek relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#FEC228]/30 backdrop-blur-md text-xs font-bold text-[#FEC228] uppercase tracking-widest mb-4">
              <Compass className="w-4 h-4 text-[#FEC228]" />
              <span>{t('routes.eyebrow')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('routes.title')}
            </h2>
            <p className="text-base text-gray-300 mt-3">
              {t('routes.subtitle')}
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15">
            <span className="text-xs text-gray-300 font-semibold px-2">{t('routes.invoicingLabel')}</span>
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

                  {(route.showTransferFrom || route.displacementFeeAOA !== undefined) && (
                    <p className="text-xs text-gray-300 mb-2">
                      {t('routes.pricesFrom')} <strong className="text-sm font-extrabold text-[#FEC228]">{formatKz(interprovincialMinPrice(route) ?? lowestTransferAOA)}</strong>
                    </p>
                  )}

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
                      {t('routes.selectedItinerary')}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#09172C]">
                      {currentRoute.name}
                    </h3>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-full bg-[#236199] text-white text-xs font-bold border border-[#236199] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#236199] animate-pulse"></span>
                    <span>{t('routes.immediateAvailability')}</span>
                  </div>
                </div>

                {currentVehicleImage && (
                  <div className="mb-7 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-[#F5F6F6] to-white">
                    <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#001E4A]">{t('routes.recommendedVehicleHeader')}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E4AD28]">{t('routes.officialImage')}</span>
                    </div>
                    <div className="relative h-52 sm:h-64">
                      <img
                        src={currentVehicleImage.src}
                        alt={t('routes.vehicleImageAlt', { vehicle: currentVehicleImage.name })}
                        className="h-full w-full object-contain p-4 sm:p-5"
                      />
                    </div>
                    {currentVehicle && currentVehicleMinPrice !== undefined && (
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-white px-5 py-4">
                        <div>
                          <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#555B64]">{currentRouteMinPrice !== undefined ? t('routes.recommendedVehicle') : t('routes.vehicleMinPrice')}</span>
                          <span className="block text-sm font-bold text-[#09172C]">{currentVehicle.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#555B64]">
                            {currentPriceLabel}
                          </span>
                          <strong className="block text-xl font-extrabold text-[#236199]">{formatKz(currentVehicleMinPrice)}</strong>
                        </div>
                        {currentRoute.displacementFeeAOA !== undefined && (
                          <div className="w-full space-y-1.5 border-t border-[#E2E8F0] pt-3 text-xs text-[#09172C]">
                            <div className="flex justify-between gap-4">
                              <span>{t('routes.dailyRental')}</span>
                              <span className="font-bold">{formatKz(currentVehicle.pricePerDayAOA)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span>{t('routes.displacementFee', { destination: currentRoute.to })}</span>
                              <span className="font-bold">{formatKz(currentRoute.displacementFeeAOA)}</span>
                            </div>
                            <p className="pt-1 text-[11px] leading-relaxed text-[#555B64]">
                              {t('routes.exclusions')}
                              {currency !== 'AOA' && ` ${t('routes.fxNote', { currency })}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Narrative */}
                <p className="text-sm text-[#555B64] mb-8 leading-relaxed">
                  {currentRoute.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0]">
                    <span className="text-xs text-[#555B64] block mb-1 font-semibold uppercase">{t('routes.origin')}</span>
                    <span className="text-sm font-bold text-[#09172C] block">{currentRoute.from}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0]">
                    <span className="text-xs text-[#555B64] block mb-1 font-semibold uppercase">{t('routes.destination')}</span>
                    <span className="text-sm font-bold text-[#09172C] block">{currentRoute.to}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F6F6] border border-[#E2E8F0]">
                    <span className="text-xs text-[#555B64] block mb-1 font-semibold uppercase">{t('routes.recommendedVehicleLabel')}</span>
                    <span className="text-sm font-bold text-[#FEC228] block">{currentRoute.vehicle}</span>
                  </div>
                </div>

                {/* Quality Inclusions */}
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#09172C]">
                    <CheckCircle2 className="w-4 h-4 text-[#236199] shrink-0" />
                    <span>{t('routes.invoicingIn', { currency })}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#09172C]">
                    <CheckCircle2 className="w-4 h-4 text-[#236199] shrink-0" />
                    <span>{t('routes.waitTolerance')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#09172C]">
                    <CheckCircle2 className="w-4 h-4 text-[#236199] shrink-0" />
                    <span>{t('routes.onboard')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#555B64] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FEC228]" />
                  <span>{t('routes.fastConfirmation')}</span>
                </div>

                <a
                  href={generateQuickWhatsAppUrl(
                    t('routes.whatsappBooking', { route: currentRoute.name, currency })
                      + (currentVehicle && currentRouteMinPrice !== undefined
                        ? ` — ${t('routes.whatsappMinPrice', { vehicle: currentVehicle.name, price: formatKz(currentRouteMinPrice) })}`
                        : '')
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#236199] hover:bg-[#0C2E60] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('routes.confirmWhatsapp')}</span>
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
