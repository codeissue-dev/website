import { ArrowUpRightIcon } from '@/components/icons';
import { SocialIcon } from '@/components/social-icons';
import type { Dictionary } from '@/lib/i18n';
import type { Social } from '@/lib/site-data';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function SocialCard({
  social,
  copy,
  index,
}: {
  social: Social;
  copy: Dictionary['network'];
  index: number;
}) {
  return (
    <ExternalLink
      href={social.href}
      className={cn(
        reveal,
        'group grid min-h-32 grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-4 border-b border-border py-5 transition-colors hover:bg-white hover:px-4 hover:text-black sm:min-h-36 sm:grid-cols-[3.5rem_minmax(0,0.65fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:py-6',
      )}
      label={`${social.name}: ${social.handle}`}
      data-reveal=""
    >
      <span className="grid size-10 place-items-center border border-current/30">
        <SocialIcon name={social.id} className="size-5" />
      </span>
      <div className="min-w-0">
        <span className="font-mono text-sm opacity-55">
          {String(index + 1).padStart(2, '0')}
        </span>
        <strong className="mt-1 block truncate text-base font-medium tracking-[-0.02em]">
          {social.name}
        </strong>
        <small className="mt-1 block truncate font-mono text-sm opacity-60">
          {social.handle}
        </small>
      </div>
      <p className="col-span-2 max-w-xl text-sm leading-5 opacity-65 sm:col-span-1">
        {copy.socials[social.id]}
      </p>
      <ArrowUpRightIcon className="size-4 opacity-45 transition-opacity group-hover:opacity-100" />
    </ExternalLink>
  );
}
