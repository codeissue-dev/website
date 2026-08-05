import Link from 'next/link';

import { ArrowUpRightIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Dictionary } from '@/lib/i18n';
import type { PortalProject } from '@/lib/portal';

export function ProjectList({
  projects,
  copy,
}: {
  projects: PortalProject[];
  copy: Dictionary['dashboard'];
}) {
  if (projects.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-base font-medium">{copy.emptyProjects}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {copy.emptyProjectsDescription}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/projects/${project.id}`}
          className="group"
        >
          <Card className="p-5 transition-[border-color,background-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-border-strong group-hover:bg-white/[0.025] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Badge className="capitalize">
                  {copy.statuses[project.status]}
                </Badge>
                <h3 className="mt-4 truncate text-lg font-semibold tracking-[-0.025em] sm:text-xl">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {project.summary ?? copy.noSummary}
                </p>
              </div>
              <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
