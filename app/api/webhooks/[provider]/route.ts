import { optionalEnv } from '@/lib/config/env';
import { parseNormalizedMessageEvent } from '@/lib/integrations/contracts';
import { ingestIntegrationEvent } from '@/lib/integrations/ingest';
import {
  parseProvider,
  readJsonObjectBody,
  secretsMatch,
  WebhookRequestError,
} from '@/lib/integrations/request';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ provider: string }> };

export async function POST(request: Request, context: RouteContext) {
  const expectedSecret = optionalEnv('INTEGRATION_WEBHOOK_SECRET');
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

  let provider: string;
  let payload: Record<string, unknown>;
  try {
    provider = parseProvider((await context.params).provider);
    payload = await readJsonObjectBody(request);
  } catch (error) {
    if (error instanceof WebhookRequestError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json(
      { error: error instanceof Error ? error.message : 'Invalid request.' },
      { status: 400 },
    );
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
    const result = await ingestIntegrationEvent({
      provider,
      payload,
      normalized,
      externalEventId: request.headers.get('x-event-id'),
      eventType: request.headers.get('x-event-type'),
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
