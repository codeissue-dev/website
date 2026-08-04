import Link from 'next/link';

import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { domains } from '@/lib/site-data';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function HeroContent({ copy }: { copy: Dictionary['hero'] }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div
        className={cn(
          reveal,
          'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-sm text-muted-foreground',
        )}
        data-reveal
      >
        <span className="size-1.5 rounded-full bg-positive" />
        {copy.eyebrow}
      </div>

      <h1 className="mt-7 text-[clamp(2.55rem,6.1vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
        <span className={cn(reveal, 'block')} data-reveal>
          {copy.lineOne}
        </span>
        <span
          className={cn(
            reveal,
            'mt-2 block bg-linear-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent',
          )}
          data-reveal
        >
          {copy.lineTwo}
        </span>
      </h1>

      <p
        className={cn(
          reveal,
          'mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8',
        )}
        data-reveal
      >
        {copy.description}
      </p>

      <div
        className={cn(
          reveal,
          'mt-8 flex flex-col justify-center gap-2 sm:flex-row',
        )}
        data-reveal
      >
        <Link href="/issues/new" className={buttonVariants({ size: 'lg' })}>
          {copy.primary}
          <ArrowUpRightIcon className="size-4" />
        </Link>
        <a
          href="#process"
          className={buttonVariants({ variant: 'secondary', size: 'lg' })}
        >
          {copy.secondary}
          <ArrowDownIcon className="size-4" />
        </a>
      </div>

      <div
        className={cn(
          reveal,
          'mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground',
        )}
        data-reveal
      >
        <span className="font-mono">{copy.scroll}</span>
        {domains.map((domain) => (
          <ExternalLink
            key={domain.href}
            href={domain.href}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            {domain.label}
            <ArrowUpRightIcon className="size-3.5" />
          </ExternalLink>
        ))}
      </div>
    </div>
  );
}
