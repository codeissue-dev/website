'use server';

import { redirect } from 'next/navigation';

import { backendRequest } from '@/lib/backend/client';
import {
  formRequestId,
  websiteIdempotencyKey,
} from '@/lib/backend/idempotency';
import { requireUser } from '@/lib/auth/guards';
import { parseIssueDraft } from '@/lib/issues/input';

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
    const requestId = formRequestId(formData);
    const idempotencyKey = websiteIdempotencyKey(requestId);
    const result = await backendRequest<{ order: { id: string } }>(
      '/v1/intake/orders',
      {
        id: session.user.id,
        role: 'user',
        name: session.user.name ?? session.user.username,
      },
      {
        method: 'POST',
        headers: { 'idempotency-key': idempotencyKey },
        body: JSON.stringify({
          title: draft.title,
          summary: draft.brief,
          currency: 'USD',
          requester: {
            externalId: session.user.id,
            userId: session.user.id,
            displayName:
              session.user.name ?? session.user.username ?? 'project member',
          },
          thread: { subject: draft.title },
          initialMessage: {
            externalId: `website:${idempotencyKey}`,
            authorName:
              session.user.name ?? session.user.username ?? 'project member',
            body: draft.brief,
            payload: {
              kind: 'project.intake',
              desiredOutcome: draft.desiredOutcome,
            },
          },
          intake: {
            projectType: draft.projectType,
            desiredOutcome: draft.desiredOutcome,
            contactChannel: draft.contactChannel,
            contactHandle: draft.contactHandle,
            budgetRange: draft.budgetRange,
          },
        }),
      },
    );
    issueId = result.order.id;
  } catch (error) {
    console.error('Project request could not be created.', error);
    return { error: 'service_unavailable' };
  }

  redirect(`/dashboard/projects/${issueId}`);
}
