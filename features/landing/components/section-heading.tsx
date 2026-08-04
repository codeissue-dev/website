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
        'grid gap-8 border-t border-border pt-5 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:gap-12',
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
            'mt-6 max-w-[12ch] text-[clamp(2.6rem,5.2vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.06em]',
          )}
          data-reveal
        >
          {title}
        </h2>
      </div>
      <div
        className={cn(
          reveal,
          'flex flex-col justify-between gap-8 md:border-l md:border-border md:pl-8',
        )}
        data-reveal
      >
        <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
        {aside}
      </div>
    </header>
  );
}
