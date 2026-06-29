import { cn } from '../lib/utils';
import type { HTMLAttributes } from 'react';

export type LogoVariant = 'primary' | 'dark' | 'icon' | 'legal';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const logoSizeClasses: Record<LogoSize, string> = {
  sm: 'h-5',  // 20px
  md: 'h-8',  // 32px
  lg: 'h-12', // 48px
  xl: 'h-16'  // 64px
};

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  size?: LogoSize;
  alt?: string;
}

export function Logo({ variant = 'dark', size = 'md', className, alt = 'Techsonic', ...props }: LogoProps) {
  const sizeClass = logoSizeClasses[size];
  const maskId = `stripeMask-${variant}`;

  if (variant === 'icon') {
    return (
      <div className={cn('inline-flex items-center', sizeClass, className)} role="img" aria-label={alt} {...props}>
        <svg viewBox="0 0 144 72" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
          <path d="M72 0C111.196 0 144 32.8043 144 72H0C0 32.8043 32.8043 0 72 0Z" fill="#2563EB" />
          <mask id={maskId} fill="white">
            <path d="M72 0C111.196 0 144 32.8043 144 72H0C0 32.8043 32.8043 0 72 0Z" />
          </mask>
          <g mask={`url(#${maskId})`} fill="#ffffff" opacity="0.18">
            <rect x="0" y="10" width="144" height="10" />
            <rect x="0" y="26" width="144" height="10" />
            <rect x="0" y="42" width="144" height="10" />
            <rect x="0" y="58" width="144" height="10" />
          </g>
        </svg>
      </div>
    );
  }

  const isPrimary = variant === 'primary';
  const isLegal = variant === 'legal';

  const iconColor = isPrimary ? '#2563EB' : '#FFFFFF';
  const textColor = isPrimary ? '#2563EB' : '#FFFFFF';
  const subtextColor = isPrimary ? '#94A3B8' : '#D4D4D8';
  const stripeColor = isPrimary ? '#ffffff' : '#09090B';

  return (
    <div className={cn('inline-flex items-center', sizeClass, className)} role="img" aria-label={alt} {...props}>
      <svg viewBox="0 0 320 120" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 24)">
          <path d="M72 0C111.196 0 144 32.8043 144 72H0C0 32.8043 32.8043 0 72 0Z" fill={iconColor} />
          <mask id={maskId} fill="white">
            <path d="M72 0C111.196 0 144 32.8043 144 72H0C0 32.8043 32.8043 0 72 0Z" />
          </mask>
          <g mask={`url(#${maskId})`} fill={stripeColor} opacity="0.18">
            <rect x="0" y="10" width="144" height="10" />
            <rect x="0" y="26" width="144" height="10" />
            <rect x="0" y="42" width="144" height="10" />
            <rect x="0" y="58" width="144" height="10" />
          </g>
        </g>
        <text x="182" y="76" fill={textColor} fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="36" fontWeight="700">
          Techsonic
        </text>
        {isLegal && (
          <text x="182" y="103" fill={subtextColor} fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="18" letterSpacing="0.24em">
            LLC
          </text>
        )}
      </svg>
    </div>
  );
}
