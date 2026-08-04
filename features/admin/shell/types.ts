import type { AdminNavigationItem } from '@/components/admin/admin-nav-types';
import type { Dictionary } from '@/lib/i18n';

export type AdminSessionUser = {
  name?: string | null;
  username?: string | null;
  role: keyof Dictionary['admin']['roles'];
};

export type AdminShellNavigationItem = AdminNavigationItem;
