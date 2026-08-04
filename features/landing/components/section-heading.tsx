import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
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
    <header className={cn('section-heading', className)}>
      <div className="section-heading__title">
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
        <h2 data-reveal>{title}</h2>
      </div>
      <div className="section-heading__detail" data-reveal>
        <p>{description}</p>
        {aside}
      </div>
    </header>
  );
}
