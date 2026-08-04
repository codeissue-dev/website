import Link from 'next/link';

import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { domains } from '@/lib/site-data';
import { pageFrame, reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';
import { HeroArt } from './hero-art';

export function HeroSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="top" className="relative overflow-hidden pt-16 lg:pt-[4.5rem]">
      <div className={cn(pageFrame, 'relative border-x border-border')}>
        <div
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:4.5rem_4.5rem]"
          aria-hidden="true"
        />

        <div className="relative grid border-b border-border lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)]">
          <div className="flex min-h-[34rem] flex-col px-4 py-8 sm:min-h-[38rem] sm:px-8 sm:py-10 lg:min-h-[42rem] lg:border-r lg:border-border lg:px-12 lg:py-12">
            <div
              className={cn(
                reveal,
                'flex flex-wrap items-center justify-between gap-3 font-mono text-sm tracking-[0.08em] text-muted-foreground',
              )}
              data-reveal
            >
              <span className="text-signal">CI / ISSUE 001</span>
              <span>{copy.hero.eyebrow}</span>
            </div>

            <div className="my-auto py-12 sm:py-16">
              <h1 className="max-w-[16ch] text-[clamp(2.15rem,4vw,4rem)] font-medium leading-[1.01] tracking-[-0.05em]">
                <span className={cn(reveal, 'block')} data-reveal>
                  {copy.hero.lineOne}
                </span>
                <span
                  className={cn(reveal, 'mt-2 block text-signal-soft sm:mt-3')}
                  data-reveal
                >
                  {copy.hero.lineTwo}
                </span>
              </h1>

              <p
                className={cn(
                  reveal,
                  'mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8',
                )}
                data-reveal
              >
                {copy.hero.description}
              </p>

              <div
                className={cn(reveal, 'mt-8 grid gap-2 sm:flex sm:flex-wrap')}
                data-reveal
              >
                <Link
                  href="/issues/new"
                  className={buttonVariants({ size: 'lg' })}
                >
                  {copy.hero.primary}
                  <ArrowUpRightIcon className="size-4" />
                </Link>
                <a
                  href="#process"
                  className={buttonVariants({
                    variant: 'secondary',
                    size: 'lg',
                  })}
                >
                  {copy.hero.secondary}
                  <ArrowDownIcon className="size-4" />
                </a>
              </div>
            </div>

            <div
              className={cn(
                reveal,
                'flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-5',
              )}
              data-reveal
            >
              <span className="mr-auto font-mono text-sm tracking-[0.08em] text-muted-foreground">
                {copy.hero.scroll}
              </span>
              {domains.map((domain) => (
                <ExternalLink
                  key={domain.href}
                  href={domain.href}
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-signal-soft"
                >
                  {domain.label}
                  <ArrowUpRightIcon className="size-3.5" />
                </ExternalLink>
              ))}
            </div>
          </div>

          <HeroArt copy={copy.hero.ticket} />
        </div>

        <div className="relative grid grid-cols-2 border-b border-border sm:grid-cols-4">
          {copy.hero.ticket.stages.map((item, index) => (
            <div
              key={item}
              className="flex min-h-16 items-center gap-3 border-r border-border px-4 font-mono text-sm text-muted-foreground last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r sm:[&:nth-child(2)]:border-border"
            >
              <span
                className={index === 0 ? 'text-signal' : 'text-border-strong'}
              >
                0{index + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
