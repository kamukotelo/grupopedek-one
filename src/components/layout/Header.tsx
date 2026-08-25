import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronDown, ChevronRight, Menu, Phone, UserRound, X } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { setIsPortalOpen } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMobileMenuOpen(false), [location]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMobileMenuOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/quem-somos', label: t('nav.about') },
    { to: '/servicos', label: t('nav.services') },
    { to: '/frota', label: t('nav.fleet') },
    { to: '/clientes', label: t('nav.corporate'), dropdown: true },
    { to: '/rotas', label: t('nav.routes') },
    { to: '/contactos', label: t('nav.contact') },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#09172C]/95 text-white shadow-[0_10px_30px_rgba(4,13,30,.2)] backdrop-blur-xl">
      <div className="container-pepek flex h-[76px] items-center gap-5 lg:h-[84px]">
        <Link to="/" className="shrink-0" aria-label="PEPEK Grupo — início" data-header-logo>
          <img src="/logo.png" alt="PEPEK Grupo Rent-a-Car Angola" className="h-11 w-auto object-contain lg:h-14" />
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Navegação principal">
          {navLinks.map(({ to, label, dropdown }) => {
            const active = location.pathname === to;
            return <Link key={to} to={to} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[.04em] transition ${active ? 'bg-white/10 text-[#FEC228]' : 'text-white/75 hover:bg-white/5 hover:text-white'}`}>{label}{dropdown && <ChevronDown className="h-3.5 w-3.5" />}</Link>;
          })}
        </nav>
        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          <a href="tel:+244923000072" className="flex h-11 items-center gap-2 rounded-lg border border-[#FEC228] px-3 text-xs font-bold text-white transition hover:bg-[#FEC228]/10"><Phone className="h-4 w-4 text-[#FEC228]" /> +244 923 000 072</a>
          <button type="button" onClick={() => setIsPortalOpen(true)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-white/80 hover:border-[#FEC228] hover:text-[#FEC228]" aria-label={t('nav.clientArea')}><UserRound className="h-[18px] w-[18px]" /></button>
          <LanguageSwitcher variant="light" />
          <button type="button" onClick={() => navigate('/reservar')} className="flex h-11 items-center gap-2 rounded-lg bg-[#FEC228] px-4 text-xs font-extrabold uppercase text-[#09172C] shadow-[0_8px_22px_rgba(254,194,40,.2)] transition hover:bg-[#FFD45F]"><CalendarDays className="h-4 w-4" /> {t('nav.bookNow')} <ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <LanguageSwitcher variant="light" />
          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 bg-white/5" aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto bg-[#09172C] px-5 py-6 lg:hidden">
          <nav className="space-y-1" aria-label="Navegação móvel">{navLinks.map(({ to, label }) => <Link key={to} to={to} className="flex items-center justify-between rounded-lg border-b border-white/8 px-3 py-4 text-sm font-semibold text-white/85">{label}<ChevronRight className="h-4 w-4 text-[#FEC228]" /></Link>)}</nav>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setMobileMenuOpen(false); setIsPortalOpen(true); }} className="flex min-h-14 items-center justify-center gap-2 rounded-lg border border-white/15 font-bold"><UserRound className="h-4 w-4 text-[#FEC228]" />{t('nav.clientArea')}</button>
            <button type="button" onClick={() => navigate('/reservar')} className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#FEC228] font-extrabold text-[#09172C]"><CalendarDays className="h-4 w-4" />{t('nav.bookNow')}</button>
          </div>
          <a href="tel:+244923000072" className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-lg border border-[#FEC228] text-sm font-bold"><Phone className="h-4 w-4 text-[#FEC228]" />+244 923 000 072</a>
        </div>
      )}
    </header>
  );
};
