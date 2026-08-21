import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Car, Building2, Star, Zap, Shield, Clock, Users } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Services: React.FC = () => {
  const navigate = useNavigate();

  /* ─── Top Feature Pillars ─── */
  const pillars = [
    {
      id: 'frota-premium',
      label: 'Frota Premium',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      )
    },
    {
      id: 'motoristas',
      label: 'Motoristas Bilingues',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
          <circle cx="12" cy="10" r="3" />
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M8 2v2M16 2v2" />
        </svg>
      )
    },
    {
      id: 'protocolar',
      label: 'Serviços Protocolares',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'suporte',
      label: 'Suporte 24 Horas',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      )
    }
  ];

  /* ─── Service Cards ─── */
  const serviceCards = [
    {
      id: 'rent-a-car',
      title: 'Rent a Car',
      subtitle: 'Conforto e liberdade para o seu dia. Frota premium, sem complicações.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=85',
      alt: 'SUV premium — Pepek Rent-a-Car Luanda',
      badge: 'Mais Popular',
      badgeColor: 'bg-[#0B45D8]',
      accentColor: '#0B45D8',
      accentLight: '#60A5FA',
      buttonText: 'Reservar Agora',
      icon: <Car className="w-4 h-4" />,
      action: 'booking'
    },
    {
      id: 'apoio-executivo',
      title: 'Apoio Executivo',
      subtitle: 'Motorista bilingue, pontualidade de protocolo e total discrição.',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=85',
      alt: 'Viatura executiva com motorista — Pepek Grupo',
      badge: 'VIP',
      badgeColor: 'bg-amber-500',
      accentColor: '#F59E0B',
      accentLight: '#FCD34D',
      buttonText: 'Ver Frota',
      icon: <Star className="w-4 h-4" />,
      action: 'frota'
    },
    {
      id: 'corporativo',
      title: 'Corporativo',
      subtitle: 'Gestão de frota para empresas, embaixadas e organismos do estado.',
      image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=85',
      alt: 'Comitiva diplomática — Pepek Corporativo',
      badge: 'Enterprise',
      badgeColor: 'bg-emerald-600',
      accentColor: '#10B981',
      accentLight: '#6EE7B7',
      buttonText: 'Saber Mais',
      icon: <Building2 className="w-4 h-4" />,
      action: 'corporate'
    },
    {
      id: 'eventos',
      title: 'Eventos & Cerimónias',
      subtitle: 'Chegue com impacto. Casamentos, cimeiras e eventos de gala.',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=85',
      alt: 'Viatura de luxo para eventos — Pepek Grupo',
      badge: 'Premium',
      badgeColor: 'bg-purple-600',
      accentColor: '#8B5CF6',
      accentLight: '#C4B5FD',
      buttonText: 'Solicitar Proposta',
      icon: <Zap className="w-4 h-4" />,
      action: 'whatsapp'
    }
  ];

  const handleCardClick = (action: string, title: string) => {
    if (action === 'booking') {
      navigate('/frota');
    } else if (action === 'frota') {
      navigate('/frota');
    } else if (action === 'corporate') {
      navigate('/clientes');
    } else {
      window.open(generateQuickWhatsAppUrl(`Serviço de ${title}`), '_blank');
    }
  };

  return (
    <section
      id="servicos"
      className="relative py-20 sm:py-28 bg-[#020C1B] overflow-hidden"
    >
      {/* ── Background Grid Dots ── */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11,69,216,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,69,216,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* ── Ambient Glows ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#0B45D8]/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[250px] bg-amber-500/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-pepek relative z-10">

        {/* ════════════ SECTION HEADER ════════════ */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B45D8]/10 border border-[#0B45D8]/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B45D8] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.15em] text-[#0B45D8] uppercase">
              Soluções Exclusivas de Transporte
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Os Nossos <span className="text-[#0B45D8]">Serviços</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Mobilidade premium para diplomatas, executivos e empresas em Angola e além.
          </p>
        </div>

        {/* ════════════ FEATURE PILLARS ════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-16">
          {pillars.map((p) => (
            <div
              key={p.id}
              className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-[#0B45D8]/10 hover:border-[#0B45D8]/30 transition-all duration-300 cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0B45D8]/15 border border-[#0B45D8]/20 flex items-center justify-center text-[#0B45D8] shrink-0 group-hover:bg-[#0B45D8]/25 transition-colors">
                {p.icon}
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-gray-300 group-hover:text-white transition-colors leading-snug">
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* ════════════ SERVICE CARDS ════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#040F22] hover:border-white/15 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
              onClick={() => handleCardClick(card.action, card.title)}
            >
              {/* Vehicle Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040F22] via-[#040F22]/20 to-transparent" />

                {/* Badge */}
                <span className={`absolute top-3 left-3 ${card.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase`}>
                  {card.badge}
                </span>

                {/* Icon pill */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ background: card.accentColor + '33', border: `1px solid ${card.accentColor}55` }}
                >
                  {card.icon}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="mb-5">
                  <h3 className="text-[15px] font-bold text-white mb-1.5 tracking-wide">{card.title}</h3>
                  <p className="text-[12px] text-gray-400 leading-relaxed">{card.subtitle}</p>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card.action, card.title);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:brightness-125"
                  style={{
                    background: `${card.accentColor}18`,
                    border: `1px solid ${card.accentColor}40`,
                    color: card.accentLight
                  }}
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Bottom glow accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* ════════════ TRUST BAR ════════════ */}
        <div className="mt-16 pt-10 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <Shield className="w-5 h-5" />, label: 'Totalmente Segurado', sub: 'Cobertura completa em cada viagem' },
            { icon: <Clock className="w-5 h-5" />, label: 'Disponível 24/7', sub: 'Suporte e frota sempre prontos' },
            { icon: <Users className="w-5 h-5" />, label: '+200 Clientes Institucionais', sub: 'Embaixadas, Governo e Multinacionais' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#0B45D8]/10 border border-[#0B45D8]/20 flex items-center justify-center text-[#0B45D8]">
                {item.icon}
              </div>
              <p className="text-[13px] font-semibold text-white">{item.label}</p>
              <p className="text-[11px] text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

