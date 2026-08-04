import type { ReactNode } from 'react';

import { eyebrow } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
  eyebrow: eyebrowText,
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
        'grid gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end',
        compact && 'pb-6',
      )}
    >
      <div>
        <p className={eyebrow}>{eyebrowText}</p>
        <h1 className="mt-4 max-w-[15ch] text-[clamp(2.2rem,4.4vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}
