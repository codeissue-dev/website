import type { ReactNode } from 'react';

import { DashboardShell } from '@/features/dashboard';
import { requireUser } from '@/lib/auth/guards';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, { i18n, lng }] = await Promise.all([
    requireUser('/dashboard'),
    getT('common'),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <DashboardShell copy={copy} locale={toLocale(lng)} user={session.user}>
      {children}
    </DashboardShell>
  );
}
