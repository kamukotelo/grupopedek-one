import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/** `withLink` desliga a hiperligação quando a faixa já está dentro de /clientes. */
export const InstitutionalClients: React.FC<{ withLink?: boolean }> = ({ withLink = true }) => {
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

        </div>

        {/* Cada logótipo fica visível num quadro próprio, sem sobreposição de slides. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {allLogos.map((client) => (
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
      </div>
    </section>
  );
};
