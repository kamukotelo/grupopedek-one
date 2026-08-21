import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, Menu, X, MapPin, Mail, User, Calendar } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ClientAreaModal } from '../ui/ClientAreaModal';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#inicio', label: 'Home' },
    { href: '#sobre', label: 'Quem Somos' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#frota', label: 'Frota' },
    { href: '#clientes', label: 'Clientes' },
    { href: '#contactos', label: 'Contactos' },
  ];

  const scrollToBooking = () => {
    const el = document.getElementById('reserva');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Top Utility Bar */}
        <div className={`hidden lg:block bg-[#030D1F] text-gray-300 text-[11px] font-medium border-b border-white/5 py-2 transition-all ${
          isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden border-none' : 'opacity-100'
        }`}>
          <div className="container-pepek flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-[#0B45D8]" />
                <span>Talatona, Rua Reino do Bailundo, Luanda — Angola</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Mail className="w-3.5 h-3.5 text-[#0B45D8]" />
                <a href="mailto:geral@pepekgrupo.com" className="hover:text-white transition-colors">
                  geral@pepekgrupo.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#0B45D8]" />
                <span className="text-gray-400">Central 24/7:</span>
                <a href="tel:+244923719090" className="text-white font-bold hover:text-[#0B45D8] transition-colors">
                  +244 923 719 090
                </a>
                <span className="text-gray-600">/</span>
                <a href="tel:+244923000010" className="text-white font-bold hover:text-[#0B45D8] transition-colors">
                  923 000 010
                </a>
              </div>

              {/* Login / Client Area Trigger */}
              <button
                type="button"
                onClick={() => setClientModalOpen(true)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white font-bold px-3 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#0B45D8] hover:border-[#0B45D8] transition-all cursor-pointer"
              >
                <User className="w-3 h-3 text-[#0B45D8]" />
                <span>Área do Cliente</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? 'nav-scrolled py-3.5'
              : 'bg-gradient-to-b from-[#06142F]/95 via-[#06142F]/80 to-transparent py-5'
          }`}
        >
          <div className="container-pepek flex items-center justify-between">
            {/* Official Logo */}
            <a href="#inicio" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.03]">
              <Logo height={52} variant="light" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-gray-200 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0B45D8] hover:after:w-full after:transition-all after:duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Action Controls & CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher variant="light" />

              {/* Area do Cliente button */}
              <button
                type="button"
                onClick={() => setClientModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#0B45D8]" />
                <span>Minha Conta</span>
              </button>

              {/* Discreet, Professional Booking Button */}
              <button
                type="button"
                onClick={scrollToBooking}
                className="btn-primary text-xs font-bold px-5 py-3 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Solicitar Reserva</span>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex lg:hidden items-center gap-2.5">
              <button
                type="button"
                onClick={() => setClientModalOpen(true)}
                className="p-2 rounded-xl bg-white/10 text-white text-xs font-bold flex items-center gap-1 border border-white/15 cursor-pointer"
                title="Área do Cliente"
              >
                <User className="w-4 h-4 text-[#0B45D8]" />
              </button>
              <LanguageSwitcher variant="light" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] bg-[#06142F]/98 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between border-t border-white/10 overflow-y-auto">
            <nav className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-gray-100 hover:text-[#0B45D8] py-3 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-gray-500">➔</span>
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setClientModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/15 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#0B45D8]" />
                <span>Aceder à Minha Conta / Área do Cliente</span>
              </button>

              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollToBooking(); }}
                className="btn-primary w-full justify-center text-sm py-3.5 font-bold"
              >
                <Calendar className="w-4 h-4" />
                <span>Solicitar Reserva Online</span>
              </button>

              <div className="text-xs text-gray-300 space-y-1.5 pt-2">
                <p className="font-semibold text-white">PEPEK GRUPO RENT-A-CAR</p>
                <p className="text-gray-400">Talatona, Rua Reino do Bailundo, Luanda</p>
                <p className="text-[#0B45D8] font-bold">+244 923 719 090 / 923 000 010</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Client Area Login Modal */}
      <ClientAreaModal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
      />
    </>
  );
};
