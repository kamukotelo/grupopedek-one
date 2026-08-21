import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, Menu, X, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#inicio', label: t('nav.home') },
    { href: '#servicos', label: t('nav.services') },
    { href: '#frota', label: t('nav.fleet') },
    { href: '#clientes', label: t('nav.clients') },
    { href: '#como-funciona', label: t('nav.process') },
    { href: '#sobre', label: t('nav.about') },
    { href: '#contactos', label: t('nav.contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-scrolled py-3' : 'bg-gradient-to-b from-[#06142F]/90 via-[#06142F]/60 to-transparent py-5'
      }`}
    >
      <div className="container-pepek flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]">
          <Logo height={42} variant="light" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-200 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0B45D8] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher variant="light" />

          {/* Quick Call */}
          <a
            href={`tel:+${OFFICIAL_WHATSAPP_NUMBER}`}
            className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors border border-white/10"
            title="Assistência 24/7"
          >
            <Phone className="w-3.5 h-3.5 text-[#0B45D8]" />
            <span>+244 923 719 090</span>
          </a>

          {/* WhatsApp Direct Booking Button */}
          <a
            href={generateQuickWhatsAppUrl('Reserva Executiva')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xs font-bold px-4 py-2.5 shadow-lg flex items-center gap-2"
          >
            <span className="pulse-ring w-2 h-2 rounded-full bg-white"></span>
            <MessageSquare className="w-4 h-4" />
            <span>{t('nav.bookNow')}</span>
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-3">
          <LanguageSwitcher variant="light" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] bg-[#06142F]/98 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between border-t border-white/10 overflow-y-auto">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-gray-100 hover:text-[#0B45D8] py-2.5 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-gray-500">➔</span>
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#0B45D8]" />
              <span>Frota Registada & Assegurada em Angola</span>
            </div>

            <a
              href={`tel:+${OFFICIAL_WHATSAPP_NUMBER}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/5 text-white font-medium text-sm border border-white/10"
            >
              <Phone className="w-4 h-4 text-[#0B45D8]" />
              <span>Ligar: +244 923 719 090</span>
            </a>

            <a
              href={generateQuickWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center text-sm py-3 font-bold"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('nav.bookNow')} (WhatsApp)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
