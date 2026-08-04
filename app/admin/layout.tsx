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
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="relative z-40 border-b border-border bg-surface-quiet lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0">
        <Link
          href="/admin"
          className="flex min-h-16 items-center gap-3 border-b border-border px-4 lg:min-h-[4.75rem]"
        >
          <span className="grid size-9 place-items-center border border-signal bg-signal text-primary-foreground [clip-path:polygon(0_0,76%_0,100%_24%,100%_100%,0_100%)]">
            <CodeIssueMark className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <strong className="text-sm font-semibold">
              {copy.admin.brand}
            </strong>
            <small className="truncate font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
              {copy.admin.workspace}
            </small>
          </span>
        </Link>

        <AdminNav items={items} />

        <div className="hidden mt-auto border-t border-border p-4 lg:grid lg:gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface font-mono text-xs text-signal">
              {session.user.name?.slice(0, 1).toUpperCase() ?? 'C'}
            </span>
            <div className="flex min-w-0 flex-col">
              <strong className="truncate text-xs">
                {session.user.name ?? session.user.email}
              </strong>
              <small className="truncate text-[0.65rem] text-muted-foreground">
                {copy.admin.roles[session.user.role]}
              </small>
            </div>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="h-9 w-full border border-border font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-danger hover:text-danger"
            >
              {copy.admin.signOut}
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:min-h-[4.75rem] lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="size-2 rounded-full bg-positive" />
            <strong className="text-xs">Codeissue</strong>
            <small className="hidden truncate font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground sm:block">
              {copy.admin.topbar}
            </small>
          </div>
          <div className="flex items-center gap-3">
            <AdminLanguageSwitch locale={lng as Locale} />
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-signal-soft"
            >
              <span className="hidden sm:inline">{copy.admin.openWebsite}</span>
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">{children}</div>
      </div>
    </div>
  );
}
