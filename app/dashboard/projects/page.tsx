import { DashboardPageHeader, ProjectList } from '@/features/dashboard';
import { requireUser } from '@/lib/auth/guards';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { getUserProjects } from '@/lib/portal';

export default async function ProjectsPage() {
  const session = await requireUser('/dashboard/projects');
  const [{ i18n, lng }, projects] = await Promise.all([
    getT('common'),
    getUserProjects(session.user.id),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow={copy.dashboard.projectsEyebrow}
        title={copy.dashboard.projectsTitle}
        description={copy.dashboard.projectsDescription}
      />
      <ProjectList projects={projects} copy={copy.dashboard} />
    </div>
  );
}
