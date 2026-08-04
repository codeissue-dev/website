import Link from 'next/link';

import { AdminNav } from '@/components/admin/admin-nav';
import type { AdminNavigationItem } from '@/components/admin/admin-nav-types';
import { BrandLogo } from '@/components/brand/brand-logo';
import type { Dictionary } from '@/lib/i18n';

import { AdminAccount } from './admin-account';
import type { AdminSessionUser } from './types';

export function AdminSidebar({
  copy,
  user,
  items,
}: {
  copy: Dictionary;
  user: AdminSessionUser;
  items: AdminNavigationItem[];
}) {
  return (
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
      <AdminAccount copy={copy.admin} user={user} />
    </aside>
  );
}
