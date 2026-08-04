import Link from 'next/link';

import { ArrowUpRightIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing, subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function CtaSection({ copy }: { copy: Dictionary }) {
  return (
    <section className={cn(sectionSpacing, 'pt-6 sm:pt-8 lg:pt-12')}>
      <div className={pageFrame}>
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-card px-5 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:px-8 sm:py-20">
          <div
            className={cn(
              subtleGrid,
              'pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)] opacity-80',
            )}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-[36rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_70%)] blur-2xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl">
            <p
              className={cn(
                reveal,
                'font-mono text-sm tracking-[0.08em] text-signal-soft',
              )}
              data-reveal
            >
              {copy.cta.eyebrow}
            </p>
            <h2
              className={cn(
                reveal,
                'mt-5 text-[clamp(2.1rem,5vw,4.6rem)] font-semibold leading-[1] tracking-[-0.06em]',
              )}
              data-reveal
            >
              {copy.cta.title}
            </h2>
            <p
              className={cn(
                reveal,
                'mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg',
              )}
              data-reveal
            >
              {copy.cta.description}
            </p>
            <div
              className={cn(
                reveal,
                'mt-8 flex flex-col justify-center gap-2 sm:flex-row',
              )}
              data-reveal
            >
              <Link
                href="/issues/new"
                className={buttonVariants({ size: 'lg' })}
              >
                {copy.cta.primary}
                <ArrowUpRightIcon className="size-4" />
              </Link>
              <ExternalLink
                href="https://discord.gg/uckqayVRmy"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                <SocialIcon name="discord" className="size-4" />
                {copy.cta.secondary}
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
