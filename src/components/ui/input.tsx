import { cn } from '../../lib/utils';
import type { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none transition placeholder:text-text-placeholder focus:border-accent focus:ring-2 focus:ring-accent/25',
        className
      )}
      {...props}
    />
  );
}
