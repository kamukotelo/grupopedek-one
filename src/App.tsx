import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileQuickBar } from './components/layout/MobileQuickBar';
import { PaymentReturnBanner } from './components/portal/PaymentReturnBanner';
import { SeoGlobal } from './components/layout/SeoGlobal';
import { LANDING_LINKS } from './data/seoLandingLinks';
import { getPrerenderedMain } from './lib/prerenderedMain';
const ChatBot = lazy(() => import('./components/ui/ChatBot').then(module => ({ default: module.ChatBot })));
const ClientPortalModal = lazy(() => import('./components/portal/ClientPortalModal').then(module => ({ default: module.ClientPortalModal })));

// Pages (each has its own Helmet title, meta description, canonical, schema.org)
const PageHome = lazy(() => import('./pages/PageHome').then(module => ({ default: module.PageHome })));
const PageQuemSomos = lazy(() => import('./pages/PageQuemSomos').then(module => ({ default: module.PageQuemSomos })));
const PageServicos = lazy(() => import('./pages/PageServicos').then(module => ({ default: module.PageServicos })));
const PageFrota = lazy(() => import('./pages/PageFrota').then(module => ({ default: module.PageFrota })));
const PageClientes = lazy(() => import('./pages/PageClientes').then(module => ({ default: module.PageClientes })));
const PageReservar = lazy(() => import('./pages/PageReservar').then(module => ({ default: module.PageReservar })));
const PageContactos = lazy(() => import('./pages/PageContactos').then(module => ({ default: module.PageContactos })));
const PageRotas = lazy(() => import('./pages/PageRotas').then(module => ({ default: module.PageRotas })));
const PageBlog = lazy(() => import('./pages/PageBlog').then(module => ({ default: module.PageBlog })));
const PagePainel = lazy(() => import('./pages/PagePainel').then(module => ({ default: module.PagePainel })));
const PagePrivacidade = lazy(() => import('./pages/PagePrivacidade').then(module => ({ default: module.PagePrivacidade })));
const PageLanding = lazy(() => import('./pages/PageLanding').then(module => ({ default: module.PageLanding })));
const PageVehicle = lazy(() => import('./pages/PageVehicle').then(module => ({ default: module.PageVehicle })));
const PageNotFound = lazy(() => import('./pages/PageNotFound').then(module => ({ default: module.PageNotFound })));

import './i18n';

// O portal (≈70 KB) só é descarregado quando o cliente o abre.
const ClientPortalWhenOpen: React.FC = () => {
  const { isPortalOpen } = useAuth();
  if (!isPortalOpen) return null;
  return <Suspense fallback={null}><ClientPortalModal /></Suspense>;
};

// Enquanto o código da página carrega, mantém visível o HTML pré-renderizado
// dessa rota (quando existe) em vez de um ecrã vazio.
const RouteFallback: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const html = getPrerenderedMain(pathname, i18n.resolvedLanguage ?? 'pt');
  if (html) return <div dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className="min-h-screen bg-[#001E4A]" aria-label={t('common.loadingPage')} />;
};

// Ao mudar de página, começa no topo (excepto links para uma secção com #).
const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
};

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('SUV Executiva — Land Cruiser Prado / LC300');

  return (
    <HelmetProvider>
      <AuthProvider>
        {/* hreflang, Open Graph e Twitter comuns a todas as páginas */}
        <SeoGlobal />
        <ScrollToTopOnNavigate />

        {/* Lightweight splash screen */}
        <SplashScreen />

        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#236199] selection:text-white pb-20 lg:pb-0">
          {/* Sticky navigation header */}
          <Header />

          {/* Page router — real URLs, each with individual SEO metadata */}
          <main className="flex-1">
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Home — Hero + all sections + primary CTA */}
              <Route path="/" element={<PageHome onSelectVehicle={setSelectedVehicle} />} />

              {/* Institutional pages — individually indexable by Google */}
              <Route path="/quem-somos" element={<PageQuemSomos />} />
              <Route path="/servicos" element={<PageServicos />} />
              <Route path="/frota" element={<PageFrota onSelectVehicle={setSelectedVehicle} />} />
              <Route path="/clientes" element={<PageClientes />} />
              <Route path="/reservar" element={<PageReservar />} />
              <Route path="/contactos" element={<PageContactos />} />
              <Route path="/rotas" element={<PageRotas />} />
              <Route path="/blogue" element={<PageBlog />} />

              {/* Management panel — authenticated only, noindex, hidden from public nav */}
              <Route path="/painel" element={<PagePainel />} />
              <Route path="/privacidade" element={<PagePrivacidade />} />

              {/* Páginas de destino SEO (aluguer em Luanda, transfer aeroporto, …) */}
              {LANDING_LINKS.map(({ slug }) => (
                <Route key={slug} path={`/${slug}`} element={<PageLanding slug={slug} />} />
              ))}

              {/* Uma página por viatura do catálogo (/aluguer/toyota-prado, …) */}
              <Route path="/aluguer/:slug" element={<PageVehicle />} />

              {/* 404 fallback */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            </Suspense>
          </main>

          {/* Corporate footer */}
          <Footer />

          {/* AI Executive Concierge — floating, context-aware */}
          <Suspense fallback={null}><ChatBot /></Suspense>

          {/* Mobile quick action bar (safe-area aware) */}
          <MobileQuickBar />

          {/* Global portal — opens from any page via Header or ChatBot */}
          <ClientPortalWhenOpen />

          {/* Confirms payments when the browser returns from an external checkout */}
          <PaymentReturnBanner />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
