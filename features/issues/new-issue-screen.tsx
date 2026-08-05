import Link from 'next/link';

import { LocaleSelect } from '@/components/i18n/locale-select';
import { BrandLink } from '@/components/layout/brand-link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { pageFrame, subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { IssueCreatedNotice } from './issue-created-notice';
import { IssueIntakeAside } from './issue-intake-aside';
import { NewIssueForm } from './new-issue-form';

export function NewIssueScreen({
  copy,
  username,
  created,
  locale,
}: {
  copy: Dictionary;
  username: string;
  created?: string;
  locale: Locale;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-foreground">
      <div
        className={cn(
          subtleGrid,
          'pointer-events-none absolute inset-x-0 top-0 h-[36rem] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-60',
        )}
        aria-hidden="true"
      />
      <header className="relative border-b border-border bg-black/80 backdrop-blur-xl">
        <div
          className={cn(pageFrame, 'flex h-16 items-center justify-between')}
        >
          <BrandLink />
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <LocaleSelect locale={locale} label={copy.language.switchLabel} />
            <span className="hidden font-mono sm:inline">@{username}</span>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              {copy.newIssue.back}
            </Link>
          </div>
        </div>
      </header>
      <div className={cn(pageFrame, 'relative py-10 sm:py-14 lg:py-20')}>
        <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.62fr)_minmax(0,1.38fr)] lg:gap-12">
          <IssueIntakeAside copy={copy.newIssue} />
          <section className="rounded-xl border border-border bg-card p-5 shadow-[0_20px_70px_rgba(0,0,0,0.5)] sm:p-7 lg:p-8">
            <IssueCreatedNotice created={created} copy={copy.newIssue} />
            <NewIssueForm copy={copy.newIssue} />
          </section>
        </div>
      </div>
    </main>
  );
}
