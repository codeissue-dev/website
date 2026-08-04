import { timingSafeEqual } from 'node:crypto';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  contacts,
  conversations,
  integrationEvents,
  integrations,
  messages,
  workspaces,
} from '@/db/schema';
import { parseNormalizedMessageEvent } from '@/lib/integrations/contracts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const maxPayloadBytes = 1_000_000;

type RouteContext = { params: Promise<{ provider: string }> };

function secretsMatch(received: string | null, expected: string) {
  if (!received) return false;
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

function providerLabel(provider: string) {
  return provider
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function POST(request: Request, context: RouteContext) {
  const expectedSecret = process.env.INTEGRATION_WEBHOOK_SECRET;
  if (!expectedSecret) {
    return Response.json(
      { error: 'Webhook ingestion is not configured.' },
      { status: 503 },
    );
  }

  if (
    !secretsMatch(
      request.headers.get('x-codeissue-webhook-secret'),
      expectedSecret,
    )
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { provider } = await context.params;
  if (!/^[a-z0-9_-]{2,40}$/.test(provider)) {
    return Response.json({ error: 'Invalid provider.' }, { status: 400 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxPayloadBytes) {
    return Response.json({ error: 'Payload too large.' }, { status: 413 });
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return Response.json(
      { error: 'Could not read request body.' },
      { status: 400 },
    );
  }
  if (new TextEncoder().encode(body).byteLength > maxPayloadBytes) {
    return Response.json({ error: 'Payload too large.' }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Expected an object.');
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Expected a JSON object.' }, { status: 400 });
  }

  let normalized: ReturnType<typeof parseNormalizedMessageEvent>;
  try {
    normalized = parseNormalizedMessageEvent(payload);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Invalid normalized event payload.',
      },
      { status: 400 },
    );
  }

  try {
    const [workspace] = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, 'codeissue'))
      .limit(1);

    if (!workspace) {
      return Response.json({ error: 'Workspace not found.' }, { status: 503 });
    }

    const result = await db.transaction(async (tx) => {
      const [integration] = await tx
        .insert(integrations)
        .values({
          workspaceId: workspace.id,
          provider,
          displayName: providerLabel(provider),
          status: 'connected',
          lastEventAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [integrations.workspaceId, integrations.provider],
          set: {
            status: 'connected',
            lastEventAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .returning({ id: integrations.id });

      const rawExternalEventId =
        normalized?.eventId ??
        request.headers.get('x-event-id') ??
        (typeof payload.id === 'string' ? payload.id : crypto.randomUUID());
      const externalEventId =
        String(rawExternalEventId).trim().slice(0, 200) || crypto.randomUUID();
      const rawEventType =
        normalized?.eventType ??
        request.headers.get('x-event-type') ??
        (typeof payload.type === 'string' ? payload.type : 'event.received');
      const eventType =
        String(rawEventType).trim().slice(0, 200) || 'event.received';

      const [event] = await tx
        .insert(integrationEvents)
        .values({
          workspaceId: workspace.id,
          integrationId: integration.id,
          source: provider,
          eventType,
          externalEventId,
          payload,
        })
        .onConflictDoNothing()
        .returning({ id: integrationEvents.id });

      if (!event) {
        return { duplicate: true, eventId: null, conversationId: null };
      }

      if (!normalized) {
        return { duplicate: false, eventId: event.id, conversationId: null };
      }

      const [contact] = await tx
        .insert(contacts)
        .values({
          workspaceId: workspace.id,
          integrationId: integration.id,
          externalId: normalized.contact.externalId,
          displayName: normalized.contact.displayName,
          email: normalized.contact.email,
          avatarUrl: normalized.contact.avatarUrl,
          metadata: { provider },
        })
        .onConflictDoUpdate({
          target: [contacts.integrationId, contacts.externalId],
          set: {
            displayName: normalized.contact.displayName,
            email: normalized.contact.email,
            avatarUrl: normalized.contact.avatarUrl,
            updatedAt: new Date(),
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
            updatedAt: new Date(),
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
            updatedAt: new Date(),
          })
          .where(eq(conversations.id, conversation.id));
      }

      await tx
        .update(integrationEvents)
        .set({ status: 'processed', processedAt: new Date() })
        .where(eq(integrationEvents.id, event.id));

      return {
        duplicate: false,
        eventId: event.id,
        conversationId: conversation.id,
      };
    });

    return Response.json(
      { accepted: true, normalized: Boolean(normalized), ...result },
      { status: 202 },
    );
  } catch {
    return Response.json(
      { error: 'Event could not be persisted.' },
      { status: 503 },
    );
  }
}
