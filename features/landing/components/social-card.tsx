import { ArrowUpRightIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import type { Dictionary } from '@/lib/i18n';
import type { Social } from '@/lib/site-data';

import { ExternalLink } from './external-link';

export function SocialCard({
  social,
  copy,
}: {
  social: Social;
  copy: Dictionary['network'];
}) {
  return (
    <ExternalLink
      href={social.href}
      className="social-directory__item"
      label={`${social.name}: ${social.handle}`}
    >
      <span className="social-directory__icon" aria-hidden="true">
        <SocialIcon name={social.id} className="size-5" />
      </span>
      <span className="social-directory__identity">
        <strong>{social.name}</strong>
        <small>{social.handle}</small>
      </span>
      <p>{copy.socials[social.id]}</p>
      <span className="social-directory__open">
        {copy.open}
        <ArrowUpRightIcon className="size-4" />
      </span>
    </ExternalLink>
  );
}
