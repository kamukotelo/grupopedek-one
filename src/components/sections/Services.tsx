import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Languages,
  Handshake,
  Headphones,
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Services: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. Top 4 Luxury Feature Pillars with Gold Icons (Exact style from Reference Image 3)
  const pillars = [
    {
      id: 'frota-premium',
      label: 'Frota Premium',
      icon: (
        <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
          <path d="M5 10l1.5-3.5h5.5" />
          <path d="M12 2l1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2L9 4h2z" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'motoristas-bilingues',
      label: 'Motoristas Bilingues',
      icon: (
        <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <circle cx="12" cy="10" r="2" />
          <path d="M8 2v2" />
          <path d="M16 2v2" />
          <path d="M7 8h2" />
          <path d="M15 8h2" />
        </svg>
      )
    },
    {
      id: 'servicos-protocolares',
      label: 'Serviços Protocolares',
      icon: (
        <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M19 11l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'suporte-24h',
      label: 'Suporte 24 Horas',
      icon: (
        <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          <path d="M12 8v4l2 2" />
        </svg>
      )
    }
  ];

  // 2. The 4 High-Impact Visual Cards with Dominant Vehicle & Chauffeur Photos
  const serviceCards = [
    {
      id: 'rent-a-car',
      title: 'Rent a Car',
      subtitle: 'Conforto e liberdade para o seu dia.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=85',
      alt: 'Chauffeur e cliente em SUV Land Cruiser Prado — Pepek Rent-a-Car',
      buttonText: 'Alugar veículos',
      action: 'booking'
    },
    {
      id: 'apoio-executivo',
      title: 'Apoio Executivo',
      subtitle: 'Pontualidade e eficiência.',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=85',
      alt: 'Entrega de chave e viatura executiva em Luanda — Pepek Grupo',
      buttonText: 'Saber mais',
      action: 'frota'
    },
    {
      id: 'corporativo',
      title: 'Corporativo',
      subtitle: 'Segurança e discrição em cada viagem.',
      image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=85',
      alt: 'Comitiva diplomática e van VIP em Luanda — Pepek Corporativo',
      buttonText: 'Saber mais',
      action: 'corporate'
    },
    {
      id: 'eventos',
      title: 'Eventos',
      subtitle: 'Chegue com estilo e sem preocupação.',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=85',
      alt: 'Viatura de luxo para casamentos e eventos VIP em Luanda — Pepek Grupo',
      buttonText: 'Saber mais',
      action: 'whatsapp'
    }
  ];

  const handleCardClick = (action: string, title: string) => {
    if (action === 'booking') {
      navigate('/reservar');
      const el = document.getElementById('reserva');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'frota') {
      navigate('/frota');
    } else if (action === 'corporate') {
      navigate('/clientes');
    } else {
      window.open(generateQuickWhatsAppUrl(`Serviço de ${title}`), '_blank');
    }
  };

  return (
    <section id="servicos" className="py-20 sm:py-28 bg-white relative">
      <div className="container-pepek">
        {/* ═══════════════════════════════════════════════════════
            TOP PILLARS: Soluções Exclusivas de Transporte
           ═══════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm font-serif italic text-gray-700 tracking-wider mb-8">
            Soluções exclusivas de transporte
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {pillars.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-100/70 shadow-xs">
                  {p.icon}
                </div>
                <span className="text-xs sm:text-sm font-serif text-amber-700 font-semibold tracking-wide">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION TITLE WITH ELEGANT DIVIDER LINES
           ═══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-6 my-12 max-w-4xl mx-auto">
          <div className="h-[1px] bg-gray-300 flex-1"></div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#06142F] font-bold tracking-wide">
            Nossos Serviços
          </h2>
          <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            4 HIGH-IMPACT CARDS (Vehicle Photos Dominating Top Half)
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              className="rounded-3xl overflow-hidden bg-[#06142F] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group border border-white/5"
            >
              {/* Dominant Vehicle / Chauffeur Image */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-900">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-transparent to-transparent opacity-80" />
              </div>

              {/* Card Body with Elegant Dark Navy Background */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between text-center">
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                {/* Golden CTA Button (Exact design from Reference Image 3) */}
                <button
                  type="button"
                  onClick={() => handleCardClick(card.action, card.title)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#C59B27] hover:from-[#F0D070] hover:to-[#D4AF37] text-[#06142F] font-bold text-xs shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-amber-500/20 active:scale-98"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
