export type NormalizedMessageEvent = {
  eventId: string;
  eventType: 'message.received' | 'message.sent';
  occurredAt: Date;
  contact: {
    externalId: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
  };
  thread: {
    externalId: string;
    subject: string;
  };
  message: {
    externalId: string;
    text: string;
    direction: 'inbound' | 'outbound';
    authorName?: string;
  };
  raw: Record<string, unknown>;
};

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function requiredString(
  value: unknown,
  field: string,
  maxLength: number,
): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`);
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new Error(`${field} must contain 1-${maxLength} characters.`);
  }
  return normalized;
}

function optionalString(value: unknown, maxLength: number) {
  if (value == null || value === '') return undefined;
  return requiredString(value, 'optional field', maxLength);
}

export function parseNormalizedMessageEvent(
  payload: Record<string, unknown>,
): NormalizedMessageEvent | null {
  const eventType = payload.eventType ?? payload.type;
  if (eventType !== 'message.received' && eventType !== 'message.sent') {
    return null;
  }

  const contact = record(payload.contact);
  const thread = record(payload.thread);
  const message = record(payload.message);
  if (!contact || !thread || !message) {
    throw new Error(
      'Normalized message events require contact, thread, and message.',
    );
  }

  const occurredAtValue = payload.occurredAt;
  const occurredAt =
    typeof occurredAtValue === 'string'
      ? new Date(occurredAtValue)
      : new Date();
  if (Number.isNaN(occurredAt.getTime())) {
    throw new Error('occurredAt must be an ISO date string.');
  }

  const eventId = requiredString(payload.eventId ?? payload.id, 'eventId', 200);
  const direction =
    message.direction ??
    (eventType === 'message.sent' ? 'outbound' : 'inbound');
  if (direction !== 'inbound' && direction !== 'outbound') {
    throw new Error('message.direction must be inbound or outbound.');
  }

  return {
    eventId,
    eventType,
    occurredAt,
    contact: {
      externalId: requiredString(contact.externalId, 'contact.externalId', 200),
      displayName: requiredString(
        contact.displayName,
        'contact.displayName',
        200,
      ),
      email: optionalString(contact.email, 320),
      avatarUrl: optionalString(contact.avatarUrl, 2_000),
    },
    thread: {
      externalId: requiredString(thread.externalId, 'thread.externalId', 200),
      subject: requiredString(thread.subject, 'thread.subject', 500),
    },
    message: {
      externalId: requiredString(message.externalId, 'message.externalId', 200),
      text: requiredString(message.text, 'message.text', 50_000),
      direction,
      authorName: optionalString(message.authorName, 200),
    },
    raw: payload,
  };
}
