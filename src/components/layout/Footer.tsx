import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageSquare, ArrowUp, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { Link } from 'react-router-dom';
import { LANDING_LINKS } from '../../data/seoLandingLinks';

const POPULAR_TITLE = { pt: 'Serviços mais procurados', en: 'Popular services', fr: 'Services les plus demandés' } as const;
const FOOTER_LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
] as const;

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (['en', 'fr'].includes((i18n.resolvedLanguage ?? '').slice(0, 2)) ? (i18n.resolvedLanguage ?? '').slice(0, 2) : 'pt') as 'pt' | 'en' | 'fr';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/15 bg-[#001E4A] pb-14 pt-16 text-white">
      <div className="container-pepek">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14 mb-16">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block mb-1">
              <Logo height={48} variant="light" />
            </Link>
            <p className="text-base font-bold text-white">
              {t('footer.tagline')}
            </p>

            {/* Social Links with crisp vector SVGs */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/pepekgruporentacar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#174B86] flex items-center justify-center text-white transition-colors"
                aria-label={t('footer.socialAria', { network: 'Instagram' })}
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
                aria-label={t('footer.socialAria', { network: 'Facebook' })}
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
                aria-label={t('footer.socialAria', { network: 'LinkedIn' })}
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
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#174B86] flex items-center justify-center text-white transition-colors"
                aria-label={t('footer.socialAria', { network: 'TikTok' })}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/65 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#FEC228]" />
              <span>{t('footer.badge')}</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t('footer.servicesTitle')}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li><Link to="/servicos" className="hover:text-white transition-colors">{t('footer.serviceLuxury')}</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">{t('footer.serviceExecutive')}</Link></li>
              <li><Link to="/rotas" className="hover:text-white transition-colors">{t('footer.serviceTransfer')}</Link></li>
              <li><Link to="/clientes" className="hover:text-white transition-colors">{t('footer.serviceCorporate')}</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">{t('footer.serviceFleet')}</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">{t('footer.serviceEvents')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t('footer.navTitle')}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li><Link to="/" className="hover:text-white transition-colors">{t('footer.navHome')}</Link></li>
              <li><Link to="/quem-somos" className="hover:text-white transition-colors">{t('footer.navAbout')}</Link></li>
              <li><Link to="/frota" className="hover:text-white transition-colors">{t('footer.navFleet')}</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">{t('footer.navServices')}</Link></li>
              <li><Link to="/clientes" className="hover:text-white transition-colors">{t('footer.navClients')}</Link></li>
              <li><Link to="/blogue" className="hover:text-white transition-colors">{t('footer.navBlog')}</Link></li>
              <li><Link to="/contactos" className="hover:text-white transition-colors">{t('footer.navContacts')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Central de Atendimento & Morada */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t('footer.opsTitle')}
            </h4>
            <ul className="space-y-3 text-xs text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FEC228] shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
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
                  {t('footer.whatsapp')}
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

        {/* Links internos para as páginas de destino SEO */}
        <nav aria-label={POPULAR_TITLE[lang]} className="mb-12 border-t border-white/10 pt-8">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">{POPULAR_TITLE[lang]}</h4>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 text-xs text-white/65">
            {LANDING_LINKS.map(({ slug, label }) => (
              <li key={slug}>
                <Link to={`/${slug}`} className="hover:text-[#FEC228]">{label[lang]}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          
          <div className="flex items-center gap-6">
            {/* Links de idioma no HTML (com hreflang) para motores de busca e visitantes estrangeiros. */}
            <nav aria-label={t('common.selectLanguage')} className="flex items-center gap-3">
              {FOOTER_LANGUAGES.map(({ code, label }) => (
                <a
                  key={code}
                  href={`?lng=${code}`}
                  hrefLang={code}
                  lang={code}
                  onClick={(event) => { event.preventDefault(); i18n.changeLanguage(code); }}
                  aria-current={lang === code ? 'true' : undefined}
                  className={lang === code ? 'font-bold text-white' : 'text-white/65 hover:text-white transition-colors'}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Link to="/privacidade" className="text-white/65 hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/65 hover:text-white transition-colors cursor-pointer"
              aria-label={t('footer.backToTop')}
            >
              <span>{t('footer.backToTop')}</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
