import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center border border-border px-2 font-mono text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
