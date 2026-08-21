import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const InstitutionalClients: React.FC = () => {
  const { t } = useTranslation();

  // 21 Authentic client logos
  const allLogos = [
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

  // Group into slides of 6 logos each
  const logosPerSlide = 6;
  const slides: Array<typeof allLogos> = [];
  for (let i = 0; i < allLogos.length; i += logosPerSlide) {
    slides.push(allLogos.slice(i, i + logosPerSlide));
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotate every 5 seconds as requested
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-[#030D1F] py-8 border-b border-white/10 relative overflow-hidden select-none">
      <div className="container-pepek">
        {/* Subtle, discreet header strip */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8899BB]">
            Confiança Institucional & Entidades de Referência
          </p>

          {/* Dots navigation */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 bg-[#0B45D8]'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ver grupo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 5 to 6 Logos Grid (Smooth Slide Transition every 5s) */}
        <div className="relative min-h-[90px]">
          {slides.map((group, slideIdx) => (
            <div
              key={slideIdx}
              className={`grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-6 items-center transition-all duration-700 ${
                currentSlide === slideIdx
                  ? 'opacity-100 scale-100 relative pointer-events-auto'
                  : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
              }`}
            >
              {group.map((client, logoIdx) => (
                <div
                  key={logoIdx}
                  className="flex items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#0B45D8]/50 hover:bg-white/[0.06] transition-all h-20 group"
                >
                  <img
                    src={client.src}
                    alt={client.name}
                    className="max-h-11 max-w-[130px] w-auto object-contain filter brightness-[0.9] contrast-[1.15] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
