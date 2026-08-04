import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-full border border-border bg-white/[0.035] px-2.5 font-mono text-sm font-medium tracking-[0.04em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
