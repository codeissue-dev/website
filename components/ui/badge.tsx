import * as React from 'react';

import { cn } from '@/lib/utils';

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-[9px] border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
