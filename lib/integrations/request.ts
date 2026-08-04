import { timingSafeEqual } from 'node:crypto';

export const MAX_WEBHOOK_PAYLOAD_BYTES = 1_000_000;

export function secretsMatch(received: string | null, expected: string) {
  if (!received) return false;
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export function parseProvider(value: string) {
  if (!/^[a-z0-9_-]{2,40}$/.test(value)) {
    throw new Error('Invalid provider.');
  }
  return value;
}

export function providerLabel(provider: string) {
  return provider
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function readJsonObjectBody(
  request: Request,
): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_WEBHOOK_PAYLOAD_BYTES) {
    throw new WebhookRequestError('Payload too large.', 413);
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    throw new WebhookRequestError('Could not read request body.', 400);
  }

  if (new TextEncoder().encode(body).byteLength > MAX_WEBHOOK_PAYLOAD_BYTES) {
    throw new WebhookRequestError('Payload too large.', 413);
  }

  try {
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Expected an object.');
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new WebhookRequestError('Expected a JSON object.', 400);
  }
}

export class WebhookRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'WebhookRequestError';
  }
}
