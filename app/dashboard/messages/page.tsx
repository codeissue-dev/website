import { DashboardPageHeader, ProjectList } from '@/features/dashboard';
import { requireUser } from '@/lib/auth/guards';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { getUserProjects } from '@/lib/portal';

export default async function MessagesPage() {
  const session = await requireUser('/dashboard/messages');
  const [{ i18n, lng }, projects] = await Promise.all([
    getT('common'),
    getUserProjects(session.user.id),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const projectsWithThreads = projects.filter(
    (project) => project.conversationId,
  );

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow={copy.dashboard.messagesEyebrow}
        title={copy.dashboard.messagesTitle}
        description={copy.dashboard.messagesDescription}
      />
      <ProjectList projects={projectsWithThreads} copy={copy.dashboard} />
    </div>
  );
}
