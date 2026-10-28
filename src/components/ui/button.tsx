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
        'button',
        variant === 'secondary' && 'secondary',
        variant === 'ghost' && 'ghost',
        className
      )}
      {...props}
    />
  );
}
