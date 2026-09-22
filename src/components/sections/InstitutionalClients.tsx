import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

/** `withLink` desliga a hiperligação quando a faixa já está dentro de /clientes. */
export const InstitutionalClients: React.FC<{ withLink?: boolean }> = ({ withLink = true }) => {
  const [logosPerSlide, setLogosPerSlide] = useState(6);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const updateColumns = () => setLogosPerSlide(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 6);
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Logótipos institucionais e empresariais confirmados pela PEPEK.
  const allLogos = [
    { name: 'Embaixada Americana', src: '/clients-color/embassy.png' },
    { name: 'Governo de Angola', src: '/clients-color/governo-angola.png' },
    { name: 'Assembleia Nacional', src: '/clients-color/assembleia.png' },
    { name: 'ANPG Petróleos', src: '/clients-color/anpg.png' },
    { name: 'Bestfly Angola', src: '/clients-color/bestfly.png' },
    { name: 'DP World', src: '/clients-color/dp-world.png' },
    { name: 'Câmara de Comércio e Indústria Angola–Arábia Saudita', src: '/clients-color/cciaas.png' },
    { name: 'Programa das Nações Unidas para o Desenvolvimento', src: '/clients-color/undp.png' },
    { name: 'Banco BFA', src: '/clients-color/bfa.svg' },

    { name: 'Banco Atlântico', src: '/clients-color/atlantico-oficial.png' },
    { name: 'Standard Bank', src: '/clients-color/standard.png' },
    { name: 'UNICEF Angola', src: '/clients-color/unicef.png' },
    { name: 'Fidelidade Seguros', src: '/clients-color/fidelidade.png' },
    { name: 'DSTV MultiChoice', src: '/clients-color/dstv.png' },
    { name: 'ZAP Angola', src: '/clients-color/zap.png' },

    { name: 'SIC Investigação Criminal', src: '/carrousel/SIC-ANGOOLA-150x78.webp' },
    { name: 'ELISAL', src: '/carrousel/ELISAL-150x78.webp' },
    { name: 'Catoca Diamantes', src: '/clients-color/catoca.png' },
    { name: 'COSMOS Viagens', src: '/carrousel/COSMO-150x78.webp' },
    { name: 'HV International', src: '/carrousel/HV-LOGO-1-150x78.webp' },
    { name: 'FAF Futebol', src: '/carrousel/FAFI-LOGO-150x78.webp' },

    { name: 'Rede Globo', src: '/clients-color/globo.png' },
    { name: 'CNN Brasil', src: '/clients-color/cnn.png' },
    { name: 'Deutsche Welle (DW)', src: '/carrousel/Dw-150x78.webp' },
  ];

  const slides = Array.from({ length: Math.ceil(allLogos.length / logosPerSlide) }, (_, index) =>
    allLogos.slice(index * logosPerSlide, (index + 1) * logosPerSlide)
  );

  useEffect(() => {
    setCurrentSlide(0);
    const timer = window.setInterval(() => setCurrentSlide((slide) => (slide + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [logosPerSlide, slides.length]);

  return (
    <section className="relative select-none overflow-hidden border-b border-white/10 bg-[#09172C] py-8">
      <div className="container-pepek">
        {/* Subtle, discreet header strip */}
        <div className="mb-4 flex items-center justify-between gap-4">
          {withLink ? (
            <Link to="/clientes" className="group inline-flex max-w-[300px] items-center gap-2 text-[10px] font-bold uppercase leading-5 tracking-[0.14em] text-[#A9BAD5] transition-colors hover:text-[#FEC228] sm:max-w-none sm:text-[11px] sm:tracking-[0.2em]">
              Confiança Institucional &amp; Entidades de Referência
              <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <p className="max-w-[300px] text-[10px] font-bold uppercase leading-5 tracking-[0.14em] text-[#A9BAD5] sm:max-w-none sm:text-[11px] sm:tracking-[0.2em]">
              Confiança Institucional &amp; Entidades de Referência
            </p>
          )}
          <div className="hidden items-center gap-1.5 sm:flex" aria-label="Grupos de clientes">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${currentSlide === index ? 'w-6 bg-[#FEC228]' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Ver grupo ${index + 1}`}
                aria-current={currentSlide === index ? 'true' : undefined}
              />
            ))}
          </div>
        </div>

        {/* Uma linha por vez; todos os grupos são acessíveis pelos indicadores. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6" aria-live="polite">
          {slides[currentSlide].map((client) => (
            <div
              key={client.name}
              className={`group flex h-24 min-w-0 items-center justify-center rounded-xl border border-white/20 p-3 shadow-sm transition-all hover:border-[#FEC228]/70 hover:shadow-md sm:h-28 sm:p-4 ${client.src.startsWith('/carrousel/') ? 'bg-[#183451]' : 'bg-white'}`}
            >
              <img
                src={client.src}
                alt={client.name}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-5 sm:hidden" aria-label="Navegação dos clientes">
          <button type="button" onClick={() => setCurrentSlide((slide) => (slide - 1 + slides.length) % slides.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white" aria-label="Grupo anterior">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-12 text-center text-xs font-semibold tabular-nums text-[#A9BAD5]">{currentSlide + 1} / {slides.length}</span>
          <button type="button" onClick={() => setCurrentSlide((slide) => (slide + 1) % slides.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white" aria-label="Grupo seguinte">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
