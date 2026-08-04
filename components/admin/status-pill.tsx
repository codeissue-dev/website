import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type StatusTone = 'neutral' | 'positive' | 'warning' | 'danger' | 'signal';

const tones: Record<StatusTone, string> = {
  neutral: 'border-border text-muted-foreground',
  positive: 'border-positive/40 bg-positive/10 text-positive',
  warning: 'border-warning/40 bg-warning/10 text-warning',
  danger: 'border-danger/40 bg-danger/10 text-danger',
  signal: 'border-signal/40 bg-signal/10 text-signal-soft',
};

export function StatusPill({
  children,
  tone = 'neutral',
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-2 border px-2.5 py-1 font-mono text-sm font-semibold uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
    >
      {dot ? <i className="size-1.5 bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
