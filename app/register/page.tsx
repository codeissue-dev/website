import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect('/issues/new');

  const [{ callbackUrl = '/issues/new' }, { i18n, lng }] = await Promise.all([
    searchParams,
    getT('common'),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <AuthShell
      copy={copy}
      eyebrow={copy.register.eyebrow}
      title={copy.register.title}
      description={copy.register.description}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="hover:text-foreground">
            &lt;- {copy.auth.back}
          </Link>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="hover:text-foreground"
          >
            {copy.register.haveAccount}
          </Link>
        </div>
      }
    >
      <RegisterForm copy={copy.register} callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
