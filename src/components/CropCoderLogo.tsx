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
    <div className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="KishanDirect KD Monogram Logo"
      >
        <defs>
          <linearGradient id="kdLeafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7AA85B" />
            <stop offset="50%" stopColor="#4E7C38" />
            <stop offset="100%" stopColor="#23461D" />
          </linearGradient>
          <linearGradient id="kdLeafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2B5222" />
            <stop offset="60%" stopColor="#55863E" />
            <stop offset="100%" stopColor="#8DBF6D" />
          </linearGradient>
          <linearGradient id="kdLeafGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#6F9F52" />
            <stop offset="70%" stopColor="#3D6A2E" />
            <stop offset="100%" stopColor="#1A3816" />
          </linearGradient>
          <linearGradient id="kdVineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A8842" />
            <stop offset="100%" stopColor="#23461E" />
          </linearGradient>
          <linearGradient id="kdIvoryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAF6ED" />
            <stop offset="100%" stopColor="#ECE5D6" />
          </linearGradient>
          <filter id="kdVineShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.8" dy="1.2" stdDeviation="1" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Deep Black Emblem Background */}
        <rect width="120" height="120" rx="14" fill="#060907" />

        {/* Monogram KD Group */}
        <g id="monogram-kd">
          {/* Back Leaf Behind K stem */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 27 50 C 21 46 16 38 18 31 C 24 33 28 40 29 46 Z"
              fill="url(#kdLeafGrad3)"
            />
            <path
              d="M 18 31 Q 23 40 28 48"
              stroke="#8BBF6D"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Vine passing BEHIND K vertical stem */}
          <path
            d="M 20 60 C 23 54 28 48 34 46"
            stroke="url(#kdVineGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* ================= LETTER K (Ivory Serif) ================= */}
          <g fill="url(#kdIvoryGrad)">
            {/* Left Vertical Column of K with classical bracketed top & bottom serifs */}
            <path d="M 23 35 L 43 35 L 43 38.5 C 40.5 38.8 38.5 40 38.5 43 L 38.5 77 C 38.5 80 40.5 81.2 43 81.5 L 43 85 L 23 85 L 23 81.5 C 25.5 81.2 27.5 80 27.5 77 L 27.5 43 C 27.5 40 25.5 38.8 23 38.5 Z" />

            {/* Upper Diagonal Arm of K */}
            <path d="M 37.5 60.5 L 53 42.5 C 54.5 40.8 54.8 39.5 53.5 38.5 L 50 38.5 L 50 35 L 63 35 L 63 38.5 C 60 38.8 58.5 40 56.5 42 L 43.5 56.5 Z" />

            {/* Lower Diagonal Leg of K */}
            <path d="M 41.5 54 L 56.5 75.5 C 59.5 79.8 62.5 81.5 66.5 81.5 L 67.5 81.5 L 67.5 85 C 64.5 85 60.5 84.5 56 80 L 41 58.5 Z" />
          </g>

          {/* ================= LETTER D (Ivory Serif) ================= */}
          <g fill="url(#kdIvoryGrad)">
            <path
              d="M 54 35 
                 L 72 35 
                 C 85 35 94.5 44.5 94.5 60 
                 C 94.5 75.5 85 85 72 85 
                 L 54 85 
                 L 54 81.5 
                 C 56.5 81.2 58.5 80 58.5 77 
                 L 58.5 43 
                 C 58.5 40 56.5 38.8 54 38.5 
                 Z
                 M 67.5 42
                 L 67.5 78
                 L 71.5 78
                 C 80 78 86 71 86 60
                 C 86 49 80 42 71.5 42
                 Z"
            />
          </g>

          {/* ================= BOTANICAL VINES & LEAVES (ENTWINED) ================= */}

          {/* Leaf 1: Top-Left Leaf cluster curling on K's upper left stem */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 27.5 43 C 21 40 17 48 19 54 C 24 53 28 47 27.5 43 Z"
              fill="url(#kdLeafGrad1)"
            />
            <path
              d="M 27.5 43 Q 23 48 19 54"
              stroke="#9ED57E"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Vine Stem Wrapping ACROSS K's stem to front */}
          <path
            d="M 21 54 C 24 53 28 50 33 46 C 36 43 38 41 39 37"
            stroke="url(#kdVineGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            filter="url(#kdVineShadow)"
          />

          {/* Leaf 2: Small leaf pointing upper-right across K's junction */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 36 44 C 37 36 44 34 46 38 C 44 42 39 44 36 44 Z"
              fill="url(#kdLeafGrad2)"
            />
            <path
              d="M 36 44 Q 41 39 46 38"
              stroke="#C0E89E"
              strokeWidth="0.65"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* Leaf 3: Leaf cascading down near the K's lower leg and counter */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 37.5 59 C 32 63 34 72 38 74 C 41 68 40 62 37.5 59 Z"
              fill="url(#kdLeafGrad1)"
            />
            <path
              d="M 37.5 59 Q 37 66 38 74"
              stroke="#8BBF6D"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Vine Stem threading across K leg into D */}
          <path
            d="M 37 60 C 42 63 48 67 56 68 C 62 69 66 67 67.5 62"
            stroke="url(#kdVineGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#kdVineShadow)"
          />

          {/* Leaf 4: Pointing downward at bottom junction of K and D */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 46 66 C 45 74 51 78 54 75 C 53 70 49 67 46 66 Z"
              fill="url(#kdLeafGrad3)"
            />
            <path
              d="M 46 66 Q 49 71 54 75"
              stroke="#9ED57E"
              strokeWidth="0.65"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Vine looping up through D's inner counter and over the top-right curve */}
          <path
            d="M 67.5 62 C 69 54 72 45 77 41 C 82 37 87 40 89 46 C 90 52 87 60 84 68"
            stroke="url(#kdVineGrad)"
            strokeWidth="2.3"
            strokeLinecap="round"
            filter="url(#kdVineShadow)"
          />

          {/* Leaf 5: Leaf on top-right curve of D pointing outward */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 76 41 C 77 34 85 34 87 38 C 84 42 79 43 76 41 Z"
              fill="url(#kdLeafGrad2)"
            />
            <path
              d="M 76 41 Q 82 37 87 38"
              stroke="#C4ECA2"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* Leaf 6: Leaf cascading down the outer right curve of D */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 87 46 C 94 48 97 57 93 63 C 89 59 88 52 87 46 Z"
              fill="url(#kdLeafGrad1)"
            />
            <path
              d="M 87 46 Q 92 53 93 63"
              stroke="#A0D781"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Leaf 7: Terminal leaf hanging gracefully on right side of D */}
          <g filter="url(#kdVineShadow)">
            <path
              d="M 84 67 C 82 74 86 78 88 77 C 88 72 86 68 84 67 Z"
              fill="url(#kdLeafGrad3)"
            />
            <path
              d="M 84 67 Q 85 72 88 77"
              stroke="#8BBF6D"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        </g>
      </svg>

      {showText && (
        <span className="flex items-baseline tracking-tight">
          <span className="font-display text-2xl text-[var(--forest)] font-normal">Kishan</span>
          <span className="font-sans text-2xl font-bold text-[#e5a83b] tracking-[-0.02em]">Direct</span>
        </span>
      )}
    </div>
  );
};
