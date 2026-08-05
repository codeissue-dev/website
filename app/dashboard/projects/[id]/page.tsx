import { notFound } from 'next/navigation';

import { ProjectThread } from '@/features/dashboard';
import { requireUser } from '@/lib/auth/guards';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { getUserProject } from '@/lib/portal';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser(`/dashboard/projects/${id}`);
  const [{ i18n, lng }, project] = await Promise.all([
    getT('common'),
    getUserProject(session.user.id, id),
  ]);

  if (!project) notFound();
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return <ProjectThread project={project} copy={copy.dashboard} />;
}
