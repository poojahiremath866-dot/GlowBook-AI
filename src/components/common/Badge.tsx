import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'rose' | 'gold' | 'emerald' | 'stone' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const base = 'inline-flex items-center font-medium rounded-full whitespace-nowrap transition-colors';
  const sizes = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const variants = {
    primary: 'bg-[#4A0E0E] text-white',
    secondary: 'bg-[#F2F0ED] text-[#1A1A1A] hover:bg-[#EAE2D8]/60',
    rose: 'bg-[#F2E8E8] text-[#8B4B4B] border border-[#EAE2D8]/80 font-bold uppercase tracking-[0.15em] text-[10px]',
    gold: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    stone: 'bg-[#F2F0ED] text-[#5C5C5C]',
    outline: 'border border-[#EAE2D8] text-[#1A1A1A] bg-white'
  };

  return (
    <span className={`${base} ${sizes} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
