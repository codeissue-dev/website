import { eq, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  contacts,
  conversations,
  integrationEvents,
  integrations,
  messages,
} from '@/db/schema';
import { requireDefaultWorkspace } from '@/lib/workspaces/service';

import type { NormalizedMessageEvent } from './contracts';
import { providerLabel } from './request';

type IngestInput = {
  provider: string;
  payload: Record<string, unknown>;
  normalized: NormalizedMessageEvent | null;
  externalEventId?: string | null;
  eventType?: string | null;
};

function normalizedIdentifier(value: unknown, fallback: string) {
  return (
    String(value ?? fallback)
      .trim()
      .slice(0, 200) || fallback
  );
}

export async function ingestIntegrationEvent(input: IngestInput) {
  const workspace = await requireDefaultWorkspace();

  return db.transaction(async (tx) => {
    const now = new Date();
    const [integration] = await tx
      .insert(integrations)
      .values({
        workspaceId: workspace.id,
        provider: input.provider,
        displayName: providerLabel(input.provider),
        status: 'connected',
        lastEventAt: now,
      })
      .onConflictDoUpdate({
        target: [integrations.workspaceId, integrations.provider],
        set: { status: 'connected', lastEventAt: now, updatedAt: now },
      })
      .returning({ id: integrations.id });

    const fallbackId = crypto.randomUUID();
    const externalEventId = normalizedIdentifier(
      input.normalized?.eventId ?? input.externalEventId ?? input.payload.id,
      fallbackId,
    );
    const eventType = normalizedIdentifier(
      input.normalized?.eventType ?? input.eventType ?? input.payload.type,
      'event.received',
    );

    const [event] = await tx
      .insert(integrationEvents)
      .values({
        workspaceId: workspace.id,
        integrationId: integration.id,
        source: input.provider,
        eventType,
        externalEventId,
        payload: input.payload,
      })
      .onConflictDoNothing()
      .returning({ id: integrationEvents.id });

    if (!event) {
      return { duplicate: true, eventId: null, conversationId: null };
    }

    if (!input.normalized) {
      return { duplicate: false, eventId: event.id, conversationId: null };
    }

    const normalized = input.normalized;
    const [contact] = await tx
      .insert(contacts)
      .values({
        workspaceId: workspace.id,
        integrationId: integration.id,
        externalId: normalized.contact.externalId,
        displayName: normalized.contact.displayName,
        email: normalized.contact.email,
        avatarUrl: normalized.contact.avatarUrl,
        metadata: { provider: input.provider },
      })
      .onConflictDoUpdate({
        target: [contacts.integrationId, contacts.externalId],
        set: {
          displayName: normalized.contact.displayName,
          email: normalized.contact.email,
          avatarUrl: normalized.contact.avatarUrl,
          updatedAt: now,
        },
      })
      .returning({ id: contacts.id });

    const [conversation] = await tx
      .insert(conversations)
      .values({
        workspaceId: workspace.id,
        integrationId: integration.id,
        contactId: contact.id,
        externalThreadId: normalized.thread.externalId,
        subject: normalized.thread.subject,
        unreadCount: 0,
        lastMessageAt: normalized.occurredAt,
      })
      .onConflictDoUpdate({
        target: [conversations.integrationId, conversations.externalThreadId],
        set: {
          contactId: contact.id,
          subject: normalized.thread.subject,
          unreadCount: sql`${conversations.unreadCount}`,
          lastMessageAt: normalized.occurredAt,
          updatedAt: now,
        },
      })
      .returning({ id: conversations.id });

    const [insertedMessage] = await tx
      .insert(messages)
      .values({
        conversationId: conversation.id,
        externalMessageId: normalized.message.externalId,
        direction: normalized.message.direction,
        authorName:
          normalized.message.authorName ?? normalized.contact.displayName,
        body: normalized.message.text,
        payload: normalized.raw,
        sentAt: normalized.occurredAt,
      })
      .onConflictDoNothing()
      .returning({ id: messages.id });

    if (insertedMessage && normalized.message.direction === 'inbound') {
      await tx
        .update(conversations)
        .set({
          unreadCount: sql`${conversations.unreadCount} + 1`,
          updatedAt: now,
        })
        .where(eq(conversations.id, conversation.id));
    }

    await tx
      .update(integrationEvents)
      .set({ status: 'processed', processedAt: now })
      .where(eq(integrationEvents.id, event.id));

    return {
      duplicate: false,
      eventId: event.id,
      conversationId: conversation.id,
    };
  });
}
