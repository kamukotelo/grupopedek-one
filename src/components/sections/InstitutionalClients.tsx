import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Building, Landmark, Globe2 } from 'lucide-react';

export const InstitutionalClients: React.FC = () => {
  const { t } = useTranslation();

  const clients = [
    {
      id: 'embassy-usa',
      name: 'Embaixada dos Estados Unidos',
      sub: 'U.S. Embassy Luanda',
      category: 'Corpo Diplomático',
      icon: <Globe2 className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Missões Diplomáticas'
    },
    {
      id: 'governo-angola',
      name: 'Governo de Angola',
      sub: 'Ministérios & Delegações de Estado',
      category: 'Sector Público',
      icon: <Landmark className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Protocolo de Estado'
    },
    {
      id: 'assembleia-nacional',
      name: 'Assembleia Nacional',
      sub: 'República de Angola',
      category: 'Órgão de Soberania',
      icon: <Landmark className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Transporte Parlamentar'
    },
    {
      id: 'sonangol',
      name: 'SONANGOL E.P.',
      sub: 'Sociedade Nacional de Combustíveis',
      category: 'Energia & Petróleos',
      icon: <Building className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Mobilidade Operacional'
    },
    {
      id: 'taag',
      name: 'TAAG Linhas Aéreas',
      sub: 'Angola Airlines',
      category: 'Aviação Comercial',
      icon: <Building className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Transfers de Tripulações & VIP'
    },
    {
      id: 'bfa',
      name: 'Banco BFA',
      sub: 'Banco de Fomento Angola',
      category: 'Banca & Finanças',
      icon: <Building className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Gestão de Frotas'
    },
    {
      id: 'fidelidade',
      name: 'Fidelidade Angola',
      sub: 'Companhia de Seguros',
      category: 'Seguros & Serviços',
      icon: <ShieldCheck className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Viaturas de Substituição'
    },
    {
      id: 'dstv',
      name: 'DSTV / MultiChoice',
      sub: 'Telecomunicações & Média',
      category: 'Média & Conteúdos',
      icon: <Building className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Logística de Produções'
    },
    {
      id: 'unicef',
      name: 'UNICEF Angola',
      sub: 'Nações Unidas',
      category: 'Organismo Internacional',
      icon: <Globe2 className="w-6 h-6 text-[#0B45D8]" />,
      tag: 'Missões no Interior'
    }
  ];

  return (
    <section id="clientes" className="section-padding bg-[#06142F] text-white relative overflow-hidden">
      {/* Background Subtle Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#0B45D8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="container-pepek relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-[#8899BB] uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
            <span>{t('clients.tag')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 font-inter">
            {t('clients.title')}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
            {t('clients.subtitle')}
          </p>
        </div>

        {/* Editorial Logo & Institution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#0B45D8]/60 hover:bg-[#0B45D8]/[0.08] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-[#0B45D8]/20 transition-all">
                    {client.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 py-1 rounded bg-white/5 border border-white/5">
                    {client.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-gray-100 mb-1">
                  {client.name}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  {client.sub}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#0B45D8] font-semibold">
                  ✓ {client.tag}
                </span>
                <span className="text-xs text-gray-500 font-mono">Conta Activa</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Indicator */}
        <div className="mt-14 p-6 rounded-xl bg-gradient-to-r from-white/[0.05] via-[#0B45D8]/10 to-white/[0.05] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-sm text-gray-200">
              Disponibilidade protocolar imediata para novas acreditações diplomáticas e acordos-quadro empresariais.
            </p>
          </div>

          <a
            href="#contactos"
            className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#0B45D8] px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0"
          >
            Solicitar Acordo Corporativo ➔
          </a>
        </div>
      </div>
    </section>
  );
};
