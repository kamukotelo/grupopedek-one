import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, MapPin, Mail, User, Calendar } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, setIsPortalOpen } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Escape key closes drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/quem-somos', label: 'Quem somos' },
    { to: '/servicos', label: 'Serviços' },
    { to: '/frota', label: 'Frota' },
    { to: '/clientes', label: 'Clientes' },
    { to: '/contactos', label: 'Contactos' }
  ];

  const scrollToBooking = () => {
    const el = document.getElementById('reserva');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* ═══════════════════════════════════════════════════════
          1. TOP UTILITY BAR (Strictly Single-Line Linear & Balanced)
         ═══════════════════════════════════════════════════════ */}
      <div
        className={`hidden lg:flex items-center h-9 bg-[#020917] text-gray-300 text-[11px] border-b border-white/5 transition-all duration-300 overflow-hidden ${
          isScrolled ? 'h-0 opacity-0 border-none' : 'opacity-100'
        }`}
      >
        <div className="container-pepek w-full flex items-center justify-between gap-4">
          {/* Left Side: Address & Email (Single Line, No Wrap) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span>Talatona, Luanda — Angola</span>
            </div>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Mail className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <a href="mailto:geral@pepekgrupo.com" className="hover:text-white transition-colors">
                geral@pepekgrupo.com
              </a>
            </div>
          </div>

          {/* Right Side: Phone & Client Portal (Single Line, No Wrap) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="w-3.5 h-3.5 text-[#0B45D8] shrink-0" />
              <span className="text-gray-400">Central 24/7:</span>
              <a href="tel:+244923719090" className="text-white font-bold hover:text-[#0B45D8] transition-colors">
                +244 923 719 090
              </a>
              <span className="text-gray-600">/</span>
              <a href="tel:+244923000010" className="text-white font-bold hover:text-[#0B45D8] transition-colors">
                923 000 010
              </a>
            </div>

            <span className="text-gray-700">|</span>

            {/* Client Portal Quick Button */}
            <button
              type="button"
              onClick={() => setIsPortalOpen(true)}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-[#0B45D8] hover:border-[#0B45D8] transition-all cursor-pointer text-[10px]"
            >
              <User className="w-3 h-3 text-[#0B45D8] group-hover:text-white" />
              <span>{currentUser ? `${currentUser.name.split(' ')[0]}` : 'Área do Cliente'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2. MAIN NAVBAR (Deep Navy, Prominent Logo, Clean Menu)
         ═══════════════════════════════════════════════════════ */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#030D1F]/98 backdrop-blur-xl shadow-2xl py-3 border-b border-white/10'
            : 'bg-[#040E24]/95 backdrop-blur-md py-4 border-b border-white/5'
        }`}
      >
        <div className="container-pepek flex items-center justify-between gap-4">
          {/* Prominent White Logo (Enlarged and Sharp) */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02] shrink-0"
            aria-label="PEPEK GRUPO — Página Inicial"
          >
            <Logo height={64} variant="light" />
          </Link>

          {/* Desktop Navigation Links — Centered & Elegant */}
          <nav className="hidden xl:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[15px] font-medium tracking-wide transition-colors relative py-1 ${
                  location.pathname === link.to
                    ? 'text-amber-400 font-semibold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-amber-400'
                    : 'text-gray-200 hover:text-white after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Cluster: Language Switcher + Client Portal + Booking Button */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher variant="light" />

            {/* Login / Client Portal Button */}
            <button
              type="button"
              onClick={() => setIsPortalOpen(true)}
              className="text-[14px] font-medium text-gray-200 hover:text-white px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-[#0B45D8]" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Login'}</span>
            </button>

            {/* Primary Action: Solicitar Reserva */}
            <button
              type="button"
              onClick={scrollToBooking}
              className="px-6 py-2.5 rounded-xl bg-[#0B45D8] hover:bg-[#1A58F5] text-white font-bold text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:shadow-blue-500/25"
            >
              <Calendar className="w-4 h-4" />
              <span>Solicitar Reserva</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher variant="light" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          ref={drawerRef}
          className="lg:hidden fixed inset-0 top-[76px] bg-[#030D1F]/98 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between border-t border-white/10 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <nav className="flex flex-col gap-3 pt-2" aria-label="Navegação mobile">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-3 border-b border-white/5 flex items-center justify-between ${
                  location.pathname === link.to ? 'text-amber-400' : 'text-gray-100 hover:text-amber-400'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs text-gray-500">➔</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPortalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/15 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-[#0B45D8]" />
              <span>{currentUser ? `Painel — ${currentUser.name.split(' ')[0]}` : 'Área do Cliente / Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToBooking();
              }}
              className="btn-primary w-full justify-center text-sm py-3.5 font-bold"
            >
              <Calendar className="w-4 h-4" />
              <span>Solicitar Reserva Online</span>
            </button>

            <div className="text-xs text-gray-300 space-y-1 pt-2">
              <p className="font-semibold text-white">PEPEK GRUPO RENT-A-CAR</p>
              <p className="text-gray-400">Talatona, Rua Reino do Bailundo, Luanda</p>
              <p className="text-[#0B45D8] font-bold">+244 923 719 090 / 923 000 010</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
