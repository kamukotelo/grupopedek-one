import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Shield, Wrench, CheckCircle } from 'lucide-react';

export const CoverageMap: React.FC = () => {
  const { t } = useTranslation();

  const operationalHubs = [
    {
      name: 'Luanda — Sede Central & Hub Internacional',
      status: 'Operação 24 Horas',
      type: 'Sede Principal',
      facilities: ['Aeroporto 4 de Fevereiro & AIAAN', 'Centro de Despacho VIP', 'Base de Manutenção Própria', 'Frota de Reserva Imediata'],
      isPrimary: true
    },
    {
      name: 'Huambo — Pólo Planalto Central',
      status: 'Base Operacional Regional',
      type: 'Hub Regional',
      facilities: ['Apoio a Missões no Centro e Sul', 'Frotas 4x4 Todo-Terreno', 'Oficina de Apoio Rápido', 'Pilotos Locais Credenciados'],
      isPrimary: false
    },
    {
      name: 'Bengo — Pólo Corredor Norte',
      status: 'Base Avançada',
      type: 'Hub Norte',
      facilities: ['Ligação a Caxito e Litoral', 'Apoio a Projectos Agro-Industriais', 'Escolta e Logística de Equipas', 'Assistência Mecânica Móvel'],
      isPrimary: false
    }
  ];

  const provinces = [
    'Luanda', 'Huambo', 'Bengo', 'Benguela', 'Cabinda', 'Cuanza Sul',
    'Cuanza Norte', 'Huíla', 'Namibe', 'Malanje', 'Uíge', 'Zaire',
    'Lunda Norte', 'Lunda Sul', 'Bié', 'Moxico', 'Cunene', 'Cuando Cubango'
  ];

  return (
    <section className="section-padding bg-gray-50 relative">
      <div className="container-pepek">
        <div className="max-w-3xl mb-14">
          <div className="tag-label mb-4">
            <span>Presença Territorial</span>
          </div>

          <h2 className="section-title mb-4">
            Cobertura Operacional em Toda a Angola
          </h2>

          <p className="section-subtitle">
            Com bases estratégicas e rede de assistência móvel, garantimos continuidade operacional e segurança em qualquer província do país.
          </p>
        </div>

        {/* 3 Main Hubs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {operationalHubs.map((hub, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-2xl border transition-all flex flex-col justify-between ${
                hub.isPrimary
                  ? 'bg-[#06142F] text-white border-[#0B45D8] shadow-xl'
                  : 'bg-white text-gray-900 border-gray-200 shadow-xs hover:border-[#0B45D8]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${hub.isPrimary ? 'bg-[#0B45D8] text-white' : 'bg-blue-50 text-[#0B45D8]'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    hub.isPrimary ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {hub.status}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-4 ${hub.isPrimary ? 'text-white' : 'text-[#06142F]'}`}>
                  {hub.name}
                </h3>

                <ul className="space-y-2.5 mb-6">
                  {hub.facilities.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs font-medium">
                      <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${hub.isPrimary ? 'text-[#0B45D8]' : 'text-emerald-600'}`} />
                      <span className={hub.isPrimary ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`pt-4 border-t text-xs font-semibold flex items-center gap-2 ${
                hub.isPrimary ? 'border-white/10 text-gray-300' : 'border-gray-100 text-[#0B45D8]'
              }`}>
                <Navigation className="w-4 h-4" />
                <span>Base Activa & Certificada</span>
              </div>
            </div>
          ))}
        </div>

        {/* 18 Provinces Interactive Badge Matrix */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#06142F] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0B45D8]" />
                <span>Prontidão Operacional em Angola</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Serviço de aluguer de frotas 4x4, transfers interprovinciais e assistência técnica em viagem.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 shrink-0">
              <Wrench className="w-4 h-4 text-[#0B45D8]" />
              <span>Socorro Mecânico 24/7</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {provinces.map((prov, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-lg bg-gray-50 hover:bg-[#0B45D8] hover:text-white border border-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-default"
              >
                📍 {prov}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
