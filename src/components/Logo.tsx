import { cn } from '../lib/utils';
import type { HTMLAttributes } from 'react';

export type LogoVariant = 'primary' | 'dark' | 'icon' | 'legal';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const logoSizeClasses: Record<LogoSize, string> = {
  sm: 'h-5', // 20px
  md: 'h-8', // 32px
  lg: 'h-12', // 48px
  xl: 'h-16', // 64px
};

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  size?: LogoSize;
  alt?: string;
}

export function Logo({
  variant = 'dark',
  size = 'md',
  className,
  alt = 'Techsonic',
  ...props
}: LogoProps) {
  const sizeClass = logoSizeClasses[size];
  const source =
    variant === 'icon'
      ? '/assets/logos/techsonic-icon.svg'
      : variant === 'dark'
        ? '/assets/logos/techsonic-official-dark-bg.webp'
        : '/assets/logos/techsonic-official-light-bg.webp';

  return (
    <div className={cn('inline-flex items-center', sizeClass, className)} {...props}>
      <img
        src={source}
        alt={variant === 'legal' ? '' : alt}
        className="h-full w-auto object-contain"
      />
      {variant === 'legal' && <span className="ml-3 text-sm font-semibold">Techsonic LLC</span>}
    </div>
  );
}
