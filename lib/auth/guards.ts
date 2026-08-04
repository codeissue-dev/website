import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import type { UserRole } from '@/db/schema';

const adminRoles: UserRole[] = ['owner', 'admin', 'operator'];

export async function requireUser(callbackUrl = '/admin') {
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

  if (!adminRoles.includes(session.user.role)) {
    redirect('/?access=denied');
  }

  return session;
}

export async function getAdminSessionForApi() {
  const session = await auth();
  if (!session?.user || !adminRoles.includes(session.user.role)) return null;
  return session;
}
