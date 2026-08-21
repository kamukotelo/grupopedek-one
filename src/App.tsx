import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SplashScreen } from './components/ui/SplashScreen';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { InstitutionalClients } from './components/sections/InstitutionalClients';
import { BookingWidget } from './components/sections/BookingWidget';
import { RouteEstimator } from './components/sections/RouteEstimator';
import { Services } from './components/sections/Services';
import { Fleet } from './components/sections/Fleet';
import { CorporatePortal } from './components/sections/CorporatePortal';
import { CoverageMap } from './components/sections/CoverageMap';
import { Process } from './components/sections/Process';
import { About } from './components/sections/About';
import { Capabilities } from './components/sections/Capabilities';
import { PaymentSecurity } from './components/sections/PaymentSecurity';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import { ChatBot } from './components/ui/ChatBot';
import { MobileQuickBar } from './components/layout/MobileQuickBar';
import './i18n';

export const App: React.FC = () => {
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<string>('SUV Executiva — Land Cruiser Prado / LC300');

  return (
    <HelmetProvider>
      {/* Lightweight, zero-lag luxury splash screen */}
      <SplashScreen />

      <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#0B45D8] selection:text-white pb-14 lg:pb-0">
        {/* Sticky Header Navigation with Client Area */}
        <Header />

        {/* Main Application Flow */}
        <main className="flex-1">
          {/* 1. Hero Section (Slogan & 4 Pillars) */}
          <Hero />

          {/* 2. Top Institutional Client Logos (5-second 6-logo stepped rotation) */}
          <InstitutionalClients />

          {/* 3. Interactive VIP Concierge & Smart Booking Engine */}
          <BookingWidget initialVehicle={selectedVehicleForBooking} />

          {/* 4. Executive Route Estimator & Fare Calculator */}
          <RouteEstimator />

          {/* 5. Core Services (4 Interactive Cards) */}
          <Services />

          {/* 6. Fleet Showcase with High-Res Technical Specs Modal */}
          <Fleet onSelectVehicle={(v) => setSelectedVehicleForBooking(v)} />

          {/* 7. Dedicated Corporate & Diplomatic VIP Protocol Section */}
          <CorporatePortal />

          {/* 8. Operational Coverage Map (18 Provinces & Hubs) */}
          <CoverageMap />

          {/* 9. Process 'Da Reserva à Chegada' (3 Steps) */}
          <Process />

          {/* 10. Corporate History & Core Values since 2014 */}
          <About />

          {/* 11. Operational Capabilities & Special Missions */}
          <Capabilities />

          {/* 12. Payment Security & AGT Compliance Bar */}
          <PaymentSecurity />

          {/* 13. Frequently Asked Questions (FAQ) */}
          <FAQ />

          {/* 14. Contact & 24/7 Operations Hub */}
          <Contact />
        </main>

        {/* Corporate Footer */}
        <Footer />

        {/* Floating AI Executive Assistant with Quick Chips */}
        <ChatBot />

        {/* Mobile Quick Action Bar */}
        <MobileQuickBar />
      </div>
    </HelmetProvider>
  );
};

export default App;
