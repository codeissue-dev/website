import Link from 'next/link';
import { redirect } from 'next/navigation';

import { authenticateWithGitHub } from '@/app/login/actions';
import { auth } from '@/auth';
import { LoginForm } from '@/components/admin/login-form';
import { CodeIssueMark } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect('/admin');

  const [{ callbackUrl = '/admin' }, { i18n, lng }] = await Promise.all([
    searchParams,
    getT('common'),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.65fr)]">
      <section className="relative hidden overflow-hidden border-r border-border bg-surface-quiet p-10 lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(135,149,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(135,149,255,0.08)_1px,transparent_1px)] [background-size:4rem_4rem]"
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-signal">Codeissue / operator gate</span>
          <span>AUTH-01</span>
        </div>
        <div className="relative mt-auto max-w-4xl">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal">
            Private operations layer
          </p>
          <h1 className="mt-6 max-w-[10ch] text-[clamp(4rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
            One desk for every incoming issue.
          </h1>
          <div className="mt-10 grid max-w-2xl grid-cols-3 border-t border-l border-border">
            {['Identity', 'Workspace', 'Events'].map((item, index) => (
              <div key={item} className="border-r border-b border-border p-4">
                <span className="font-mono text-[0.56rem] text-signal">
                  0{index + 1}
                </span>
                <strong className="mt-4 block text-xs">{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-w-0 flex-col justify-center bg-surface px-5 py-10 sm:px-10 lg:px-[clamp(2.5rem,5vw,5rem)]">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-16 flex items-center gap-3">
            <span className="grid size-9 place-items-center border border-signal bg-signal text-primary-foreground [clip-path:polygon(0_0,76%_0,100%_24%,100%_100%,0_100%)]">
              <CodeIssueMark className="size-5" />
            </span>
            <span className="text-sm font-semibold">Codeissue OS</span>
          </div>
          <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-signal">
            {copy.auth.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[11ch] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
            {copy.auth.title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            {copy.auth.description}
          </p>
          <LoginForm copy={copy.auth} callbackUrl={callbackUrl} />
          {githubEnabled ? (
            <>
              <div className="my-5 flex items-center gap-3 text-[0.6rem] text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                <span>{copy.auth.or}</span>
              </div>
              <form action={authenticateWithGitHub}>
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <button
                  type="submit"
                  className="h-11 w-full rounded-md border border-border-strong text-sm font-semibold text-foreground transition-colors hover:border-signal hover:text-signal-soft"
                >
                  {copy.auth.github}
                </button>
              </form>
            </>
          ) : null}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-4 font-mono text-[0.58rem] text-muted-foreground">
            <Link href="/" className="hover:text-signal-soft">
              ← {copy.auth.back}
            </Link>
            <span className="text-right">{copy.auth.security}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
