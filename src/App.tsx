import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { BookingWidget } from './components/sections/BookingWidget';
import { Services } from './components/sections/Services';
import { Fleet } from './components/sections/Fleet';
import { CorporatePortal } from './components/sections/CorporatePortal';
import { CoverageMap } from './components/sections/CoverageMap';
import { Process } from './components/sections/Process';
import { About } from './components/sections/About';
import { PaymentSecurity } from './components/sections/PaymentSecurity';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import { ChatBot } from './components/ui/ChatBot';
import { MobileQuickBar } from './components/layout/MobileQuickBar';
import { ClientPortalModal } from './components/portal/ClientPortalModal';
import './i18n';

export const App: React.FC = () => {
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<string>('SUV Executiva — Land Cruiser Prado / LC300');

  return (
    <HelmetProvider>
      <AuthProvider>
        {/* Lightweight, zero-lag luxury splash screen */}
        <SplashScreen />

        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#0B45D8] selection:text-white pb-14 lg:pb-0">
          {/* Sticky Header Navigation with Client Area */}
          <Header />

          {/* Main Application Flow */}
          <main className="flex-1">
            {/* Chapter 1: Hero & Embedded Top 5-by-5 Client Logos */}
            <Hero />

            {/* Chapter 2: Interactive Visual Simulator & Directorate Dossier Registration */}
            <BookingWidget initialVehicle={selectedVehicleForBooking} />

            {/* Chapter 3: Executive Services & Diplomatic Protocol */}
            <Services />

            {/* Chapter 4: Fleet Showcase with High-Res Technical Specs Modal */}
            <Fleet onSelectVehicle={(v) => setSelectedVehicleForBooking(v)} />

            {/* Chapter 5: Corporate & Diplomatic Portal */}
            <CorporatePortal />

            {/* Chapter 6: Operational Coverage Map (18 Provinces & Technical Bases) */}
            <CoverageMap />

            {/* Chapter 7: Operational Process 'Da Reserva ao Destino' */}
            <Process />

            {/* Chapter 8: Corporate History & Heritage since 2014 */}
            <About />

            {/* Chapter 9: AGT Compliance, Invoicing & Payment Security */}
            <PaymentSecurity />

            {/* Chapter 10: Frequently Asked Questions (FAQ) */}
            <FAQ />

            {/* Chapter 11: 24/7 Operations Hub & Direct Contacts */}
            <Contact />
          </main>

          {/* Corporate Footer */}
          <Footer />

          {/* Floating AI Executive Assistant with User Awareness */}
          <ChatBot />

          {/* Mobile Quick Action Bar */}
          <MobileQuickBar />

          {/* Luxury Client & Management Portal with 1-Click Demo Personas & Odoo Sync */}
          <ClientPortalModal />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
