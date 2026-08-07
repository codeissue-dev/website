'use server';

import { revalidatePath } from 'next/cache';

import { backendRequest } from '@/lib/backend/client';
import {
  formRequestId,
  websiteIdempotencyKey,
} from '@/lib/backend/idempotency';
import { requireUser } from '@/lib/auth/guards';

export type ProjectMessageState = { error?: string; sent?: boolean };

export async function sendProjectMessage(
  projectId: string,
  _previousState: ProjectMessageState,
  formData: FormData,
): Promise<ProjectMessageState> {
  const session = await requireUser(`/dashboard/projects/${projectId}`);
  const body = String(formData.get('message') ?? '').trim();
  let externalMessageId: string;
  try {
    externalMessageId = websiteIdempotencyKey(formRequestId(formData));
  } catch {
    return { error: 'invalid_message' };
  }

  if (body.length < 1 || body.length > 5000) {
    return { error: 'invalid_message' };
  }

  try {
    const identity = {
      id: session.user.id,
      role: 'user' as const,
      name: session.user.name ?? session.user.username,
    };
    const { order } = await backendRequest<{
      order: { conversationId: string | null };
    }>(`/v1/orders/${encodeURIComponent(projectId)}`, identity);
    if (!order.conversationId) throw new Error('project_conversation_missing');

    await backendRequest(
      `/v1/conversations/${encodeURIComponent(order.conversationId)}/messages`,
      identity,
      {
        method: 'POST',
        body: JSON.stringify({
          externalMessageId,
          body,
        }),
      },
    );
  } catch (error) {
    console.error('Project message could not be sent.', error);
    return { error: 'service_unavailable' };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath('/dashboard/messages');
  return { sent: true };
}
