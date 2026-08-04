import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]',
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-sm tracking-[0.06em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em]">
          {title}
        </h2>
      </div>
      {action}
    </header>
  );
}
