import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Panel, PanelHeader } from '@/components/ui/panel';
import type { Dictionary } from '@/lib/i18n';
import type { PortalProject } from '@/lib/portal';

import { DashboardPageHeader } from './dashboard-page-header';
import { ProjectList } from './project-list';

export function DashboardOverview({
  projects,
  copy,
}: {
  projects: PortalProject[];
  copy: Dictionary['dashboard'];
}) {
  const activeCount = projects.filter(
    (project) => !['completed', 'cancelled'].includes(project.status),
  ).length;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
          <Link href="/issues/new" className={buttonVariants({ size: 'lg' })}>
            {copy.newProject}
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [copy.metrics.projects, projects.length],
          [copy.metrics.active, activeCount],
          [
            copy.metrics.messages,
            projects.filter((project) => project.conversationId).length,
          ],
        ].map(([label, value]) => (
          <Panel key={String(label)} className="p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {value}
            </p>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelHeader
          eyebrow={copy.projectsEyebrow}
          title={copy.recentProjects}
          action={
            <Link
              href="/dashboard/projects"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {copy.viewAll}
            </Link>
          }
        />
        <div className="p-4 sm:p-5">
          <ProjectList projects={projects.slice(0, 4)} copy={copy} />
        </div>
      </Panel>
    </div>
  );
}
