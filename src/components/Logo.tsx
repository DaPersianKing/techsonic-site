import { cn } from '../lib/utils';
import type { HTMLAttributes } from 'react';

export type LogoVariant = 'grayscale' | 'blue' | 'white' | 'icon';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const logoSizeClasses: Record<LogoSize, string> = {
  sm: 'h-5',  // 20px
  md: 'h-8',  // 32px (default)
  lg: 'h-12', // 48px
  xl: 'h-16'  // 64px
};

const logoColorSets = {
  blue: {
    mark: '#2563EB',
    text: '#2563EB',
    subText: '#94A3B8',
    stripe: 'rgba(255,255,255,0.18)',
    background: '#ffffff'
  },
  white: {
    mark: '#FFFFFF',
    text: '#FFFFFF',
    subText: '#D4D4D8',
    stripe: 'rgba(9,9,11,0.18)',
    background: '#09090B'
  },
  grayscale: {
    mark: '#A1A1AA',
    text: '#E5E7EB',
    subText: '#D4D4D8',
    stripe: 'rgba(9,9,11,0.18)',
    background: '#09090B'
  }
} as const;

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  size?: LogoSize;
  alt?: string;
}

export function Logo({ variant = 'white', size = 'md', className, alt = 'Techsonic LLC', ...props }: LogoProps) {
  const sizeClass = logoSizeClasses[size];

  if (variant === 'icon') {
    return (
      <div className={cn('inline-flex items-center', sizeClass, className)} role="img" aria-label={alt} {...props}>
        <svg viewBox="0 0 120 120" className="h-full w-auto" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="56" fill="#2563EB" />
          <path d="M18 60C18 35.107 35.107 18 60 18C84.893 18 102 35.107 102 60H18Z" fill="#ffffff" opacity="0.16" />
          <g fill="#ffffff" opacity="0.9">
            <rect x="20" y="48" width="80" height="8" rx="4" />
            <rect x="20" y="60" width="80" height="8" rx="4" />
            <rect x="20" y="72" width="80" height="8" rx="4" />
          </g>
        </svg>
      </div>
    );
  }

  const colors = logoColorSets[variant === 'grayscale' || variant === 'white' || variant === 'blue' ? variant : 'white'];
  const maskId = `stripeMask-${variant}`;

  return (
    <div className={cn('inline-flex items-center', sizeClass, className)} role="img" aria-label={alt} {...props}>
      <svg viewBox="0 0 320 120" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
        <path d="M72 0C111.196 0 144 32.8043 144 72H0C0 32.8043 32.8043 0 72 0Z" fill={colors.mark} />
        <mask id={maskId} fill="white">
          <path d="M72 0C111.196 0 144 32.8043 144 72H0C0 32.8043 32.8043 0 72 0Z" />
        </mask>
        <g mask={`url(#${maskId})`} fill={colors.background} opacity="0.18">
          <rect x="0" y="10" width="144" height="10" />
          <rect x="0" y="26" width="144" height="10" />
          <rect x="0" y="42" width="144" height="10" />
          <rect x="0" y="58" width="144" height="10" />
        </g>
        <text x="182" y="64" fill={colors.text} fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="36" fontWeight="700">
          Techsonic
        </text>
        <text x="182" y="91" fill={colors.subText} fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="18" letterSpacing="0.24em">
          LLC
        </text>
      </svg>
    </div>
  );
}
