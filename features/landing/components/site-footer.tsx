import { CodeIssueMark } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { contactEmail, domains } from '@/lib/site-data';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ExternalLink } from './external-link';

export function SiteFooter({ copy }: { copy: Dictionary }) {
  return (
    <footer className="border-t border-border bg-black">
      <div
        className={cn(
          pageFrame,
          'grid gap-8 border-x border-border py-8 md:grid-cols-[1fr_1fr_auto] md:items-end',
        )}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center border border-signal text-signal">
            <CodeIssueMark className="size-[1.1rem]" />
          </span>
          <div className="flex flex-col">
            <strong className="text-sm">Codeissue</strong>
            <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
              {copy.footer.rights}
            </span>
          </div>
        </div>

        <p className="max-w-lg text-sm leading-5 text-muted-foreground md:text-center">
          {copy.footer.note}
        </p>

        <div className="flex flex-col items-start gap-1.5 font-mono text-sm text-muted-foreground md:items-end">
          <a href={`mailto:${contactEmail}`} className="hover:text-signal-soft">
            {contactEmail}
          </a>
          {domains.map((domain) => (
            <ExternalLink
              key={domain.href}
              href={domain.href}
              className="hover:text-signal-soft"
            >
              {domain.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
