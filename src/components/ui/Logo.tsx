import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 52 }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <img
        src="/logo.png"
        alt="PEPEK GRUPO RENT-A-CAR"
        className="w-auto h-full object-contain"
        style={{ maxHeight: height }}
      />
    </div>
  );
};
