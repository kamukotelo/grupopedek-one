import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Phone, ChevronRight, Award, UserCheck, Building2, Clock, Car, Sparkles } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  // 20 Authentic Client Logos grouped in 5 by 5 (4 slides)
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
    { name: 'CNN Brasil & DW', src: '/carrousel/CNN-BRASIL-150x78.webp' },
  ];

  // Group 5 by 5
  const logosPerSlide = 5;
  const slides: Array<typeof clientLogos> = [];
  for (let i = 0; i < clientLogos.length; i += logosPerSlide) {
    slides.push(clientLogos.slice(i, i + logosPerSlide));
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotate every 5 seconds with sleek futuristic sliding
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToBooking = () => {
    const el = document.getElementById('reserva');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFleet = () => {
    const el = document.getElementById('frota');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative bg-[#06142F] text-white pt-32 lg:pt-40 pb-16 overflow-hidden min-h-[92vh] flex flex-col justify-between">
      {/* Cinematic Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2400&q=85"
          alt="PEPEK Frota Executiva Luanda"
          className="w-full h-full object-cover object-center filter brightness-[0.24] contrast-[1.25] scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-[#06142F]/75 to-[#06142F]/90" />
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#0B45D8]/20 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="container-pepek relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-[#8899BB] uppercase tracking-[0.2em] mb-6 w-fit animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
          <span>Sociedade de Mobilidade Executiva & Rent-a-Car · Luanda, Angola</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl mb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight font-inter">
            "Movemos quem move Angola."
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 font-light mt-5 leading-relaxed max-w-3xl">
            A escolha de referência para <strong className="text-white font-semibold">Embaixadas, Governo, Multinacionais</strong> e entidades de estado. Aluguer de viaturas de alta gama com ou sem motorista protocolar bilingue.
          </p>
        </div>

        {/* 3 Key Pillars of Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mb-10 text-xs sm:text-sm font-semibold text-gray-200">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
            <Building2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
            <span>Embaixadas & Delegações Diplomáticas</span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
            <Award className="w-5 h-5 text-[#0B45D8] shrink-0" />
            <span>Contratos Corporativos & Faturação AGT</span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
            <Clock className="w-5 h-5 text-[#0B45D8] shrink-0" />
            <span>Assistência Operacional 24/7 nas 18 Províncias</span>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <button
            type="button"
            onClick={scrollToBooking}
            className="btn-primary text-sm font-bold py-4 px-8 shadow-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform"
          >
            <Car className="w-5 h-5" />
            <span>Simulador & Ficha de Cadastro Online</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={scrollToFleet}
            className="btn-outline text-sm font-bold py-4 px-8 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span>Explorar Frota de Alta Gama</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-300 pl-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>Central de Talatona em Prontidão</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            TOP CLIENT LOGOS CAROUSEL — Directly inside Hero
            5 by 5, Enhanced Size & Futuristic Luminous Slide
           ═══════════════════════════════════════════════════════ */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#8899BB] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0B45D8]" />
              <span>A Confiança de Organizações de Referência em Angola</span>
            </p>

            {/* Futuristic Slide Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    currentSlide === idx
                      ? 'w-7 bg-[#0B45D8] shadow-[0_0_12px_rgba(11,69,216,0.9)]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Ver grupo de parceiros ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 5-by-5 Logos Grid with Enhanced Size, Brightness and Futuristic Slide */}
          <div className="relative min-h-[105px] overflow-hidden">
            {slides.map((group, slideIdx) => (
              <div
                key={slideIdx}
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-5 items-center transition-all duration-700 ease-out ${
                  currentSlide === slideIdx
                    ? 'opacity-100 translate-x-0 relative pointer-events-auto'
                    : 'opacity-0 translate-x-12 absolute inset-0 pointer-events-none'
                }`}
              >
                {group.map((client, logoIdx) => (
                  <div
                    key={logoIdx}
                    className="flex items-center justify-center p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#0B45D8] hover:bg-[#0B45D8]/20 transition-all duration-300 h-24 sm:h-26 backdrop-blur-md group shadow-sm"
                  >
                    <img
                      src={client.src}
                      alt={client.name}
                      className="max-h-14 sm:max-h-16 max-w-[155px] w-auto object-contain filter brightness-[1.1] contrast-[1.25] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:brightness-125 group-hover:scale-110 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
