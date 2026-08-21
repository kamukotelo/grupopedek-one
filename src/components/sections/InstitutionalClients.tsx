import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award } from 'lucide-react';

export const InstitutionalClients: React.FC = () => {
  const { t } = useTranslation();

  // All official client logos from the user's authentic public/carrousel folder
  const clientLogos = [
    { name: 'Embaixada Americana', src: '/carrousel/america-american-EMBASSADAlogo-1-150x78.webp' },
    { name: 'Governo de Angola', src: '/carrousel/LOGO-GOVERNO-DE-ANGOLA-150x141.webp' },
    { name: 'Assembleia Nacional', src: '/carrousel/SEMBLEIA-ANGOLANA-logo-150x78.webp' },
    { name: 'ANPG Petróleos', src: '/carrousel/APNG-150x78.webp' },
    { name: 'TAAG Linhas Aéreas', src: '/carrousel/TAAGG-150x78.webp' },
    { name: 'Banco BFA', src: '/carrousel/BFA-BANCO-DE-ANGOLA-150x78.webp' },
    { name: 'Banco Atlântico', src: '/carrousel/ATLANTICO-LOGO-MARCA-CLIENTE-DA-RENT-A-CAR-PEPEK-150x78.webp' },
    { name: 'Standard Bank', src: '/carrousel/standard-150x78.webp' },
    { name: 'UNICEF Angola', src: '/carrousel/UNICEF-TA-BEM-BOM-150x78.webp' },
    { name: 'Fidelidade Seguros', src: '/carrousel/fidelidade-150x78.webp' },
    { name: 'DSTV MultiChoice', src: '/carrousel/dstv-150x78.webp' },
    { name: 'ZAP Angola', src: '/carrousel/zap-150x78.webp' },
    { name: 'SIC Investigação Criminal', src: '/carrousel/SIC-ANGOOLA-150x78.webp' },
    { name: 'ELISAL', src: '/carrousel/ELISAL-150x78.webp' },
    { name: 'Catoca Diamantes', src: '/carrousel/catoca-150x78.webp' },
    { name: 'COSMOS Viagens', src: '/carrousel/COSMO-150x78.webp' },
    { name: 'HV International', src: '/carrousel/HV-LOGO-1-150x78.webp' },
    { name: 'FAF Futebol', src: '/carrousel/FAFI-LOGO-150x78.webp' },
    { name: 'Rede Globo', src: '/carrousel/REDE-GLOBO-CLIENTE-DA-EMPRESA-RENTY-A-CAR-pepek-150x78.webp' },
    { name: 'CNN Brasil', src: '/carrousel/CNN-BRASIL-150x78.webp' },
    { name: 'Deutsche Welle (DW)', src: '/carrousel/Dw-150x78.webp' },
  ];

  return (
    <section id="clientes" className="py-20 bg-[#040C1D] text-white relative overflow-hidden border-y border-white/10">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[320px] bg-[#0B45D8]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-pepek relative z-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-[#8899BB] uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
              <span>A Confiança de Organizações de Referência</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-inter">
              Corpo Diplomático, Órgãos de Soberania & Grandes Empresas
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Award className="w-4 h-4 text-[#0B45D8]" />
            <span>Padrão Internacional de Sigilo & Protocolo Executivo</span>
          </div>
        </div>
      </div>

      {/* Infinite Seamless Logo Carousel Engine */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Gradient Shadows for seamless edge fade */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#040C1D] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#040C1D] to-transparent z-20 pointer-events-none" />

        {/* Ticker Track with double duplicate for 100% seamless infinite glide */}
        <div className="flex items-center gap-6 sm:gap-10 animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] w-max select-none">
          {[...clientLogos, ...clientLogos].map((client, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center px-6 py-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#0B45D8]/70 hover:bg-[#0B45D8]/15 transition-all duration-300 min-w-[180px] sm:min-w-[220px] h-24 backdrop-blur-xs group shrink-0"
            >
              <img
                src={client.src}
                alt={client.name}
                className="max-h-12 max-w-[160px] w-auto object-contain filter brightness-[0.9] contrast-[1.2] group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                loading="lazy"
                onError={(e) => {
                  // Fallback to text if file path fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
