import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAccountHome, isAdminRole } from '@/lib/auth/roles';

export async function requireUser(callbackUrl = '/dashboard') {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (!isAdminRole(session.user.role)) {
    redirect(getAccountHome());
  }

  return session;
}

export async function getAdminSessionForApi() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) return null;
  return session;
}
