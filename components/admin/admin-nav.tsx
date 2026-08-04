'use client';

import { usePathname } from 'next/navigation';

import { AdminNavItem } from './admin-nav-item';
import type { AdminNavigationItem } from './admin-nav-types';

export function AdminNav({ items }: { items: AdminNavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto p-2 lg:grid lg:overflow-visible lg:p-3"
      aria-label="Admin navigation"
    >
      {items.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return <AdminNavItem key={item.href} item={item} active={active} />;
      })}
    </nav>
  );
}
