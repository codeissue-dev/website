import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { CodeIssueMark } from '@/components/icons';
import { authenticateWithGitHub } from '@/app/login/actions';
import { LoginForm } from '@/components/admin/login-form';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
    <main className="login-page">
      <div className="login-page__grid" aria-hidden="true" />
      <section className="login-card">
        <div className="login-card__brand">
          <span className="brand__mark">
            <CodeIssueMark className="size-5" />
          </span>
          <span>Codeissue OS</span>
        </div>
        <p className="eyebrow">{copy.auth.eyebrow}</p>
        <h1>{copy.auth.title}</h1>
        <p className="login-card__description">{copy.auth.description}</p>
        <LoginForm copy={copy.auth} callbackUrl={callbackUrl} />
        {githubEnabled ? (
          <>
            <div className="login-divider">
              <span>{copy.auth.or}</span>
            </div>
            <form action={authenticateWithGitHub}>
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <button type="submit" className="login-oauth">
                {copy.auth.github}
              </button>
            </form>
          </>
        ) : null}
        <div className="login-card__footer">
          <Link href="/">← {copy.auth.back}</Link>
          <span>{copy.auth.security}</span>
        </div>
      </section>
    </main>
  );
}
