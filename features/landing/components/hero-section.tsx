import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { contactEmail, domains } from '@/lib/site-data';

import { ExternalLink } from './external-link';
import { IssueTicket } from './issue-ticket';

export function HeroSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="top" className="hero-section">
      <div className="section-frame hero-grid">
        <div className="hero-copy">
          <Badge className="section-label" data-reveal>
            <span className="section-label__dot" aria-hidden="true" />
            {copy.hero.eyebrow}
          </Badge>

          <h1 className="hero-title">
            <span data-reveal>{copy.hero.lineOne}</span>
            <span className="hero-title__accent" data-reveal>
              {copy.hero.lineTwo}
            </span>
          </h1>

          <p className="hero-description" data-reveal>
            {copy.hero.description}
          </p>

          <div className="hero-actions" data-reveal>
            <a
              href={`mailto:${contactEmail}`}
              className={buttonVariants({
                size: 'lg',
                className: 'primary-cta',
              })}
            >
              {copy.hero.primary}
              <ArrowUpRightIcon className="size-4" />
            </a>
            <a
              href="#approach"
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
                className: 'secondary-cta',
              })}
            >
              {copy.hero.secondary}
              <ArrowDownIcon className="size-4" />
            </a>
          </div>

          <div className="hero-domains" data-reveal>
            {domains.map((domain) => (
              <ExternalLink key={domain.href} href={domain.href}>
                <span aria-hidden="true" />
                {domain.label}
              </ExternalLink>
            ))}
          </div>
        </div>

        <div className="hero-ticket-wrap" data-reveal>
          <div className="hero-ticket-backdrop" aria-hidden="true">
            <span>IDEA</span>
            <span>SYSTEM</span>
            <span>PRODUCT</span>
          </div>
          <IssueTicket copy={copy.hero.ticket} />
        </div>
      </div>

      <a href="#approach" className="scroll-cue">
        <span>{copy.hero.scroll}</span>
        <ArrowDownIcon className="size-4" />
      </a>
    </section>
  );
}
