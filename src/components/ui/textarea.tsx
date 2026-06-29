import { cn } from '../../lib/utils';
import type { TextareaHTMLAttributes } from 'react';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[160px] w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none transition placeholder:text-text-placeholder focus:border-accent focus:ring-2 focus:ring-accent/25',
        className
      )}
      {...props}
    />
  );
}
