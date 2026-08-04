import Link from 'next/link';
import type { ReactNode } from 'react';

import { signOut } from '@/auth';
import { AdminLanguageSwitch } from '@/components/admin/admin-language-switch';
import { AdminNav } from '@/components/admin/admin-nav';
import { ArrowUpRightIcon, CodeIssueMark } from '@/components/icons';
import { requireAdmin } from '@/lib/auth/guards';
import type { Dictionary, Locale } from '@/lib/i18n';
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
  const nav = copy.admin.navigation;
  const items = [
    { href: '/admin', label: nav.overview, icon: 'overview' as const },
    { href: '/admin/inbox', label: nav.inbox, icon: 'inbox' as const },
    { href: '/admin/orders', label: nav.orders, icon: 'orders' as const },
    {
      href: '/admin/integrations',
      label: nav.integrations,
      icon: 'integrations' as const,
    },
    { href: '/admin/events', label: nav.events, icon: 'events' as const },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="brand__mark">
            <CodeIssueMark className="size-5" />
          </span>
          <span>
            <strong>{copy.admin.brand}</strong>
            <small>{copy.admin.workspace}</small>
          </span>
        </Link>

        <AdminNav items={items} />

        <div className="admin-sidebar__footer">
          <div className="admin-profile">
            <span>{session.user.name?.slice(0, 1).toUpperCase() ?? 'C'}</span>
            <div>
              <strong>{session.user.name ?? session.user.email}</strong>
              <small>{copy.admin.roles[session.user.role]}</small>
            </div>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button type="submit" className="admin-signout">
              {copy.admin.signOut}
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__status">
            <span />
            <strong>Codeissue</strong>
            <small>{copy.admin.topbar}</small>
          </div>
          <div className="admin-topbar__actions">
            <AdminLanguageSwitch locale={lng as Locale} />
            <Link href="/" target="_blank">
              {copy.admin.openWebsite}
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
