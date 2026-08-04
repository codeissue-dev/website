import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { BrandLogo } from '@/components/brand/brand-logo';
import { CheckIcon } from '@/components/icons';
import { NewIssueForm } from '@/components/issues/new-issue-form';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { pageFrame, subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export default async function NewIssuePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect('/register?callbackUrl=/issues/new');

  const [{ created }, { i18n, lng }] = await Promise.all([
    searchParams,
    getT('common'),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

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
        <div className={`${pageFrame} flex h-16 items-center justify-between`}>
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo priority />
            <span className="text-sm font-semibold">Codeissue</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden font-mono sm:inline">
              @{session.user.username}
            </span>
            <Link href="/" className="transition-colors hover:text-foreground">
              {copy.newIssue.back}
            </Link>
          </div>
        </div>
      </header>

      <div className={cn(pageFrame, 'relative py-10 sm:py-14 lg:py-20')}>
        <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.62fr)_minmax(0,1.38fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="font-mono text-sm text-signal-soft">
              {copy.newIssue.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[14ch] text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.06em]">
              {copy.newIssue.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              {copy.newIssue.description}
            </p>
            <ol className="mt-8 grid gap-3 border-t border-border pt-6">
              {copy.newIssue.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span className="grid size-7 place-items-center rounded-md border border-border bg-surface text-signal-soft">
                    {index < 1 ? (
                      <CheckIcon className="size-3.5" />
                    ) : (
                      <span className="font-mono text-sm">0{index + 1}</span>
                    )}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </aside>

          <section className="rounded-xl border border-border bg-card p-5 shadow-[0_20px_70px_rgba(0,0,0,0.5)] sm:p-7 lg:p-8">
            {created ? (
              <div className="mb-8 rounded-lg border border-positive/30 bg-positive/10 p-5">
                <p className="font-mono text-sm text-positive">
                  {copy.newIssue.successLabel}
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  {copy.newIssue.successTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.newIssue.successDescription}
                </p>
                <code className="mt-4 block font-mono text-sm text-signal-soft">
                  {created}
                </code>
              </div>
            ) : null}
            <NewIssueForm copy={copy.newIssue} />
          </section>
        </div>
      </div>
    </main>
  );
}
