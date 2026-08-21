import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award } from 'lucide-react';

export const InstitutionalClients: React.FC = () => {
  const { t } = useTranslation();

  // Logos array with actual images and crisp vector representations
  const clientLogos = [
    {
      name: 'Embaixada Americana',
      subtitle: 'U.S. Embassy Luanda',
      src: '/carrossel/embaixada-americana.png',
    },
    {
      name: 'Governo de Angola',
      subtitle: 'República de Angola',
      src: '/carrossel/governo-angola.png',
    },
    {
      name: 'ANPG',
      subtitle: 'Agência Nacional de Petróleo e Gás',
      src: '/carrossel/anpg.png',
    },
    {
      name: 'Assembleia Nacional',
      subtitle: 'República de Angola',
      src: '/carrossel/strip-logos.png',
    },
    {
      name: 'SONANGOL E.P.',
      subtitle: 'Sociedade Nacional de Combustíveis',
      customText: 'SONANGOL',
      badge: 'Energia'
    },
    {
      name: 'TAAG Linhas Aéreas',
      subtitle: 'Angola Airlines',
      customText: 'TAAG',
      badge: 'Aviação'
    },
    {
      name: 'Banco BFA',
      subtitle: 'Banco de Fomento Angola',
      customText: 'BFA',
      badge: 'Banca'
    },
    {
      name: 'UNICEF Angola',
      subtitle: 'Nações Unidas',
      customText: 'UNICEF',
      badge: 'Organismo Internacional'
    },
    {
      name: 'DSTV MultiChoice',
      subtitle: 'Telecomunicações & Média',
      customText: 'DStv',
      badge: 'Telecom'
    },
    {
      name: 'Fidelidade Angola',
      subtitle: 'Companhia de Seguros',
      customText: 'FIDELIDADE',
      badge: 'Seguros'
    }
  ];

  return (
    <section id="clientes" className="py-20 bg-[#040C1D] text-white relative overflow-hidden border-y border-white/10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#0B45D8]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-pepek relative z-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-[#8899BB] uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
              <span>A Confiança de Organizações de Referência</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-inter">
              Corpo Diplomático, Governo & Líderes Empresariais
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Award className="w-4 h-4 text-[#0B45D8]" />
            <span>Padrão Internacional de Sigilo & Protocolo</span>
          </div>
        </div>
      </div>

      {/* Infinite Logo Carousel Engine (Continuous Luxury Ticker) */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Gradient Shadows for seamless fade */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#040C1D] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#040C1D] to-transparent z-20 pointer-events-none" />

        {/* Ticker Track (Double loop for seamless infinite scroll) */}
        <div className="flex items-center gap-8 sm:gap-12 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused] w-max select-none">
          {[...clientLogos, ...clientLogos].map((client, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#0B45D8]/70 hover:bg-[#0B45D8]/10 transition-all duration-300 min-w-[200px] sm:min-w-[240px] h-24 backdrop-blur-xs group shrink-0"
            >
              {client.src ? (
                <img
                  src={client.src}
                  alt={client.name}
                  className="max-h-12 max-w-[180px] w-auto object-contain filter brightness-[0.85] contrast-[1.2] group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="text-center">
                  <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white/80 group-hover:text-white font-inter block transition-colors">
                    {client.customText}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mt-0.5">
                    {client.badge}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
