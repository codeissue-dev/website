import { DashboardOverview } from '@/features/dashboard';
import { requireUser } from '@/lib/auth/guards';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { getUserProjects } from '@/lib/portal';

export default async function DashboardPage() {
  const session = await requireUser('/dashboard');
  const [{ i18n, lng }, projects] = await Promise.all([
    getT('common'),
    getUserProjects(session.user.id),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return <DashboardOverview projects={projects} copy={copy.dashboard} />;
}
