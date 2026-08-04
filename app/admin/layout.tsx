import Link from 'next/link';
import type { ReactNode } from 'react';

import { signOut } from '@/auth';
import { AdminLanguageSwitch } from '@/components/admin/admin-language-switch';
import { AdminNav } from '@/components/admin/admin-nav';
import { BrandLogo } from '@/components/brand/brand-logo';
import { ArrowUpRightIcon } from '@/components/icons';
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
    <div className="min-h-screen bg-black text-foreground lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="relative z-40 border-b border-border bg-card/80 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0">
        <Link
          href="/admin"
          className="flex h-16 items-center gap-2.5 border-b border-border px-4"
        >
          <BrandLogo className="size-8" priority />
          <span className="min-w-0">
            <strong className="block text-sm font-semibold">
              {copy.admin.brand}
            </strong>
            <small className="block truncate text-sm text-muted-foreground">
              {copy.admin.workspace}
            </small>
          </span>
        </Link>

        <AdminNav items={items} />

        <div className="mt-auto hidden border-t border-border p-3 lg:grid lg:gap-3">
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-black/40 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-black">
              {session.user.name?.slice(0, 1).toUpperCase() ?? 'C'}
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-sm">
                {session.user.name ?? session.user.username}
              </strong>
              <small className="block truncate text-sm text-muted-foreground">
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
              className="h-9 w-full rounded-md px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
            >
              {copy.admin.signOut}
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-black/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 text-sm">
            <span className="size-1.5 rounded-full bg-positive" />
            <strong>Codeissue</strong>
            <span className="text-muted-foreground">/</span>
            <span className="hidden truncate text-muted-foreground sm:block">
              {copy.admin.topbar}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AdminLanguageSwitch locale={lng as Locale} />
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              <span className="hidden sm:inline">{copy.admin.openWebsite}</span>
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[96rem] p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
