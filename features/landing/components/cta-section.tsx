import Link from 'next/link';

import { ArrowUpRightIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function CtaSection({ copy }: { copy: Dictionary }) {
  return (
    <section className={sectionSpacing}>
      <div className={pageFrame}>
        <div className="grid border-y border-border lg:grid-cols-[8rem_minmax(0,1fr)_minmax(18rem,0.38fr)]">
          <div className="border-b border-border p-5 font-mono text-sm tracking-[0.08em] text-signal lg:border-r lg:border-b-0 lg:p-7">
            CI / NEW
          </div>
          <div className="border-b border-border p-5 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
            <p
              className={cn(
                reveal,
                'font-mono text-sm tracking-[0.08em] text-muted-foreground',
              )}
              data-reveal
            >
              {copy.cta.eyebrow}
            </p>
            <h2
              className={cn(
                reveal,
                'mt-6 max-w-[14ch] text-[clamp(2rem,3.8vw,3.85rem)] font-medium leading-[1.01] tracking-[-0.045em]',
              )}
              data-reveal
            >
              {copy.cta.title}
            </h2>
            <p
              className={cn(
                reveal,
                'mt-6 max-w-2xl text-base leading-7 text-muted-foreground',
              )}
              data-reveal
            >
              {copy.cta.description}
            </p>
          </div>
          <div className="grid content-end gap-2 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-1 lg:p-7">
            <Link href="/issues/new" className={buttonVariants({ size: 'lg' })}>
              {copy.cta.primary}
              <ArrowUpRightIcon className="size-4" />
            </Link>
            <ExternalLink
              href="https://discord.gg/uckqayVRmy"
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
              })}
            >
              <SocialIcon name="discord" className="size-4" />
              {copy.cta.secondary}
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
