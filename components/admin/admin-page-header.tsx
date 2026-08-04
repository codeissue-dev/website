import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between',
        compact && 'pb-5',
      )}
    >
      <div className="min-w-0">
        <p className="font-mono text-sm text-signal-soft">{eyebrow}</p>
        <h1 className="mt-3 max-w-[18ch] text-[clamp(2rem,4vw,3.45rem)] font-semibold leading-[1.03] tracking-[-0.055em]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
