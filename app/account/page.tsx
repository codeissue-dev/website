import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function AccountPage() {
  const session = await auth();
  redirect(session?.user ? '/dashboard' : '/login?callbackUrl=/dashboard');
}
