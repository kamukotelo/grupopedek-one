import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Users, Landmark, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  const corePillars = [
    {
      icon: <Car className="w-5 h-5 text-[#0B45D8]" />,
      title: 'Frota Premium',
      desc: 'SUVs, 4x4 e berlinas de luxo com manutenção rigorosa'
    },
    {
      icon: <Users className="w-5 h-5 text-[#0B45D8]" />,
      title: 'Motoristas Bilingues',
      desc: 'Formação em condução defensiva, protocolo e sigilo'
    },
    {
      icon: <Landmark className="w-5 h-5 text-[#0B45D8]" />,
      title: 'Serviços Protocolares',
      desc: 'Comitivas para embaixadas, governos e delegações'
    },
    {
      icon: <Clock className="w-5 h-5 text-[#0B45D8]" />,
      title: 'Suporte 24 Horas',
      desc: 'Central de despacho e assistência móvel permanente'
    },
  ];

  return (
    <section id="inicio" className="relative min-h-[98vh] flex flex-col justify-between pt-36 sm:pt-44 pb-16 overflow-hidden bg-[#06142F]">
      {/* Cinematic Full-Bleed Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=90"
          alt="Frota Executiva PEPEK GRUPO Angola"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.32] contrast-[1.15]"
          loading="eager"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06142F]/98 via-[#06142F]/85 to-[#06142F]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-transparent to-[#06142F]/80" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#0B45D8]/20 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="container-pepek relative z-10 w-full flex-1 flex flex-col justify-center py-8">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-gray-200 uppercase tracking-widest mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B45D8] animate-pulse"></span>
            <span>A Escolha Perfeita para Cada Viagem</span>
          </div>

          {/* Slogan & Main Statement */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.05] mb-8 font-inter">
            Movemos quem <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#0B45D8]">
              move Angola.
            </span>
          </h1>

          {/* Supporting Statement */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light max-w-3xl">
            Viva uma experiência de mobilidade inteligente e de alto padrão. Desde 2014, a parceira de confiança de embaixadas, entidades de estado e corporações líderes em Luanda, Huambo, Bengo e todo o território nacional.
          </p>

          {/* Key Checklist */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-12 text-sm text-gray-200 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
              <span>Embaixadas & Delegações Diplomáticas</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
              <span>Contratos Corporativos & Faturação AGT</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
              <span>Assistência Operacional 24/7</span>
            </div>
          </div>

          {/* Spacious Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
            <a
              href="#reserva"
              className="btn-primary py-5 px-10 text-base font-bold shadow-2xl flex items-center justify-center gap-3"
            >
              <span>Solicite Agora a Sua Experiência VIP</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#frota"
              className="btn-outline py-5 px-9 text-base font-bold flex items-center justify-center gap-2"
            >
              <span>Conhecer a Frota de Luxo</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Strip on Bottom of Hero */}
      <div className="relative z-10 w-full mt-12 border-t border-white/10 pt-8">
        <div className="container-pepek">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {corePillars.map((p, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#0B45D8]/60 transition-all duration-300 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0 text-[#0B45D8]">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
