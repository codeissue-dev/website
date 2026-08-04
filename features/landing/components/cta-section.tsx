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
        <div
          className={cn(
            reveal,
            'relative grid overflow-hidden border border-signal bg-signal text-primary-foreground [clip-path:polygon(0_0,96%_0,100%_18%,100%_100%,0_100%)] lg:grid-cols-[9rem_minmax(0,1fr)_auto]',
          )}
          data-reveal
        >
          <div className="border-b border-primary-foreground/25 p-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] lg:border-r lg:border-b-0 lg:p-7">
            CI / CONTACT
          </div>
          <div className="p-5 sm:p-8 lg:p-10">
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-65">
              {copy.cta.eyebrow}
            </p>
            <h2 className="mt-6 max-w-[11ch] text-[clamp(2.8rem,5.6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              {copy.cta.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 opacity-70">
              {copy.cta.description}
            </p>
          </div>
          <div className="grid content-end gap-2 border-t border-primary-foreground/25 p-5 sm:grid-cols-2 lg:min-w-72 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:p-7">
            <a
              href={`mailto:${contactEmail}`}
              className={buttonVariants({
                size: 'lg',
                className:
                  'border-primary-foreground bg-primary-foreground text-signal hover:border-background hover:bg-background hover:text-signal',
              })}
            >
              <MailIcon className="size-4" />
              {copy.cta.primary}
            </a>
            <ExternalLink
              href="https://discord.gg/uckqayVRmy"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'text-primary-foreground',
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
