import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons';
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
          <p className="hero-kicker" data-reveal>
            <span>Codeissue / 2026</span>
            <span>{copy.hero.eyebrow}</span>
          </p>

          <h1 className="hero-title">
            <span data-reveal>{copy.hero.lineOne}</span>
            <span className="hero-title__accent" data-reveal>
              {copy.hero.lineTwo}
            </span>
          </h1>

          <div className="hero-summary" data-reveal>
            <p>{copy.hero.description}</p>
            <div className="hero-actions">
              <a
                href={`mailto:${contactEmail}`}
                className={buttonVariants({ size: 'lg' })}
              >
                {copy.hero.primary}
                <ArrowUpRightIcon className="size-4" />
              </a>
              <a
                href="#process"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                {copy.hero.secondary}
                <ArrowDownIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <IssueTicket copy={copy.hero.ticket} />
      </div>

      <div className="section-frame hero-footnote" data-reveal>
        <span>{copy.hero.scroll}</span>
        <div className="hero-domains">
          {domains.map((domain) => (
            <ExternalLink key={domain.href} href={domain.href}>
              {domain.label}
              <ArrowUpRightIcon className="size-4" />
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
