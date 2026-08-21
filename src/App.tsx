import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { BookingWidget } from './components/sections/BookingWidget';
import { InstitutionalClients } from './components/sections/InstitutionalClients';
import { Services } from './components/sections/Services';
import { Fleet } from './components/sections/Fleet';
import { Process } from './components/sections/Process';
import { About } from './components/sections/About';
import { Capabilities } from './components/sections/Capabilities';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import { ChatBot } from './components/ui/ChatBot';
import './i18n';

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#0B45D8] selection:text-white">
        {/* Sticky Header Navigation */}
        <Header />

        {/* Main Application Sections */}
        <main className="flex-1">
          {/* 1. Hero First Screen */}
          <Hero />

          {/* 2. Smart Booking & Dynamic WhatsApp Engine */}
          <BookingWidget />

          {/* 3. Institutional Clients Grid (Embassies, Gov, Sonangol, TAAG, BFA, etc.) */}
          <InstitutionalClients />

          {/* 4. Core Services (4 Cards) */}
          <Services />

          {/* 5. Fleet Showcase (SUVs, 4x4, Vans, Protocol) */}
          <Fleet />

          {/* 6. Process 'Da Reserva à Chegada' (3 Steps) */}
          <Process />

          {/* 7. Corporate History & Core Values since 2014 */}
          <About />

          {/* 8. Operational Capabilities & 18 Provinces */}
          <Capabilities />

          {/* 9. Contact & 24/7 Operations Hub */}
          <Contact />
        </main>

        {/* Corporate Footer */}
        <Footer />

        {/* Floating AI Executive Assistant & WhatsApp Handoff */}
        <ChatBot />
      </div>
    </HelmetProvider>
  );
};

export default App;
