import React from 'react';

interface KorpriLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  light?: boolean;
}

export const KorpriLogo: React.FC<KorpriLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  light = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]}`}>
        {/* Official Gold & Blue Circular KORPRI Emblem */}
        <img
          src="/assets/aistudio/_Pngtree_korpri_logo_in_gold_and_8812182_2f03f2ab.png"
          alt="Lambang Resmi KORPRI"
          className="w-full h-full object-contain drop-shadow-sm select-none transition-transform duration-300 group-hover:scale-105"
          loading="eager"
          draggable={false}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight leading-tight uppercase ${
              light ? 'text-white' : 'text-slate-900'
            } ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}`}
          >
            DP KORPRI
          </span>
          <span
            className={`font-semibold tracking-wide uppercase ${
              light ? 'text-amber-300' : 'text-[#0b2d4c]'
            } ${size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]'}`}
          >
            Kabupaten Semarang
          </span>
        </div>
      )}
    </div>
  );
};

