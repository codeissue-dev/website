import type { UserRole } from '@/db/schema';

export const ADMIN_ROLE: UserRole = 'admin';
export const USER_ROLE: UserRole = 'user';

export function isAdminRole(role: UserRole | null | undefined) {
  return role === ADMIN_ROLE;
}

/**
 * Every signed-in account lands in the personal workspace. Administrative
 * tools are a separate privileged area, not a replacement for the account.
 */
export function getAccountHome() {
  return '/dashboard';
}
