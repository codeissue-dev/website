import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { NewIssueScreen } from '@/features/issues';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

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
    <NewIssueScreen
      copy={copy}
      username={session.user.username ?? 'user'}
      created={created}
      locale={toLocale(lng)}
    />
  );
}
