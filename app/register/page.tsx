import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAccountHome } from '@/lib/auth/roles';
import { AuthRouteFooter, AuthShell, RegisterForm } from '@/features/auth';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(getAccountHome());

  const [{ callbackUrl = '/dashboard' }, { i18n, lng }] = await Promise.all([
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
      locale={toLocale(lng)}
      footer={
        <AuthRouteFooter
          backLabel={copy.auth.back}
          alternateHref={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          alternateLabel={copy.register.haveAccount}
        />
      }
    >
      <RegisterForm copy={copy.register} callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
