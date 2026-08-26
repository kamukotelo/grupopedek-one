import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { useLocation, useNavigate } from 'react-router-dom';

export const MobileQuickBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToBooking = () => {
    const el = document.getElementById('reserva');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (location.pathname !== '/reservar') navigate('/reservar');
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/15 bg-[#0C3D73]/95 shadow-2xl backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        {/* Call Button — tel: para marcador nativo iOS & Android */}
        <a
          href={`tel:+${OFFICIAL_WHATSAPP_NUMBER}`}
          className="flex-1 py-3 px-3 rounded-xl bg-white/10 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 border border-white/10 hover:bg-white/20 transition-colors"
          aria-label="Ligar para a PEPEK GRUPO 24/7"
        >
          <Phone className="w-3.5 h-3.5 text-[#236199]" />
          <span>Ligar 24/7</span>
        </a>

        {/* Booking Button */}
        <button
          type="button"
          onClick={scrollToBooking}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#FEC228] px-3 py-3 text-[11px] font-bold text-[#09172C] shadow-md transition-colors hover:bg-[#FFD45F]"
          aria-label="Solicitar reserva de viatura"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Reservar</span>
        </button>

        {/* WhatsApp — wa.me deep link (abre app nativa, não web) */}
        <a
          href={generateQuickWhatsAppUrl('Atendimento Mobile')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 rounded-xl bg-[#236199] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md hover:bg-[#236199] transition-colors"
          aria-label="Contactar via WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
