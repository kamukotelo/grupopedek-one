import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light', height = 52 }) => {
  const isDark = variant === 'dark';
  const fillColor = isDark ? '#06142F' : '#FFFFFF';

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 540 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full"
        aria-label="PEPEK GRUPO RENT-A-CAR"
      >
        {/* Wordmark: PE on Left */}
        {/* Letter P */}
        <path
          d="M 28 26 L 82 26 C 112 26, 126 40, 126 62 C 126 84, 110 98, 82 98 L 56 98 L 56 128 L 28 128 Z M 56 48 L 56 76 L 80 76 C 94 76, 100 70, 100 62 C 100 54, 94 48, 80 48 Z"
          fill={fillColor}
        />
        {/* Letter E */}
        <path
          d="M 140 26 L 222 26 L 222 48 L 168 48 L 168 64 L 214 64 L 214 84 L 168 84 L 168 106 L 224 106 L 224 128 L 140 128 Z"
          fill={fillColor}
        />

        {/* Center Stylized Road / Curved Waves Icon */}
        <g id="pepek-highway-curves">
          {/* Main forward-curving highway ribbon */}
          <path
            d="M 248 142 C 265 105, 255 58, 222 30 C 275 30, 320 44, 355 56 C 315 88, 288 120, 248 142 Z"
            fill={fillColor}
          />
          {/* Accent inner curve */}
          <path
            d="M 264 122 C 276 96, 268 52, 235 28 C 268 28, 305 38, 335 48 C 300 78, 280 102, 264 122 Z"
            fill={fillColor}
          />
        </g>

        {/* Wordmark: EK on Right */}
        {/* Letter E */}
        <path
          d="M 370 26 L 452 26 L 452 48 L 398 48 L 398 64 L 444 64 L 444 84 L 398 84 L 398 106 L 454 106 L 454 128 L 370 128 Z"
          fill={fillColor}
        />
        {/* Letter K */}
        <path
          d="M 470 26 L 498 26 L 498 62 L 536 26 L 572 26 L 522 68 L 574 128 L 538 128 L 498 78 L 498 128 L 470 128 Z"
          fill={fillColor}
        />

        {/* Sub-label Left: GRUPO */}
        <text
          x="30"
          y="152"
          fill={fillColor}
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="0.34em"
        >
          GRUPO
        </text>

        {/* Sub-label Right: RENT-A-CAR */}
        <text
          x="368"
          y="152"
          fill={fillColor}
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="23"
          letterSpacing="0.20em"
        >
          RENT-A-CAR
        </text>
      </svg>
    </div>
  );
};
