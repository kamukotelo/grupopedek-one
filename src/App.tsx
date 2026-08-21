import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ChatBot } from './components/ui/ChatBot';
import { MobileQuickBar } from './components/layout/MobileQuickBar';
import { ClientPortalModal } from './components/portal/ClientPortalModal';

// Pages (each has its own Helmet title, meta description, canonical, schema.org)
import { PageHome } from './pages/PageHome';
import { PageQuemSomos } from './pages/PageQuemSomos';
import { PageServicos } from './pages/PageServicos';
import { PageFrota } from './pages/PageFrota';
import { PageClientes } from './pages/PageClientes';
import { PageReservar } from './pages/PageReservar';
import { PageContactos } from './pages/PageContactos';
import { PagePainel } from './pages/PagePainel';

import './i18n';

export const App: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('SUV Executiva — Land Cruiser Prado / LC300');

  return (
    <HelmetProvider>
      <AuthProvider>
        {/* Lightweight splash screen */}
        <SplashScreen />

        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#0B45D8] selection:text-white pb-14 lg:pb-0">
          {/* Sticky navigation header */}
          <Header />

          {/* Page router — real URLs, each with individual SEO metadata */}
          <main className="flex-1">
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

              {/* Management panel — authenticated only, noindex, hidden from public nav */}
              <Route path="/painel" element={<PagePainel />} />

              {/* 404 fallback */}
              <Route path="*" element={<PageHome onSelectVehicle={setSelectedVehicle} />} />
            </Routes>
          </main>

          {/* Corporate footer */}
          <Footer />

          {/* AI Executive Concierge — floating, context-aware */}
          <ChatBot />

          {/* Mobile quick action bar (safe-area aware) */}
          <MobileQuickBar />

          {/* Global portal — opens from any page via Header or ChatBot */}
          <ClientPortalModal />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
