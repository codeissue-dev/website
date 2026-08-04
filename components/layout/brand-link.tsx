import Link from 'next/link';
import type { MouseEventHandler } from 'react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { siteConfig } from '@/lib/config/site';
import { cn } from '@/lib/utils';

export function BrandLink({
  descriptor,
  href = siteConfig.routes.home,
  className,
  onClick,
}: {
  descriptor?: string;
  href?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('flex min-w-0 items-center gap-2.5', className)}
      aria-label={siteConfig.name}
    >
      <BrandLogo className="size-8" priority />
      <span className="text-sm font-semibold tracking-[-0.02em]">
        {siteConfig.name}
      </span>
      {descriptor ? (
        <>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden truncate text-sm text-muted-foreground sm:block">
            {descriptor}
          </span>
        </>
      ) : null}
    </Link>
  );
}
