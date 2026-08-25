import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'data' | 'water' | 'muted' | 'alert';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className,
  icon,
}) => {
  const variantStyles = {
    primary: 'bg-[#181712] text-[#4A6741] border-[#3A3830]',
    data: 'bg-[#181712] text-[#C98A3D] border-[#3A3830]',
    water: 'bg-[#181712] text-[#34445C] border-[#3A3830]',
    muted: 'bg-[#14140F] text-[#8C897C] border-[#3A3830]',
    alert: 'bg-[#181712] text-[#EDE8DD] border-[#8C897C]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-xs font-mono border transition-colors',
          variantStyles[variant],
          className
        )
      )}
    >
      {icon}
      {children}
    </span>
  );
};
