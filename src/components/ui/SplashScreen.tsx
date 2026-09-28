import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SPLASH_DURATION = 1850;
const SPLASH_SEEN_KEY = 'pepek_intro_seen';

// A animação de abertura cobre o site durante ~1,9 s: mostra-se uma vez por
// sessão e não se repete a cada recarregamento ou nova aba aberta a partir do site.
const hasSeenSplash = () => {
  try {
    return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

export const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(() => !hasSeenSplash());
  const [isDeparting, setIsDeparting] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
    } catch {
      // Sem storage (modo privado restrito): a animação volta a aparecer, sem mais efeitos.
    }
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
      <div ref={logoRef} className="pepek-intro__logo" style={{ willChange: 'transform, filter' }}>
        <img className="pepek-intro__letters pepek-intro__letters--left" src="/logo-pepek-light.webp" alt="" />
        <img className="pepek-intro__letters pepek-intro__letters--right" src="/logo-pepek-light.webp" alt="" />
        <img className="pepek-intro__road" src="/logo-pepek-light.webp" alt="" />
      </div>

      <p className="pepek-intro__tagline">{t('common.splashTagline')}</p>
    </div>
  );
};
