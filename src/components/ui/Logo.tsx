import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 62 }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <img
        src="/logo-pepek-pdf.png"
        alt="PEPEK GRUPO RENT-A-CAR"
        className="w-auto h-full object-contain drop-shadow-[0_2px_16px_rgba(35,97,153,0.32)] transition-all duration-300 group-hover:scale-102"
        style={{ maxHeight: height }}
      />
    </div>
  );
};
