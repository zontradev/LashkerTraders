import React from 'react';

interface BabyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BabyFaceIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft rounded circular background */}
      <circle cx="50" cy="50" r="46" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
      
      {/* Baby Ears */}
      <circle cx="16" cy="50" r="8" fill="#fed7aa" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="84" cy="50" r="8" fill="#fed7aa" stroke="#0284c7" strokeWidth="2.5" />
      
      {/* Baby Head/Face */}
      <circle cx="50" cy="50" r="34" fill="#ffedd5" stroke="#0284c7" strokeWidth="3" />
      
      {/* Hair swirl */}
      <path
        d="M 50 16 C 54 8, 44 4, 48 2 C 54 2, 53 14, 50 18"
        stroke="#0284c7"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Eyes */}
      <ellipse cx="40" cy="46" rx="3.5" ry="4.5" fill="#0f172a" />
      <ellipse cx="60" cy="46" rx="3.5" ry="4.5" fill="#0f172a" />
      <circle cx="39" cy="44.5" r="1.5" fill="#ffffff" />
      <circle cx="59" cy="44.5" r="1.5" fill="#ffffff" />
      
      {/* Rosy blush cheeks */}
      <circle cx="33" cy="54" r="5" fill="#fda4af" opacity="0.65" />
      <circle cx="67" cy="54" r="5" fill="#fda4af" opacity="0.65" />
      
      {/* Smile */}
      <path
        d="M 43 56 Q 50 64 57 56"
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Diaper pin / bib accent */}
      <path
        d="M 36 76 C 42 82, 58 82, 64 76"
        stroke="#0284c7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BabyLogo({ size = 'md', showTagline = true, className = '' }: BabyLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BabyFaceIcon className={`${iconSizes[size]} shrink-0`} />
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-900 leading-none ${titleSizes[size]}`}>
          Lashker <span className="text-[#00b050]">Traders</span>
        </span>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
            Diapers • Baby Care • More
          </span>
        )}
      </div>
    </div>
  );
}
