import Link from 'next/link';

import { ArrowUpRightIcon, CodeIssueMark } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary, Locale } from '@/lib/i18n';
import { contactEmail, navigation } from '@/lib/site-data';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { LanguageSwitch } from './language-switch';

export function SiteHeader({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/90 bg-background/90 backdrop-blur-xl">
      <div
        className={cn(
          pageFrame,
          'grid min-h-16 grid-cols-[1fr_auto] items-center border-x border-border/70 lg:min-h-[4.75rem] lg:grid-cols-[1fr_auto_1fr]',
        )}
      >
        <a
          href="#top"
          className="flex min-w-0 items-center gap-3 px-3 sm:px-4"
          aria-label="Codeissue"
        >
          <span className="grid size-9 shrink-0 place-items-center border border-signal bg-signal text-primary-foreground [clip-path:polygon(0_0,76%_0,100%_24%,100%_100%,0_100%)]">
            <CodeIssueMark className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <strong className="text-sm font-semibold tracking-[-0.02em]">
              Codeissue
            </strong>
            <small className="hidden truncate font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground sm:block">
              {copy.brand.descriptor}
            </small>
          </span>
        </a>

        <nav
          className="hidden h-full items-center border-x border-border/70 px-2 lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="inline-flex h-full items-center px-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-surface-soft hover:text-foreground"
            >
              {copy.nav[item.id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 px-3 sm:px-4">
          <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
          <Link
            href="/admin"
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
              className: 'hidden sm:inline-flex',
            })}
          >
            {copy.nav.workspace}
          </Link>
          <a
            href={`mailto:${contactEmail}`}
            className={buttonVariants({ size: 'sm' })}
          >
            <span className="hidden sm:inline">{copy.nav.contact}</span>
            <span className="sm:hidden">Email</span>
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
