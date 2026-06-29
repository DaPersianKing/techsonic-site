import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ asChild, className, variant = 'primary', ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-60',
        variant === 'primary' && 'bg-accent text-background shadow-accent hover:brightness-110',
        variant === 'secondary' && 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        variant === 'ghost' && 'bg-transparent text-slate-200 hover:text-white',
        className
      )}
      {...props}
    />
  );
}
