import type { CSSProperties } from 'react';

import { ArrowUpRightIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import type { Dictionary } from '@/lib/i18n';
import type { Social } from '@/lib/site-data';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function SocialCard({
  social,
  copy,
}: {
  social: Social;
  copy: Dictionary['network'];
}) {
  const description = copy.socials[social.id];
  const style = { '--social-accent': social.accent } as CSSProperties;

  return (
    <ExternalLink
      href={social.href}
      className={cn('social-link-card', social.featured && 'is-featured')}
      label={`${social.name}: ${social.handle}`}
    >
      <article style={style}>
        <div className="social-link-card__visual" aria-hidden="true">
          <div className="social-link-card__art-grid" />
          <div className="social-link-card__icon">
            <SocialIcon name={social.id} className="size-10 sm:size-12" />
          </div>
          <div className="social-link-card__signal">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="social-link-card__handle">{social.handle}</span>
        </div>

        <div className="social-link-card__body">
          <div>
            <span className="social-link-card__name">{social.name}</span>
            <p>{description}</p>
          </div>
          <span className="social-link-card__open">
            {copy.open}
            <ArrowUpRightIcon className="size-4" />
          </span>
        </div>
      </article>
    </ExternalLink>
  );
}
