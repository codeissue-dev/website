import type { ReactNode } from 'react';

import type { Dictionary, Locale } from '@/lib/i18n';

import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';

import type { AdminSessionUser, AdminShellNavigationItem } from './types';

export function AdminShell({
  children,
  copy,
  locale,
  user,
  items,
}: {
  children: ReactNode;
  copy: Dictionary;
  locale: Locale;
  user: AdminSessionUser;
  items: AdminShellNavigationItem[];
}) {
  return (
    <div className="min-h-screen bg-black text-foreground lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminSidebar copy={copy} user={user} items={items} />
      <div className="min-w-0">
        <AdminTopbar copy={copy} locale={locale} />
        <div className="mx-auto w-full max-w-[96rem] p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
