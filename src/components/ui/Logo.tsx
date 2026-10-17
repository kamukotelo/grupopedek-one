import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

const SOURCES: Record<'light' | 'dark', string> = {
  light: '/logo-pepek-light.webp',
  dark: '/logo-pepek-dark.webp',
};

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', height = 62 }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <img
        src={SOURCES[variant]}
        alt="PEPEK GRUPO RENT-A-CAR"
        decoding="async"
        onError={(event) => {
          // WebP falhou (cache estragada, rede): tenta uma vez a versão PNG.
          const img = event.currentTarget;
          if (img.dataset.fallback) return;
          img.dataset.fallback = '1';
          img.src = img.src.replace(/\.webp(\?.*)?$/, '.png');
        }}
        className="w-auto h-full object-contain transition-all duration-300 group-hover:scale-102"
        style={{ maxHeight: height }}
      />
    </div>
  );
};
