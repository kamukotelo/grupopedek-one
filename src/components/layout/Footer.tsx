import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageSquare, ArrowUp, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/15 bg-[#0C3D73] pb-14 pt-16 text-white">
      <div className="container-pepek">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14 mb-16">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block mb-1">
              <Logo height={48} variant="light" />
            </Link>
            <p className="text-base font-bold text-white/75 italic">
              "Movemos quem move Angola."
            </p>
            <p className="text-xs text-white/65 leading-relaxed max-w-md">
              A escolha perfeita para cada viagem. Sociedade de mobilidade executiva e rent a car de luxo fundada em 2014 em Luanda. Atendemos com distinção embaixadas, entidades de estado, multinacionais e particulares de alto padrão.
            </p>

            {/* Social Links with crisp vector SVGs */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/pepekgruporentacar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#174B86] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram da PEPEK GRUPO"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/ppkrentacarangola/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#174B86] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook da PEPEK GRUPO"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/pepek-grupo-rent-a-car/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#174B86] flex items-center justify-center text-white transition-colors"
                aria-label="LinkedIn da PEPEK GRUPO"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@pepek_rentacar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#174B86] flex items-center justify-center text-white transition-colors font-bold text-xs"
                aria-label="TikTok da PEPEK GRUPO"
              >
                TK
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/65 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#FEC228]" />
              <span>NIF Registado · Faturação AGT em Moeda Nacional (AOA) e Divisas</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Serviços VIP
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li><Link to="/servicos" className="hover:text-white transition-colors">Rent a Car de Luxo</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Apoio Executivo & Protocolo</Link></li>
              <li><Link to="/rotas" className="hover:text-white transition-colors">Transfers de Aeroporto</Link></li>
              <li><Link to="/clientes" className="hover:text-white transition-colors">Mobilidade Corporativa</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Eventos & Comitivas Oficiais</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link to="/frota" className="hover:text-white transition-colors">Frota de Luxo</Link></li>
              <li><Link to="/clientes" className="hover:text-white transition-colors">Clientes Institucionais</Link></li>
              <li><Link to="/contactos" className="hover:text-white transition-colors">Contactos Directos</Link></li>
            </ul>
          </div>

          {/* Col 4: Central de Atendimento & Morada */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Central Operacional
            </h4>
            <ul className="space-y-3 text-xs text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FEC228] shrink-0 mt-0.5" />
                <span>Talatona, Rua Reino do Bailundo, Luanda — Angola</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FEC228] shrink-0" />
                <div className="space-x-1">
                  <a href="tel:+244923719090" className="hover:text-white font-semibold">+244 923 719 090</a>
                  <span>/</span>
                  <a href="tel:+244923000010" className="hover:text-white font-semibold">923 000 010</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#FEC228] shrink-0" />
                <a href={generateQuickWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#FEC228] hover:text-white">
                  WhatsApp Oficial 24/7
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FEC228] shrink-0" />
                <a href="mailto:geral@pepekgrupo.com" className="hover:text-white">
                  geral@pepekgrupo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2014 – {new Date().getFullYear()} PEPEK GRUPO RENT-A-CAR. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/65 hover:text-white transition-colors cursor-pointer"
              aria-label="Voltar ao topo"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
