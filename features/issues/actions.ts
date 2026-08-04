'use server';

import { redirect } from 'next/navigation';

import { db } from '@/db/client';
import { orders } from '@/db/schema';
import { requireUser } from '@/lib/auth/guards';
import { parseIssueDraft } from '@/lib/issues/input';
import {
  ensureWorkspaceMembership,
  requireDefaultWorkspace,
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

  const workspace = await requireDefaultWorkspace();
  await ensureWorkspaceMembership(workspace.id, session.user.id);

  const [issue] = await db
    .insert(orders)
    .values({
      workspaceId: workspace.id,
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

  if (!issue) return { error: 'unknown' };
  redirect(`/issues/new?created=${issue.id}`);
}
