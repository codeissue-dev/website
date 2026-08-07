import { BackendApiError, backendRequest } from '@/lib/backend/client';

import type { PortalProject, PortalProjectDetail } from './types';

type BackendOrder = PortalProject & {
  source: string;
  messages?: never;
};

type BackendConversation = {
  messages?: Array<{
    id: string;
    authorName: string | null;
    body: string;
    direction: 'inbound' | 'outbound' | 'internal';
    sentAt: string;
  }>;
};

function userIdentity(userId: string) {
  return { id: userId, role: 'user' as const };
}

export async function getUserProjects(userId: string, limit = 24) {
  const result = await backendRequest<{ orders: BackendOrder[] }>(
    `/v1/orders?limit=${encodeURIComponent(limit)}`,
    userIdentity(userId),
  );
  return result.orders.map(
    ({ id, title, status, summary, updatedAt, conversationId }) => ({
      id,
      title,
      status,
      summary,
      updatedAt,
      conversationId,
    }),
  );
}

export async function getUserProject(
  userId: string,
  projectId: string,
): Promise<PortalProjectDetail | null> {
  try {
    const user = userIdentity(userId);
    const { order } = await backendRequest<{ order: BackendOrder }>(
      `/v1/orders/${encodeURIComponent(projectId)}`,
      user,
    );
    const conversation = order.conversationId
      ? (
          await backendRequest<{ conversation: BackendConversation }>(
            `/v1/conversations/${encodeURIComponent(order.conversationId)}`,
            user,
          )
        ).conversation
      : null;
    return {
      id: order.id,
      title: order.title,
      status: order.status,
      summary: order.summary,
      updatedAt: order.updatedAt,
      conversationId: order.conversationId,
      messages: conversation?.messages ?? [],
    };
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
