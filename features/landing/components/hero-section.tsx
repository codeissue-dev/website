import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { contactEmail, domains } from '@/lib/site-data';
import { pageFrame, reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';
import { IssueTicket } from './issue-ticket';

export function HeroSection({ copy }: { copy: Dictionary }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-16 lg:pt-[4.75rem]"
    >
      <div
        className={cn(
          pageFrame,
          'relative border-x border-border/70 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(to_right,transparent_0,transparent_calc(25%_-_1px),rgba(135,149,255,0.08)_25%,transparent_calc(25%_+_1px),transparent_calc(75%_-_1px),rgba(135,149,255,0.08)_75%,transparent_calc(75%_+_1px))]',
        )}
      >
        <div className="grid min-h-[calc(100svh_-_4.75rem)] lg:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.72fr)]">
          <div className="relative flex min-h-[44rem] flex-col border-b border-border/70 px-4 py-8 sm:px-8 sm:py-10 lg:border-r lg:border-b-0 lg:px-12 lg:py-14">
            <div
              className={cn(
                reveal,
                'flex flex-wrap items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground',
              )}
              data-reveal
            >
              <span className="text-signal">Codeissue / 2026</span>
              <span>{copy.hero.eyebrow}</span>
            </div>

            <h1 className="mt-16 max-w-[15ch] text-[clamp(2.9rem,5.6vw,5.75rem)] font-semibold leading-[0.91] tracking-[-0.065em] sm:mt-20 lg:mt-auto">
              <span className={cn(reveal, 'block')} data-reveal>
                {copy.hero.lineOne}
              </span>
              <span
                className={cn(
                  reveal,
                  'mt-3 block border-l-2 border-signal pl-[clamp(1rem,2.2vw,2rem)] text-signal-soft',
                )}
                data-reveal
              >
                {copy.hero.lineTwo}
              </span>
            </h1>

            <div
              className={cn(
                reveal,
                'mt-14 grid gap-8 border-t border-border/70 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:mt-auto',
              )}
              data-reveal
            >
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {copy.hero.description}
              </p>
              <div className="grid gap-2 sm:flex">
                <a
                  href={`mailto:${contactEmail}`}
                  className={buttonVariants({ size: 'lg' })}
                >
                  {copy.hero.primary}
                  <ArrowUpRightIcon className="size-4" />
                </a>
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
          </div>

          <IssueTicket copy={copy.hero.ticket} />
        </div>

        <div
          className={cn(
            reveal,
            'grid gap-4 border-t border-border/70 px-4 py-4 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12',
          )}
          data-reveal
        >
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            ↓ {copy.hero.scroll}
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {domains.map((domain) => (
              <ExternalLink
                key={domain.href}
                href={domain.href}
                className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-muted-foreground transition-colors hover:text-signal-soft"
              >
                {domain.label}
                <ArrowUpRightIcon className="size-3.5" />
              </ExternalLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
