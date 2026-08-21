import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageSquare, ArrowUp, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030D1F] text-white pt-16 pb-12 border-t border-white/10 relative">
      <div className="container-pepek">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#inicio" className="inline-block mb-2">
              <Logo height={44} variant="light" />
            </a>
            <p className="text-sm font-semibold text-[#8899BB] italic">
              "Movemos quem move Angola."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Sociedade de aluguer de viaturas e mobilidade executiva fundada em 2014. Parceira de referência para embaixadas, ministérios e empresas líderes em todo o território nacional angolano.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
              <span>NIF Registado · Faturação AGT em Moeda Nacional (AOA)</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Serviços
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#servicos" className="hover:text-white transition-colors">Rent-a-Car Premium</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Mobilidade Executiva</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Transfers Aeroporto</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Soluções Corporativas</a></li>
              <li><a href="#frota" className="hover:text-white transition-colors">Delegações & Protocolo</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#frota" className="hover:text-white transition-colors">A Nossa Frota</a></li>
              <li><a href="#clientes" className="hover:text-white transition-colors">Clientes Institucionais</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">História & Valores</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Central Operacional
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
                <a href={`tel:+${OFFICIAL_WHATSAPP_NUMBER}`} className="hover:text-white">
                  +244 923 719 090
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a href={generateQuickWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp 24/7
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
                <a href="mailto:geral@pepekgrupo.com" className="hover:text-white">
                  geral@pepekgrupo.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0B45D8] shrink-0 mt-0.5" />
                <span>Luanda · Huambo · Bengo · Angola</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2014 – {new Date().getFullYear()} PEPEK GRUPO RENT-A-CAR. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              aria-label="Voltar ao topo"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
