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
        'group relative flex min-h-52 flex-col border-r border-b border-border bg-background/40 p-4 transition-colors hover:bg-signal hover:text-primary-foreground sm:min-h-60 sm:p-5',
      )}
      label={`${social.name}: ${social.handle}`}
      data-reveal=""
    >
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center border border-current/30">
          <SocialIcon name={social.id} className="size-5" />
        </span>
        <span className="font-mono text-[0.58rem] opacity-60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-auto">
        <strong className="block text-lg font-semibold tracking-[-0.03em]">
          {social.name}
        </strong>
        <small className="mt-1 block truncate font-mono text-[0.62rem] opacity-65">
          {social.handle}
        </small>
        <p className="mt-4 text-xs leading-5 opacity-70">
          {copy.socials[social.id]}
        </p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] opacity-70">
        {copy.open}
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    </ExternalLink>
  );
}
