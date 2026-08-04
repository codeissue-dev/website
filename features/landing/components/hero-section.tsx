import Link from 'next/link';

import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { domains } from '@/lib/site-data';
import { pageFrame, reveal, subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';
import { HeroArt } from './hero-art';

export function HeroSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div
        className={cn(
          subtleGrid,
          'pointer-events-none absolute inset-x-0 top-0 h-[46rem] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70',
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-signal/10 blur-[120px]"
        aria-hidden="true"
      />

      <div
        className={cn(
          pageFrame,
          'relative pb-20 pt-20 sm:pt-24 lg:pb-28 lg:pt-28',
        )}
      >
        <div className="mx-auto max-w-4xl text-center">
          <div
            className={cn(
              reveal,
              'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-sm text-muted-foreground',
            )}
            data-reveal
          >
            <span className="size-1.5 rounded-full bg-positive" />
            {copy.hero.eyebrow}
          </div>

          <h1 className="mt-7 text-[clamp(2.55rem,6.1vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
            <span className={cn(reveal, 'block')} data-reveal>
              {copy.hero.lineOne}
            </span>
            <span
              className={cn(
                reveal,
                'mt-2 block bg-linear-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent',
              )}
              data-reveal
            >
              {copy.hero.lineTwo}
            </span>
          </h1>

          <p
            className={cn(
              reveal,
              'mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8',
            )}
            data-reveal
          >
            {copy.hero.description}
          </p>

          <div
            className={cn(
              reveal,
              'mt-8 flex flex-col justify-center gap-2 sm:flex-row',
            )}
            data-reveal
          >
            <Link href="/issues/new" className={buttonVariants({ size: 'lg' })}>
              {copy.hero.primary}
              <ArrowUpRightIcon className="size-4" />
            </Link>
            <a
              href="#process"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              {copy.hero.secondary}
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
            <span className="font-mono">{copy.hero.scroll}</span>
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

        <HeroArt copy={copy.hero.ticket} />
      </div>
    </section>
  );
}
