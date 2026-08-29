import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

const SOURCES: Record<'light' | 'dark', string> = {
  light: '/logo-pepek-light.png',
  dark: '/logo-pepek-dark.png',
};

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', height = 62 }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <img
        src={SOURCES[variant]}
        alt="PEPEK GRUPO RENT-A-CAR"
        className="w-auto h-full object-contain transition-all duration-300 group-hover:scale-102"
        style={{ maxHeight: height }}
      />
    </div>
  );
};
