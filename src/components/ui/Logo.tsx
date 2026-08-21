import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 54 }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <img
        src="/logo.png"
        alt="PEPEK GRUPO RENT-A-CAR"
        className="w-auto h-full object-contain filter contrast-[1.18] brightness-[1.25] drop-shadow-[0_2px_12px_rgba(11,69,216,0.35)] transition-all duration-300 group-hover:brightness-[1.35] group-hover:drop-shadow-[0_4px_20px_rgba(11,69,216,0.6)]"
        style={{ maxHeight: height }}
      />
    </div>
  );
};
