import Link from 'next/link';

import { cn } from '@/lib/utils';

import { AdminNavIcon } from './admin-nav-icon';
import type { AdminNavigationItem } from './admin-nav-types';

export function AdminNavItem({
  item,
  active,
}: {
  item: AdminNavigationItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group inline-flex min-h-10 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground lg:w-full',
        active && 'bg-white/[0.08] text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <AdminNavIcon name={item.icon} />
      <span>{item.label}</span>
      {active ? (
        <span className="ml-auto hidden size-1.5 rounded-full bg-signal lg:block" />
      ) : null}
    </Link>
  );
}
