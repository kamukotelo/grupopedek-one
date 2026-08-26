import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  Building2,
  Briefcase,
  Car,
  ChevronRight,
  Compass,
  Menu,
  Phone,
  Ticket,
  User,
  Users,
  X,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, setIsPortalOpen } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMobileMenuOpen(false), [location]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const topActions = [
    {
      label: t('nav.bookNow'),
      icon: Ticket,
      action: () => navigate('/reservar'),
    },
    {
      label: t('nav.fleet'),
      icon: Car,
      action: () => navigate('/frota'),
    },
    {
      label: currentUser ? t('nav.myPanel') : t('nav.clientArea'),
      icon: User,
      action: () => setIsPortalOpen(true),
    },
  ];

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Building2 },
    { to: '/quem-somos', label: t('nav.about'), icon: Award },
    { to: '/servicos', label: t('nav.services'), icon: Briefcase },
    { to: '/frota', label: t('nav.fleet'), icon: Car },
    { to: '/clientes', label: t('nav.clients'), icon: Users },
    { to: '/rotas', label: t('nav.routes'), icon: Compass },
    { to: '/contactos', label: t('nav.contact'), icon: Phone },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_7px_25px_rgba(9,23,44,0.14)]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-pepek flex h-[76px] items-center justify-between gap-4 lg:h-[92px]">
          <Link to="/" className="flex h-14 w-[180px] min-w-0 items-center justify-center overflow-hidden rounded-lg bg-[#0C3D73] sm:w-[205px] lg:h-[72px] lg:w-[235px]" aria-label="PEPEK Grupo — início" data-header-logo>
            <img src="/logo-pepek-pdf.png" alt="PEPEK Grupo Rent-a-Car Angola" className="h-full w-full scale-[1.12] object-contain" />
          </Link>

          <div className="hidden items-stretch lg:flex">
            {topActions.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                className="group flex min-w-[112px] flex-col items-center justify-center gap-1.5 border-l border-slate-200 px-5 text-[#09172C] transition-colors hover:bg-[#F5F6F6] hover:text-[#E4AD28]"
              >
                <Icon className="h-5 w-5 stroke-[1.8] transition-transform group-hover:-translate-y-0.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.12em]">{label}</span>
              </button>
            ))}
            <div className="flex items-center border-l border-slate-200 pl-5">
              <LanguageSwitcher variant="dark" />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher variant="dark" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-lg bg-[#0C3D73] text-white"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden bg-[#0C3D73] text-white lg:block">
        <nav className="container-pepek flex h-12 items-stretch justify-center" aria-label="Navegação principal">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            const classes = `group flex flex-1 items-center justify-center gap-2 border-l border-white/10 px-3 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors last:border-r ${active ? 'bg-[#FEC228] text-[#0C3D73]' : 'text-white/90 hover:bg-white/10 hover:text-[#FEC228]'}`;
            return <Link key={label} to={to} className={classes}><Icon className="h-4 w-4 shrink-0" /><span className="whitespace-nowrap">{label}</span></Link>;
          })}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto bg-[#0C3D73] p-5 text-white lg:hidden">
          <div className="mb-5 grid grid-cols-3 gap-2 border-b border-white/10 pb-5">
            {topActions.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setMobileMenuOpen(false); action(); }}
                className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 text-center"
              >
                <Icon className="h-5 w-5 text-[#FEC228]" />
                <span className="text-[9px] font-extrabold uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>
          <nav className="space-y-1" aria-label="Navegação móvel">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const content = (
                <>
                  <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-[#FEC228]" />{label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </>
              );
              const className = "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-white/5";
              return <Link key={label} to={to} className={className}>{content}</Link>;
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
