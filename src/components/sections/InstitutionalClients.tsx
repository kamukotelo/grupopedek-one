import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** `withLink` desliga a hiperligação quando a faixa já está dentro de /clientes. */
export const InstitutionalClients: React.FC<{ withLink?: boolean }> = ({ withLink = true }) => {
  const { t } = useTranslation();

  // Logótipos institucionais e empresariais confirmados pela PEPEK.
  const allLogos = [
    { name: 'Embaixada Americana', src: '/carrousel/america-american-EMBASSADAlogo-1-150x78.webp' },
    { name: 'Governo de Angola', src: '/carrousel/LOGO-GOVERNO-DE-ANGOLA-150x141.webp' },
    { name: 'Assembleia Nacional', src: '/carrousel/SEMBLEIA-ANGOLANA-logo-150x78.webp' },
    { name: 'ANPG Petróleos', src: '/carrousel/APNG-150x78.webp' },
    { name: 'Bestfly Angola', src: '/clients-color/bestfly.png' },
    { name: 'DP World', src: '/clients-color/dp-world.png' },
    { name: 'Câmara de Comércio e Indústria Angola–Arábia Saudita', src: '/clients-color/cciaas.png' },
    { name: 'Programa das Nações Unidas para o Desenvolvimento', src: '/clients-color/undp.png' },
    { name: 'Banco BFA', src: '/clients-color/bfa.svg' },

    { name: 'Banco Atlântico', src: '/clients-color/atlantico-oficial.png' },
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
    <section className="relative select-none overflow-hidden border-b border-white/10 bg-[#09172C] py-8">
      <div className="container-pepek">
        {/* Subtle, discreet header strip */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {withLink ? (
            <Link to="/clientes" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8899BB] transition-colors hover:text-[#FEC228]">
              Confiança Institucional &amp; Entidades de Referência
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8899BB]">
              Confiança Institucional &amp; Entidades de Referência
            </p>
          )}

          {/* Dots navigation */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 bg-[#FEC228]'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ver grupo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 5 to 6 Logos Grid (Smooth Slide Transition every 5s) */}
        {/* min-h acomoda 2 linhas × h-20 + gap em mobile (grid-cols-3) */}
        <div className="relative min-h-[176px] sm:min-h-[96px]">
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
                  className="group flex h-20 items-center justify-center rounded-xl border border-white/20 bg-white p-3 shadow-sm transition-all hover:border-[#FEC228]/70 hover:shadow-md"
                >
                  <img
                    src={client.src}
                    alt={client.name}
                    className="max-h-11 max-w-[130px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
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
