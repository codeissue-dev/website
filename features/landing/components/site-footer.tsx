import { BrandLogo } from '@/components/brand/brand-logo';
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
          'grid gap-8 py-10 md:grid-cols-[1fr_1fr_auto] md:items-end',
        )}
      >
        <div className="flex items-center gap-3">
          <BrandLogo className="size-8" />
          <div className="flex flex-col">
            <strong className="text-sm font-semibold">Codeissue</strong>
            <span className="mt-0.5 text-sm text-muted-foreground">
              {copy.footer.rights}
            </span>
          </div>
        </div>

        <p className="max-w-lg text-sm leading-6 text-muted-foreground md:text-center">
          {copy.footer.note}
        </p>

        <div className="flex flex-col items-start gap-1.5 text-sm text-muted-foreground md:items-end">
          <a href={`mailto:${contactEmail}`} className="hover:text-foreground">
            {contactEmail}
          </a>
          {domains.map((domain) => (
            <ExternalLink
              key={domain.href}
              href={domain.href}
              className="hover:text-foreground"
            >
              {domain.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
