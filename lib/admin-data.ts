import { desc, eq, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import type { IntegrationStatus, OrderStatus } from '@/db/schema';
import {
  contacts,
  conversations,
  integrationEvents,
  integrations,
  messages,
  orders,
  users,
  workspaces,
} from '@/db/schema';

export type ConversationSummary = {
  id: string;
  source: string;
  contact: string;
  subject: string;
  preview: string;
  unreadCount: number;
  status: string;
  assignedTo: string | null;
  lastMessageAt: string;
};

export type OrderSummary = {
  id: string;
  title: string;
  status: OrderStatus;
  owner: string | null;
  currency: string;
  valueCents: number | null;
  updatedAt: string;
};

export type IntegrationSummary = {
  id: string;
  provider: string;
  displayName: string;
  status: IntegrationStatus;
  externalAccountId: string | null;
  lastEventAt: string | null;
};

export type EventSummary = {
  id: string;
  source: string;
  eventType: string;
  status: string;
  payload: Record<string, unknown>;
  receivedAt: string;
};

const now = Date.now();

export const fallbackConversations: ConversationSummary[] = [
  {
    id: 'demo-conversation-1',
    source: 'telegram',
    contact: 'Alex Morgan',
    subject: 'AI-assisted customer portal',
    preview: 'Can the first version be ready for internal review this month?',
    unreadCount: 2,
    status: 'open',
    assignedTo: 'Codeissue Admin',
    lastMessageAt: new Date(now - 7 * 60_000).toISOString(),
  },
  {
    id: 'demo-conversation-2',
    source: 'discord',
    contact: 'northstar',
    subject: 'Marketplace MVP estimate',
    preview: 'I have the user flows and a rough data model ready.',
    unreadCount: 1,
    status: 'pending',
    assignedTo: null,
    lastMessageAt: new Date(now - 42 * 60_000).toISOString(),
  },
  {
    id: 'demo-conversation-3',
    source: 'email',
    contact: 'Mira Studio',
    subject: 'Internal automation system',
    preview: 'Sharing the updated scope and access requirements.',
    unreadCount: 0,
    status: 'open',
    assignedTo: 'Codeissue Admin',
    lastMessageAt: new Date(now - 3 * 60 * 60_000).toISOString(),
  },
];

export const fallbackOrders: OrderSummary[] = [
  {
    id: 'demo-order-1',
    title: 'Customer operations portal',
    status: 'discovery',
    owner: 'Codeissue Admin',
    currency: 'USD',
    valueCents: 1_800_000,
    updatedAt: new Date(now - 18 * 60_000).toISOString(),
  },
  {
    id: 'demo-order-2',
    title: 'Creator marketplace MVP',
    status: 'proposal',
    owner: null,
    currency: 'USD',
    valueCents: 2_400_000,
    updatedAt: new Date(now - 2 * 60 * 60_000).toISOString(),
  },
  {
    id: 'demo-order-3',
    title: 'Operations automation layer',
    status: 'active',
    owner: 'Codeissue Admin',
    currency: 'EUR',
    valueCents: 3_200_000,
    updatedAt: new Date(now - 5 * 60 * 60_000).toISOString(),
  },
];

export const fallbackIntegrations: IntegrationSummary[] = [
  {
    id: 'telegram',
    provider: 'telegram',
    displayName: 'Telegram',
    status: 'connected',
    externalAccountId: '@codeissue_dev',
    lastEventAt: new Date(now - 7 * 60_000).toISOString(),
  },
  {
    id: 'discord',
    provider: 'discord',
    displayName: 'Discord',
    status: 'connected',
    externalAccountId: 'discord.gg/codeissue',
    lastEventAt: new Date(now - 22 * 60_000).toISOString(),
  },
  {
    id: 'email',
    provider: 'email',
    displayName: 'Outlook',
    status: 'planned',
    externalAccountId: 'codeissue@outlook.com',
    lastEventAt: null,
  },
  {
    id: 'instagram',
    provider: 'instagram',
    displayName: 'Instagram',
    status: 'planned',
    externalAccountId: '@codeissue.dev',
    lastEventAt: null,
  },
];

export const fallbackEvents: EventSummary[] = [
  {
    id: 'demo-event-1',
    source: 'telegram',
    eventType: 'message.received',
    status: 'processed',
    payload: {
      author: '@alexbuilds',
      conversation: 'AI-assisted customer portal',
    },
    receivedAt: new Date(now - 7 * 60_000).toISOString(),
  },
  {
    id: 'demo-event-2',
    source: 'backend-api',
    eventType: 'order.status_changed',
    status: 'processed',
    payload: { order: 'Operations automation layer', status: 'active' },
    receivedAt: new Date(now - 28 * 60_000).toISOString(),
  },
];

async function firstWorkspaceId() {
  const [workspace] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.slug, 'codeissue'))
    .limit(1);

  return workspace?.id;
}

export async function getConversations(
  limit = 24,
): Promise<{ data: ConversationSummary[]; fallback: boolean }> {
  try {
    const workspaceId = await firstWorkspaceId();
    if (!workspaceId) return { data: fallbackConversations, fallback: true };

    const rows = await db
      .select({
        id: conversations.id,
        source: integrations.provider,
        contact: contacts.displayName,
        subject: conversations.subject,
        unreadCount: conversations.unreadCount,
        status: conversations.status,
        assignedTo: users.name,
        lastMessageAt: conversations.lastMessageAt,
      })
      .from(conversations)
      .leftJoin(integrations, eq(conversations.integrationId, integrations.id))
      .leftJoin(contacts, eq(conversations.contactId, contacts.id))
      .leftJoin(users, eq(conversations.assignedToId, users.id))
      .where(eq(conversations.workspaceId, workspaceId))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit);

    const ids = rows.map((row) => row.id);
    const latestMessages = ids.length
      ? await db
          .select({
            conversationId: messages.conversationId,
            body: messages.body,
            sentAt: messages.sentAt,
          })
          .from(messages)
          .where(inArray(messages.conversationId, ids))
          .orderBy(desc(messages.sentAt))
      : [];

    const previewByConversation = new Map<string, string>();
    for (const message of latestMessages) {
      if (!previewByConversation.has(message.conversationId)) {
        previewByConversation.set(message.conversationId, message.body);
      }
    }

    return {
      fallback: false,
      data: rows.map((row) => ({
        id: row.id,
        source: row.source ?? 'api',
        contact: row.contact ?? 'Unknown contact',
        subject: row.subject,
        preview: previewByConversation.get(row.id) ?? '',
        unreadCount: row.unreadCount,
        status: row.status,
        assignedTo: row.assignedTo,
        lastMessageAt: row.lastMessageAt.toISOString(),
      })),
    };
  } catch {
    return { data: fallbackConversations, fallback: true };
  }
}

export async function getOrders(
  limit = 24,
): Promise<{ data: OrderSummary[]; fallback: boolean }> {
  try {
    const workspaceId = await firstWorkspaceId();
    if (!workspaceId) return { data: fallbackOrders, fallback: true };

    const rows = await db
      .select({
        id: orders.id,
        title: orders.title,
        status: orders.status,
        owner: users.name,
        currency: orders.currency,
        valueCents: orders.valueCents,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.ownerId, users.id))
      .where(eq(orders.workspaceId, workspaceId))
      .orderBy(desc(orders.updatedAt))
      .limit(limit);

    return {
      fallback: false,
      data: rows.map((row) => ({
        ...row,
        updatedAt: row.updatedAt.toISOString(),
      })),
    };
  } catch {
    return { data: fallbackOrders, fallback: true };
  }
}

export async function getIntegrations(): Promise<{
  data: IntegrationSummary[];
  fallback: boolean;
}> {
  try {
    const workspaceId = await firstWorkspaceId();
    if (!workspaceId) return { data: fallbackIntegrations, fallback: true };

    const rows = await db
      .select()
      .from(integrations)
      .where(eq(integrations.workspaceId, workspaceId))
      .orderBy(integrations.displayName);

    return {
      fallback: false,
      data: rows.map((row) => ({
        id: row.id,
        provider: row.provider,
        displayName: row.displayName,
        status: row.status,
        externalAccountId: row.externalAccountId,
        lastEventAt: row.lastEventAt?.toISOString() ?? null,
      })),
    };
  } catch {
    return { data: fallbackIntegrations, fallback: true };
  }
}

export async function getEvents(
  limit = 100,
): Promise<{ data: EventSummary[]; fallback: boolean }> {
  try {
    const workspaceId = await firstWorkspaceId();
    if (!workspaceId) return { data: fallbackEvents, fallback: true };

    const rows = await db
      .select()
      .from(integrationEvents)
      .where(eq(integrationEvents.workspaceId, workspaceId))
      .orderBy(desc(integrationEvents.receivedAt))
      .limit(limit);

    return {
      fallback: false,
      data: rows.map((row) => ({
        id: row.id,
        source: row.source,
        eventType: row.eventType,
        status: row.status,
        payload: row.payload,
        receivedAt: row.receivedAt.toISOString(),
      })),
    };
  } catch {
    return { data: fallbackEvents, fallback: true };
  }
}

export async function getOverview() {
  const [conversationResult, orderResult, integrationResult, eventResult] =
    await Promise.all([
      getConversations(6),
      getOrders(6),
      getIntegrations(),
      getEvents(12),
    ]);

  return {
    fallback:
      conversationResult.fallback ||
      orderResult.fallback ||
      integrationResult.fallback ||
      eventResult.fallback,
    metrics: {
      openConversations: conversationResult.data.filter(
        (item) => item.status !== 'resolved' && item.status !== 'archived',
      ).length,
      activeOrders: orderResult.data.filter(
        (item) => item.status !== 'completed' && item.status !== 'cancelled',
      ).length,
      connectedSources: integrationResult.data.filter(
        (item) => item.status === 'connected',
      ).length,
      eventsToday: eventResult.data.filter(
        (item) => Date.now() - new Date(item.receivedAt).getTime() < 86_400_000,
      ).length,
    },
    conversations: conversationResult.data,
    orders: orderResult.data,
    integrations: integrationResult.data,
    events: eventResult.data,
  };
}
