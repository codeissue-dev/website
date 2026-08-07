import { auth } from '@/auth';
import { backendRequest, type BackendIdentity } from '@/lib/backend/client';
import { isAdminRole } from '@/lib/auth/roles';

import {
  fallbackConversations,
  fallbackEvents,
  fallbackIntegrations,
  fallbackOrders,
} from './fallback-data';
import type {
  ConversationSummary,
  DataResult,
  EventSummary,
  IntegrationSummary,
  OrderSummary,
} from './types';

type BackendConversation = ConversationSummary & {
  source: string;
};
type BackendOrder = OrderSummary & {
  source: string;
  externalOrderId: string | null;
  createdAt: string;
};

function fallbackData<T>(demo: T[], error: unknown): DataResult<T[]> {
  console.error('Backend admin query failed.', error);
  return {
    data: process.env.ADMIN_DEMO_FALLBACK === 'true' ? demo : [],
    fallback: true,
  };
}

async function adminIdentity(): Promise<BackendIdentity> {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error('Administrator session is required.');
  }
  return {
    id: session.user.id,
    role: 'admin',
    name: session.user.name ?? session.user.username,
  };
}

export async function getConversations(
  limit = 24,
): Promise<DataResult<ConversationSummary[]>> {
  try {
    const user = await adminIdentity();
    const result = await backendRequest<{
      conversations: BackendConversation[];
    }>(`/v1/conversations?limit=${encodeURIComponent(limit)}`, user);
    return { data: result.conversations, fallback: false };
  } catch (error) {
    return fallbackData(fallbackConversations, error);
  }
}

export async function getOrders(
  limit = 24,
): Promise<DataResult<OrderSummary[]>> {
  try {
    const user = await adminIdentity();
    const result = await backendRequest<{ orders: BackendOrder[] }>(
      `/v1/orders?limit=${encodeURIComponent(limit)}`,
      user,
    );
    return {
      fallback: false,
      data: result.orders.map(
        ({ id, title, status, owner, currency, valueCents, updatedAt }) => ({
          id,
          title,
          status,
          owner,
          currency,
          valueCents,
          updatedAt,
        }),
      ),
    };
  } catch (error) {
    return fallbackData(fallbackOrders, error);
  }
}

export async function getIntegrations(): Promise<
  DataResult<IntegrationSummary[]>
> {
  try {
    const user = await adminIdentity();
    const result = await backendRequest<{ integrations: IntegrationSummary[] }>(
      '/v1/integrations',
      user,
    );
    return { data: result.integrations, fallback: false };
  } catch (error) {
    return fallbackData(fallbackIntegrations, error);
  }
}

export async function getEvents(
  limit = 100,
): Promise<DataResult<EventSummary[]>> {
  try {
    const user = await adminIdentity();
    const result = await backendRequest<{ events: EventSummary[] }>(
      `/v1/events?limit=${encodeURIComponent(limit)}`,
      user,
    );
    return { data: result.events, fallback: false };
  } catch (error) {
    return fallbackData(fallbackEvents, error);
  }
}
