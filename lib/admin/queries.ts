import { desc, eq, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  contacts,
  conversations,
  integrationEvents,
  integrations,
  messages,
  orders,
  users,
} from '@/db/schema';
import { findWorkspaceBySlug } from '@/lib/workspaces/service';

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

export async function getConversations(
  limit = 24,
): Promise<DataResult<ConversationSummary[]>> {
  try {
    const workspace = await findWorkspaceBySlug();
    if (!workspace) return { data: fallbackConversations, fallback: true };

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
      .where(eq(conversations.workspaceId, workspace.id))
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
): Promise<DataResult<OrderSummary[]>> {
  try {
    const workspace = await findWorkspaceBySlug();
    if (!workspace) return { data: fallbackOrders, fallback: true };

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
      .where(eq(orders.workspaceId, workspace.id))
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

export async function getIntegrations(): Promise<
  DataResult<IntegrationSummary[]>
> {
  try {
    const workspace = await findWorkspaceBySlug();
    if (!workspace) return { data: fallbackIntegrations, fallback: true };

    const rows = await db
      .select()
      .from(integrations)
      .where(eq(integrations.workspaceId, workspace.id))
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
): Promise<DataResult<EventSummary[]>> {
  try {
    const workspace = await findWorkspaceBySlug();
    if (!workspace) return { data: fallbackEvents, fallback: true };

    const rows = await db
      .select()
      .from(integrationEvents)
      .where(eq(integrationEvents.workspaceId, workspace.id))
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
