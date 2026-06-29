import { cn } from '../../lib/utils';
import type { SelectHTMLAttributes } from 'react';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 placeholder:text-text-placeholder',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
