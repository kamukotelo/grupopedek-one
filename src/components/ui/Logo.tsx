import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light', height = 48 }) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#06142F' : '#FFFFFF';
  const accentColor = '#0B45D8';

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 420 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full"
        aria-label="PEPEK GRUPO RENT-A-CAR"
      >
        {/* Curved Road / Wave Icon between PE and EK */}
        <g id="pepek-icon">
          <path
            d="M175 110 C185 85, 175 45, 150 25 C190 25, 225 35, 255 45 C225 70, 205 95, 175 110 Z"
            fill={textColor}
          />
          <path
            d="M165 110 C180 85, 170 50, 145 35 C175 35, 205 45, 230 55 C205 78, 190 98, 165 110 Z"
            fill={accentColor}
            opacity="0.15"
          />
          <path
            d="M185 95 C195 75, 185 40, 160 22 C185 22, 215 30, 240 40 C215 65, 200 85, 185 95 Z"
            fill={textColor}
          />
        </g>

        {/* Wordmark: PE PEK */}
        {/* Letter P */}
        <path
          d="M 20 28 L 52 28 C 68 28, 78 36, 78 48 C 78 60, 68 68, 52 68 L 36 68 L 36 88 L 20 88 Z M 36 42 L 36 54 L 50 54 C 57 54, 61 51, 61 48 C 61 45, 57 42, 50 42 Z"
          fill={textColor}
        />
        {/* Letter E */}
        <path
          d="M 88 28 L 138 28 L 138 42 L 104 42 L 104 51 L 134 51 L 134 64 L 104 64 L 104 74 L 140 74 L 140 88 L 88 88 Z"
          fill={textColor}
        />
        {/* Letter E (Second) */}
        <path
          d="M 262 28 L 312 28 L 312 42 L 278 42 L 278 51 L 308 51 L 308 64 L 278 64 L 278 74 L 314 74 L 314 88 L 262 88 Z"
          fill={textColor}
        />
        {/* Letter K */}
        <path
          d="M 326 28 L 342 28 L 342 52 L 372 28 L 394 28 L 358 56 L 396 88 L 374 88 L 342 61 L 342 88 L 326 88 Z"
          fill={textColor}
        />

        {/* Subtitles: GRUPO (Left) and RENT-A-CAR (Right) */}
        <text
          x="20"
          y="108"
          fill={textColor}
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="0.32em"
        >
          GRUPO
        </text>

        <text
          x="262"
          y="108"
          fill={textColor}
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="0.22em"
        >
          RENT-A-CAR
        </text>
      </svg>
    </div>
  );
};
