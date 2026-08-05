import { AdminNav } from '@/components/admin/admin-nav';
import type { AdminNavigationItem } from '@/components/admin/admin-nav-types';
import { BrandLink } from '@/components/layout/brand-link';
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
      <BrandLink
        href="/admin"
        descriptor={copy.admin.workspace}
        className="h-16 border-b border-border px-4"
      />
      <AdminNav items={items} />
      <AdminAccount copy={copy.admin} user={user} />
    </aside>
  );
}
