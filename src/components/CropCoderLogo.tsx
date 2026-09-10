import React from 'react';

interface CropCoderLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const CropCoderLogo: React.FC<CropCoderLogoProps> = ({
  className = 'h-10 w-10',
  size = 44,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? '' : ''}`}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CropCoder Logo"
      >
        {/* Dark circular emblem background */}
        <rect width="120" height="120" rx="14" fill="#0C120E" />

        {/* Serif Letter C in warm ivory / off-white */}
        {/* Top serif flag, outer arc, bottom terminal, inner bowl */}
        <path
          d="M 78 29
             C 77.2 29.5 76 30.2 75.2 31.8
             L 75 39.5
             C 74 38.2 71.8 35.2 68 33.2
             C 63.5 30.8 58 29.8 52 30.8
             C 41.5 32.5 33.2 41.2 32.2 53.5
             C 31.2 66.2 38.5 78.5 50.8 82.2
             C 57.5 84.2 65 83 71.5 79.2
             C 74.8 77.2 77.2 74.5 78.8 71.2
             L 74 67.5
             C 72.8 70.2 70.5 72.5 67.2 74.2
             C 61.8 77 54.5 77 48.8 73.8
             C 41.2 69.5 38.5 59.8 40.2 50.8
             C 41.8 42.5 48.2 36.5 56.5 35.8
             C 61.2 35.5 66 37.2 69.2 40.2
             C 70.8 41.8 72 43.5 72.8 45.5
             L 78 45.5
             Z"
          fill="#F5EFEB"
        />

        {/* Field Furrows / Plowed soil lines inside C */}
        {/* Row 1 (top furrow) */}
        <path
          d="M 45 66
             C 53 64.5 64 61.5 74 58.5
             C 70 61.8 60 65.5 50 68
             C 47.5 68.5 45.8 67.8 45 66 Z"
          fill="#449E2A"
        />
        {/* Row 2 (middle furrow) */}
        <path
          d="M 47 71.5
             C 54 70 62 67.2 71 63.8
             C 67 66.8 59 70 51 72.5
             C 49 73 47.8 72.5 47 71.5 Z"
          fill="#378720"
        />
        {/* Row 3 (bottom furrow) */}
        <path
          d="M 51 76.8
             C 56 75.5 62 73 68 69.5
             C 64 72 59 74.5 53.5 76.5
             C 52.2 77 51.5 77 51 76.8 Z"
          fill="#2A6B17"
        />

        {/* Central Root/Stem */}
        <path
          d="M 47.5 65.5 C 48 62 48.5 58 48.5 55.5"
          stroke="#449E2A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Sprout - Left Leaf */}
        <path
          d="M 48 57.5
             C 44 57.5 35.5 53 34 45
             C 33.2 41 34.5 38 35.2 37
             C 37.2 40.5 42 45 47.5 48.5
             C 48 51.5 48 55 48 57.5 Z"
          fill="#5BBF36"
        />

        {/* Sprout - Right Leaf (Main) */}
        <path
          d="M 48.5 56
             C 50 51 55 42 63.5 33.5
             C 64.5 32.5 65.2 32 65.8 32
             C 65.8 33.2 64.8 36.5 62.5 41
             C 59 47.5 53 53.5 48.5 56 Z"
          fill="#63C73E"
        />
        {/* Right leaf lower facet for depth */}
        <path
          d="M 48.5 56
             C 52 53.5 58 48 61 43
             C 56.5 46.5 51.8 51 48.5 56 Z"
          fill="#449E2A"
        />

        {/* Code Symbol </ > */}
        {/* < bracket */}
        <path
          d="M 70 41.5 L 65.5 45 L 70 48.5"
          stroke="#63C73E"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* / slash */}
        <path
          d="M 76 39.5 L 71.5 50.5"
          stroke="#63C73E"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* > bracket */}
        <path
          d="M 76.5 41.5 L 81 45 L 76.5 48.5"
          stroke="#63C73E"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className="flex items-baseline tracking-tight">
          <span className="font-display text-2xl text-[var(--forest)] font-normal">crop</span>
          <span className="font-sans text-2xl font-semibold text-[#48A82A] tracking-[-0.02em]">coder</span>
        </span>
      )}
    </div>
  );
};
