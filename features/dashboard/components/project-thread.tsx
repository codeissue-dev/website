import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import type { Dictionary } from '@/lib/i18n';
import type { PortalProjectDetail } from '@/lib/portal';

import { ProjectMessageForm } from './project-message-form';

export function ProjectThread({
  project,
  copy,
}: {
  project: PortalProjectDetail;
  copy: Dictionary['dashboard'];
}) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/projects"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {copy.backToProjects}
        </Link>
        <div className="mt-4 flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge className="capitalize">
              {copy.statuses[project.status]}
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {project.summary ?? copy.noSummary}
            </p>
          </div>
        </div>
      </div>

      <Panel className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-medium">{copy.discussion}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.discussionDescription}
          </p>
        </div>
        <div className="max-h-[32rem] space-y-4 overflow-y-auto p-4 sm:p-5">
          {project.messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {copy.emptyMessages}
            </p>
          ) : (
            project.messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.direction === 'outbound'
                    ? 'ml-auto max-w-2xl rounded-xl bg-white p-4 text-black'
                    : 'max-w-2xl rounded-xl border border-border bg-white/[0.025] p-4'
                }
              >
                <div className="flex items-center justify-between gap-4 text-sm">
                  <strong>{message.authorName ?? copy.system}</strong>
                  <time className="text-current/60">
                    {new Date(message.sentAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {message.body}
                </p>
              </article>
            ))
          )}
        </div>
        <ProjectMessageForm projectId={project.id} copy={copy} />
      </Panel>
    </div>
  );
}
