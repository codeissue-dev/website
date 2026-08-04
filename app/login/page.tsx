import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { AuthRouteFooter, AuthShell, LoginForm } from '@/features/auth';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
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
      locale={toLocale(lng)}
      footer={
        <AuthRouteFooter
          backLabel={copy.auth.back}
          alternateHref={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          alternateLabel={copy.auth.createAccount}
        />
      }
    >
      <LoginForm copy={copy.auth} callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
