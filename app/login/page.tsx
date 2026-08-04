import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/admin/login-form';
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

  return (
    <AuthShell
      copy={copy}
      eyebrow={copy.auth.eyebrow}
      title={copy.auth.title}
      description={copy.auth.description}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="hover:text-foreground">
            &lt;- {copy.auth.back}
          </Link>
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="hover:text-foreground"
          >
            {copy.auth.createAccount}
          </Link>
        </div>
      }
    >
      <LoginForm copy={copy.auth} callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
