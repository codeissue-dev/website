import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { BrandLogo } from '@/components/brand/brand-logo';
import { NewIssueForm } from '@/components/issues/new-issue-form';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { pageFrame } from '@/lib/ui/styles';

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
    <main className="min-h-screen bg-black text-foreground">
      <header className="border-b border-border">
        <div
          className={`${pageFrame} flex min-h-16 items-center justify-between border-x border-border px-4 sm:px-6`}
        >
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo priority />
            <span className="text-sm font-semibold">Codeissue</span>
          </Link>
          <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
            <span>@{session.user.username}</span>
            <Link href="/" className="hover:text-signal-soft">
              {copy.newIssue.back}
            </Link>
          </div>
        </div>
      </header>

      <div className={`${pageFrame} border-x border-border`}>
        <div className="grid border-b border-border lg:grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)]">
          <section className="relative min-h-80 overflow-hidden border-b border-border p-5 sm:p-8 lg:min-h-[calc(100vh-4rem)] lg:border-r lg:border-b-0 lg:p-10">
            <Image
              src="/images/banner.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover opacity-25 grayscale"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,transparent_42%,#000_100%)]" />
            <div className="relative flex h-full flex-col">
              <p className="font-mono text-sm tracking-[0.08em] text-signal">
                {copy.newIssue.eyebrow}
              </p>
              <h1 className="mt-6 max-w-[13ch] text-[clamp(2.3rem,4.5vw,4.5rem)] font-medium leading-[1] tracking-[-0.05em]">
                {copy.newIssue.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                {copy.newIssue.description}
              </p>
              <ol className="mt-auto grid gap-0 border-t border-border bg-black/70 backdrop-blur-sm">
                {copy.newIssue.steps.map((step, index) => (
                  <li
                    key={step}
                    className="grid grid-cols-[3rem_1fr] border-b border-border py-4 last:border-b-0"
                  >
                    <span className="font-mono text-sm text-signal">
                      0{index + 1}
                    </span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="p-5 sm:p-8 lg:p-10">
            {created ? (
              <div className="mb-8 border border-positive/50 bg-positive/5 p-5">
                <p className="font-mono text-sm tracking-[0.08em] text-positive">
                  {copy.newIssue.successLabel}
                </p>
                <h2 className="mt-3 text-2xl font-medium">
                  {copy.newIssue.successTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
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
