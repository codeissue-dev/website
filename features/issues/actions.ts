'use server';

import { redirect } from 'next/navigation';

import { db } from '@/db/client';
import { conversations, messages, orders } from '@/db/schema';
import { requireUser } from '@/lib/auth/guards';
import { parseIssueDraft } from '@/lib/issues/input';
import {
  ensureDefaultWorkspace,
  ensureWorkspaceMembership,
} from '@/lib/workspaces/service';

export type NewIssueState = { error?: string };

export async function createPublicIssue(
  _previousState: NewIssueState,
  formData: FormData,
): Promise<NewIssueState> {
  const session = await requireUser('/issues/new');
  let draft: ReturnType<typeof parseIssueDraft>;

  try {
    draft = parseIssueDraft({
      title: formData.get('title'),
      projectType: formData.get('projectType'),
      brief: formData.get('brief'),
      desiredOutcome: formData.get('desiredOutcome'),
      contactChannel: formData.get('contactChannel'),
      contactHandle: formData.get('contactHandle'),
      budgetRange: formData.get('budgetRange'),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'unknown' };
  }

  let issueId: string;

  try {
    const workspace = await ensureDefaultWorkspace();
    await ensureWorkspaceMembership(workspace.id, session.user.id);

    issueId = await db.transaction(async (tx) => {
      const [conversation] = await tx
        .insert(conversations)
        .values({
          workspaceId: workspace.id,
          subject: draft.title,
          status: 'open',
          unreadCount: 1,
          lastMessageAt: new Date(),
        })
        .returning({ id: conversations.id });

      if (!conversation) throw new Error('Conversation was not created.');

      const [issue] = await tx
        .insert(orders)
        .values({
          workspaceId: workspace.id,
          conversationId: conversation.id,
          requestedById: session.user.id,
          title: draft.title,
          status: 'lead',
          currency: 'USD',
          valueCents: null,
          summary: draft.brief,
          intake: {
            projectType: draft.projectType,
            desiredOutcome: draft.desiredOutcome,
            contactChannel: draft.contactChannel,
            contactHandle: draft.contactHandle,
            budgetRange: draft.budgetRange,
          },
        })
        .returning({ id: orders.id });

      if (!issue) throw new Error('Project request was not created.');

      await tx.insert(messages).values({
        conversationId: conversation.id,
        direction: 'inbound',
        authorName:
          session.user.name ?? session.user.username ?? 'project member',
        body: draft.brief,
        payload: {
          kind: 'project.intake',
          projectId: issue.id,
          desiredOutcome: draft.desiredOutcome,
        },
      });

      return issue.id;
    });
  } catch (error) {
    console.error('Project request could not be created.', error);
    return { error: 'service_unavailable' };
  }

  redirect(`/dashboard/projects/${issueId}`);
}
