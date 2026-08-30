import React, { lazy, Suspense, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileQuickBar } from './components/layout/MobileQuickBar';
import { PaymentReturnBanner } from './components/portal/PaymentReturnBanner';
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
const PagePainel = lazy(() => import('./pages/PagePainel').then(module => ({ default: module.PagePainel })));
const PagePrivacidade = lazy(() => import('./pages/PagePrivacidade').then(module => ({ default: module.PagePrivacidade })));
const PageNotFound = lazy(() => import('./pages/PageNotFound').then(module => ({ default: module.PageNotFound })));

import './i18n';

export const App: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('SUV Executiva — Land Cruiser Prado / LC300');

  return (
    <HelmetProvider>
      <AuthProvider>
        {/* Lightweight splash screen */}
        <SplashScreen />

        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#236199] selection:text-white pb-14 lg:pb-0">
          {/* Sticky navigation header */}
          <Header />

          {/* Page router — real URLs, each with individual SEO metadata */}
          <main className="flex-1">
            <Suspense fallback={<div className="min-h-screen bg-[#0C3D73]" aria-label="A carregar página" />}>
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

              {/* Management panel — authenticated only, noindex, hidden from public nav */}
              <Route path="/painel" element={<PagePainel />} />
              <Route path="/privacidade" element={<PagePrivacidade />} />

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
          <Suspense fallback={null}><ClientPortalModal /></Suspense>

          {/* Confirms payments when the browser returns from an external checkout */}
          <PaymentReturnBanner />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
