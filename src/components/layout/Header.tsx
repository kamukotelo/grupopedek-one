import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone,
  Menu,
  X,
  MapPin,
  Mail,
  User,
  Calendar,
  Shield,
  Radio,
  Building2,
  Car,
  FileText,
  Compass,
  Briefcase,
  Users,
  Award,
  Sparkles,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, setIsPortalOpen } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Bottom tier navigation items (Dark Navy Bar - with icon beside label)
  const navLinks = [
    { to: '/', label: 'Início', icon: <Building2 className="w-3.5 h-3.5" /> },
    { to: '/quem-somos', label: 'Quem Somos', icon: <Award className="w-3.5 h-3.5" /> },
    { to: '/servicos', label: 'Serviços', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { to: '/frota', label: 'Frota Oficial (47)', icon: <Car className="w-3.5 h-3.5" /> },
    { to: '/clientes', label: 'Clientes & Protocolo', icon: <Users className="w-3.5 h-3.5" /> },
    { to: '/#rotas', label: 'Simulador de Rotas', icon: <Compass className="w-3.5 h-3.5" />, isSection: true, sectionId: 'rotas' },
    { to: '/#cobertura', label: '18 Províncias', icon: <MapPin className="w-3.5 h-3.5" />, isSection: true, sectionId: 'cobertura' },
    { to: '/contactos', label: 'Contactos', icon: <Phone className="w-3.5 h-3.5" /> }
  ];

  // Top tier action items (White Bar - Icon on top, text underneath like FAF structure)
  const topActions = [
    {
      id: 'apoio',
      label: 'Apoio 24/7',
      icon: <Shield className="w-5 h-5 stroke-[1.75]" />,
      action: () => window.open(`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/\+/g, '')}?text=Ol%C3%A1%2C%20solicito%20apoio%20da%20Central%2024%2F7%20PEPEK`, '_blank')
    },
    {
      id: 'central',
      label: 'Em Direto',
      icon: <Radio className="w-5 h-5 stroke-[1.75] text-[#D2A820] animate-pulse" />,
      action: () => scrollToSection('rotas')
    },
    {
      id: 'reserva',
      label: 'Reserva Online',
      icon: <Ticket className="w-5 h-5 stroke-[1.75]" />,
      action: () => scrollToSection('reserva')
    },
    {
      id: 'corporate',
      label: 'Corporate',
      icon: <Building2 className="w-5 h-5 stroke-[1.75]" />,
      action: () => navigate('/clientes')
    },
    {
      id: 'frota',
      label: 'Frota VIP',
      icon: <Car className="w-5 h-5 stroke-[1.75]" />,
      action: () => navigate('/frota')
    },
    {
      id: 'portal',
      label: currentUser ? currentUser.name.split(' ')[0] : 'Área Cliente',
      icon: <User className="w-5 h-5 stroke-[1.75]" />,
      action: () => setIsPortalOpen(true),
      highlight: true
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md">
      {/* ═══════════════════════════════════════════════════════
          TIER 1: UPPER WHITE BAR (FAF STYLE)
          - Left: Logo + Stacked Text (PEPEK GRUPO RENT-A-CAR)
          - Right: Vertical Action Items (Icon Top, Label Bottom)
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5 transition-all duration-300">
        <div className="container-pepek flex items-center justify-between gap-4">
          {/* LEFT: Official Identity (Logo + Bold Stacked Typography) */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group transition-transform duration-200 hover:scale-[1.01] shrink-0"
            aria-label="PEPEK GRUPO — Página Inicial"
          >
            <div className="h-12 sm:h-14 flex items-center">
              <img
                src="/logo.png"
                alt="PEPEK GRUPO"
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="flex flex-col justify-center leading-none border-l-2 border-[#D2A820] pl-3">
              <span className="text-[15px] sm:text-[17px] font-black tracking-tight text-[#07133F] uppercase font-sans">
                PEPEK GRUPO
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#D2A820] uppercase mt-0.5">
                RENT-A-CAR ANGOLA
              </span>
              <span className="text-[8.5px] font-bold tracking-wider text-[#697080] uppercase hidden sm:block mt-0.5">
                Mobilidade Executiva & Protocolar
              </span>
            </div>
          </Link>

          {/* RIGHT (Desktop): Vertical Stack Actions (FAF Structure) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div className="flex items-center gap-4 xl:gap-6">
              {topActions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className={`flex flex-col items-center justify-center gap-1 group py-1 px-2 rounded-xl transition-all cursor-pointer ${
                    item.highlight
                      ? 'text-[#07133F] hover:text-[#D2A820]'
                      : 'text-[#4A5568] hover:text-[#07133F]'
                  }`}
                >
                  <div className="transition-transform group-hover:-translate-y-0.5 text-[#07133F] group-hover:text-[#D2A820]">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-center leading-none">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-[1px] bg-[#D9DEE7]" />

            {/* Language Switcher */}
            <LanguageSwitcher variant="dark" />
          </div>

          {/* RIGHT (Mobile): Compact Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPortalOpen(true)}
              className="p-2 rounded-xl bg-[#F3F5F8] text-[#07133F] border border-[#D9DEE7] hover:bg-gray-100 transition-colors"
              aria-label="Área do Cliente"
            >
              <User className="w-5 h-5 text-[#07133F]" />
            </button>

            <LanguageSwitcher variant="dark" />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#07133F] text-white hover:bg-[#020A2A] transition-colors focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TIER 2: LOWER DARK NAVY BAR (FAF STYLE)
          - Deep Blue/Navy Background (#020A2A / #07133F)
          - Icon on the left + Uppercase Nav Links
         ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:block bg-[#020A2A] border-t border-white/10 text-white py-2 px-4">
        <div className="container-pepek flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-3.5 xl:gap-5 2xl:gap-7 flex-nowrap shrink-0" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const isActive = !link.isSection && location.pathname === link.to;

              if (link.isSection) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => scrollToSection(link.sectionId!)}
                    className="flex items-center gap-1.5 text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-extrabold uppercase tracking-wider text-gray-300 hover:text-[#D2A820] py-1 transition-colors cursor-pointer group shrink-0 whitespace-nowrap"
                  >
                    <span className="text-[#D2A820] group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-extrabold uppercase tracking-wider py-1 transition-all relative group shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'text-[#D2A820] font-black'
                      : 'text-gray-200 hover:text-[#D2A820]'
                  }`}
                >
                  <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-[#D2A820]' : 'text-gray-400 group-hover:text-[#D2A820]'}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#D2A820] rounded-full shadow-[0_0_8px_rgba(210,168,32,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Direct Hotline Badge */}
          <div className="hidden 2xl:flex items-center gap-2 text-[11px] font-bold text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 shrink-0 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Talatona:</span>
            <a href="tel:+244923719090" className="text-[#D2A820] hover:underline font-black">
              +244 923 719 090
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE DRAWER
         ═══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          ref={drawerRef}
          className="lg:hidden fixed inset-0 top-[70px] bg-[#020A2A]/98 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between border-t border-white/10 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          {/* Top Quick Actions Grid in Mobile */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 pb-6 border-b border-white/10">
            {topActions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  item.action();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <div className="text-[#D2A820] mb-1">
                  {item.icon}
                </div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-center text-gray-200">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
            {navLinks.map((link) => {
              if (link.isSection) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToSection(link.sectionId!);
                    }}
                    className="flex items-center justify-between text-sm font-bold text-gray-200 hover:text-[#D2A820] py-3 px-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#D2A820]">{link.icon}</span>
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                );
              }

              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-sm font-bold py-3 px-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#D2A820] text-[#020A2A]'
                      : 'text-gray-200 hover:bg-white/5 hover:text-[#D2A820]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#020A2A]' : 'text-[#D2A820]'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#020A2A]' : 'text-gray-500'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('reserva');
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-[#D2A820] hover:bg-[#E1BB38] text-[#020A2A] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Ticket className="w-4 h-4" />
              <span>Solicitar Reserva Imediata</span>
            </button>

            <div className="text-center text-xs text-gray-400 pt-2 space-y-1">
              <p className="font-bold text-white uppercase tracking-wider">PEPEK GRUPO RENT-A-CAR</p>
              <p className="text-[11px]">Talatona, Rua Reino do Bailundo · Luanda</p>
              <p className="text-[#D2A820] font-bold">+244 923 719 090 / 923 000 010</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
