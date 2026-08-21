import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const MobileQuickBar: React.FC = () => {
  const scrollToBooking = () => {
    const el = document.getElementById('reserva');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06142F]/95 backdrop-blur-xl border-t border-white/10 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl">
      {/* Call Button */}
      <a
        href={`tel:+${OFFICIAL_WHATSAPP_NUMBER}`}
        className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 border border-white/10 hover:bg-white/20 transition-colors"
      >
        <Phone className="w-3.5 h-3.5 text-[#0B45D8]" />
        <span>Ligar 24/7</span>
      </a>

      {/* Book Button */}
      <button
        type="button"
        onClick={scrollToBooking}
        className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B45D8] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md hover:bg-[#1A58F5] transition-colors cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Reservar</span>
      </button>

      {/* WhatsApp Button */}
      <a
        href={generateQuickWhatsAppUrl('Atendimento Mobile')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-600 transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};
