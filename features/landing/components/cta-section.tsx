import { MailIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { contactEmail } from '@/lib/site-data';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function CtaSection({ copy }: { copy: Dictionary }) {
  return (
    <section className={sectionSpacing}>
      <div className={pageFrame}>
        <div className="grid border-y border-border lg:grid-cols-[8rem_minmax(0,1fr)_minmax(18rem,0.38fr)]">
          <div className="border-b border-border p-5 font-mono text-[0.6rem] tracking-[0.1em] text-signal lg:border-r lg:border-b-0 lg:p-7">
            CI / NEW
          </div>
          <div className="border-b border-border p-5 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
            <p
              className={cn(
                reveal,
                'font-mono text-[0.62rem] tracking-[0.1em] text-muted-foreground',
              )}
              data-reveal
            >
              {copy.cta.eyebrow}
            </p>
            <h2
              className={cn(
                reveal,
                'mt-6 max-w-[12ch] text-[clamp(2.2rem,4.2vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.05em]',
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
            <a
              href={`mailto:${contactEmail}`}
              className={buttonVariants({ size: 'lg' })}
            >
              <MailIcon className="size-4" />
              {copy.cta.primary}
            </a>
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
