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
        src="/logo.png"
        alt="PEPEK GRUPO RENT-A-CAR"
        className="w-auto h-full object-contain filter contrast-[1.25] brightness-[1.3] drop-shadow-[0_2px_16px_rgba(11,69,216,0.45)] transition-all duration-300 group-hover:brightness-[1.4] group-hover:scale-102"
        style={{ maxHeight: height }}
      />
    </div>
  );
};
