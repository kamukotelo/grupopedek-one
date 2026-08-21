import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out at 1.1s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1100);

    // Completely remove from DOM at 1.5s
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06142F] transition-opacity duration-500 pointer-events-none select-none ${
        isFading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#0B45D8]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo Container with Shimmer Animation */}
      <div className="relative z-10 flex flex-col items-center animate-fadeIn">
        <div className="relative">
          <Logo height={68} variant="light" className="filter drop-shadow-[0_0_24px_rgba(11,69,216,0.6)] brightness-110" />
          
          {/* Light Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.2s_infinite]" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8899BB] mt-5 opacity-90">
          Movemos quem move Angola
        </p>

        {/* Minimal Progress Line */}
        <div className="w-32 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0B45D8] to-[#C9A84C] w-full animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
