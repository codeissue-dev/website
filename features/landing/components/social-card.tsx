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
        'group flex min-h-24 items-center gap-4 rounded-lg border border-border bg-card p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-soft',
      )}
      label={`${social.name}: ${social.handle}`}
      title={copy.socials[social.id]}
      data-reveal=""
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-black text-muted-foreground transition-colors group-hover:text-foreground">
        <SocialIcon name={social.id} className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-medium">
          {social.name}
        </strong>
        <span className="mt-1 block truncate text-sm text-muted-foreground">
          {social.handle}
        </span>
      </div>
      <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </ExternalLink>
  );
}
