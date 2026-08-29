import React, { useEffect, useRef, useState } from 'react';

const SPLASH_DURATION = 1850;

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDeparting, setIsDeparting] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setIsVisible(false);
      return;
    }

    const departureTimer = window.setTimeout(() => {
      const source = logoRef.current;
      const target = document.querySelector<HTMLElement>('[data-header-logo]');

      setIsDeparting(true);
      if (!source || !target) return;

      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const deltaX = to.left + to.width / 2 - (from.left + from.width / 2);
      const deltaY = to.top + to.height / 2 - (from.top + from.height / 2);
      const scale = Math.min(to.width / from.width, to.height / from.height);

      source.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', filter: 'drop-shadow(0 0 28px rgba(35, 97, 153, .7))' },
          { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`, filter: 'drop-shadow(0 0 5px rgba(35, 97, 153, .28))' },
        ],
        { duration: 650, easing: 'cubic-bezier(.65, 0, .18, 1)', fill: 'forwards' },
      );
    }, 1120);

    const removeTimer = window.setTimeout(() => setIsVisible(false), SPLASH_DURATION);
    return () => {
      window.clearTimeout(departureTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`pepek-intro ${isDeparting ? 'pepek-intro--departing' : ''}`}
      aria-hidden="true"
    >
      <div className="pepek-intro__grid" />
      <div className="pepek-intro__horizon" />

      <div ref={logoRef} className="pepek-intro__logo" style={{ willChange: 'transform, filter' }}>
        <img className="pepek-intro__letters pepek-intro__letters--left" src="/logo-pepek-light.png" alt="" />
        <img className="pepek-intro__letters pepek-intro__letters--right" src="/logo-pepek-light.png" alt="" />
        <img className="pepek-intro__road" src="/logo-pepek-light.png" alt="" />
        <span className="pepek-intro__scanner" />
      </div>

      <div className="pepek-intro__speed-lines" />
      <p className="pepek-intro__tagline">Movemos quem move Angola</p>
    </div>
  );
};
