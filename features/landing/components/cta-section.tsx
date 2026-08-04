import { MailIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { contactEmail } from '@/lib/site-data';

import { ExternalLink } from './external-link';

export function CtaSection({ copy }: { copy: Dictionary }) {
  return (
    <section className="cta-section section-pad">
      <div className="section-frame cta-panel" data-reveal>
        <p className="cta-panel__index">CI / CONTACT</p>
        <div>
          <p className="eyebrow">{copy.cta.eyebrow}</p>
          <h2>{copy.cta.title}</h2>
          <p>{copy.cta.description}</p>
        </div>
        <div className="cta-panel__actions">
          <a
            href={`mailto:${contactEmail}`}
            className={buttonVariants({ size: 'lg', className: 'cta-primary' })}
          >
            <MailIcon className="size-4" />
            {copy.cta.primary}
          </a>
          <ExternalLink
            href="https://discord.gg/uckqayVRmy"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'cta-secondary',
            })}
          >
            <SocialIcon name="discord" className="size-4" />
            {copy.cta.secondary}
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
