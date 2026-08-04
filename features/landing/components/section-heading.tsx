import type { ReactNode } from 'react';

import { eyebrow, reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow: eyebrowText,
  title,
  description,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.6fr)] lg:items-end lg:gap-16',
        className,
      )}
    >
      <div>
        <p className={cn(eyebrow, reveal)} data-reveal>
          {eyebrowText}
        </p>
        <h2
          className={cn(
            reveal,
            'mt-5 max-w-[17ch] text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]',
          )}
          data-reveal
        >
          {title}
        </h2>
      </div>
      <div className={cn(reveal, 'lg:pb-1')} data-reveal>
        <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
        {aside ? <div className="mt-6">{aside}</div> : null}
      </div>
    </header>
  );
}
