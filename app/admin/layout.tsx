import type { ReactNode } from 'react';

import { AdminShell } from '@/features/admin/shell';
import { requireAdmin } from '@/lib/auth/guards';
import { adminNavigation } from '@/lib/config/site';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, { i18n, lng }] = await Promise.all([
    requireAdmin(),
    getT('common'),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const labels = copy.admin.navigation;
  const items = adminNavigation.map((item) => ({
    ...item,
    label: labels[item.key],
  }));

  return (
    <AdminShell
      copy={copy}
      locale={toLocale(lng)}
      user={session.user}
      items={items}
    >
      {children}
    </AdminShell>
  );
}
