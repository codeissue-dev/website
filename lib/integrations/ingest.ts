import { createHash } from 'node:crypto';

import { telegramBackendRequest } from '@/lib/backend/client';

import type { NormalizedMessageEvent } from './contracts';

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(object[key])}`)
    .join(',')}}`;
}

function fallbackEventKey(provider: string, payload: Record<string, unknown>) {
  return `${provider}:${createHash('sha256')
    .update(canonicalJson(payload))
    .digest('hex')}`;
}

type IngestInput = {
  provider: string;
  payload: Record<string, unknown>;
  normalized: NormalizedMessageEvent | null;
  externalEventId?: string | null;
  eventType?: string | null;
};

export async function ingestIntegrationEvent(input: IngestInput) {
  if (input.provider !== 'telegram') {
    throw new Error('Only the telegram provider is supported by this pool.');
  }
  if (!input.normalized) {
    return {
      duplicate: false,
      ignored: true,
      eventId: input.externalEventId ?? null,
      conversationId: null,
    };
  }

  const normalized = input.normalized;
  const result = await telegramBackendRequest<{
    conversation: { id: string };
    message: { id: string } | null;
    duplicate: boolean;
  }>('/v1/intake/messages', {
    method: 'POST',
    headers: {
      'idempotency-key':
        normalized.eventId ||
        input.externalEventId ||
        fallbackEventKey(input.provider, input.payload),
    },
    body: JSON.stringify({
      occurredAt: normalized.occurredAt.toISOString(),
      contact: {
        externalId: normalized.contact.externalId,
        displayName: normalized.contact.displayName,
        email: normalized.contact.email,
        metadata: { provider: input.provider },
      },
      thread: {
        externalId: normalized.thread.externalId,
        subject: normalized.thread.subject,
      },
      message: {
        externalId: normalized.message.externalId,
        body: normalized.message.text,
        direction: normalized.message.direction,
        authorName: normalized.message.authorName,
        sentAt: normalized.occurredAt.toISOString(),
        payload: normalized.raw,
      },
      payload: input.payload,
    }),
  });

  return {
    duplicate: result.duplicate,
    ignored: false,
    eventId: normalized.eventId,
    conversationId: result.conversation.id,
    messageId: result.message?.id ?? null,
  };
}
