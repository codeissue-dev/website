import {
  BACKEND_TIMEOUT_MS,
  buildBackendIdentityHeaders,
  buildBackendTarget,
} from '@/lib/backend/client';
import { getAdminSessionForApi } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const maxRequestBytes = 1_000_000;

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyBackend(request: Request, context: RouteContext) {
  const session = await getAdminSessionForApi();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await context.params;
  let target: URL;
  try {
    target = buildBackendTarget(path, request.url);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Backend configuration is invalid.';
    const status = message === 'Invalid backend path.' ? 400 : 503;
    return Response.json({ error: message }, { status });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxRequestBytes) {
    return Response.json(
      { error: 'Request body is too large.' },
      { status: 413 },
    );
  }

  let body: ArrayBuffer | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
    if (body.byteLength > maxRequestBytes) {
      return Response.json(
        { error: 'Request body is too large.' },
        { status: 413 },
      );
    }
  }

  const headers = buildBackendIdentityHeaders(session.user);
  headers.set('accept', request.headers.get('accept') ?? 'application/json');

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });

    const responseHeaders = new Headers();
    const responseType = response.headers.get('content-type');
    if (responseType) responseHeaders.set('content-type', responseType);
    responseHeaders.set('cache-control', 'no-store');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { error: 'Backend API is unavailable.' },
      { status: 502 },
    );
  }
}

export const GET = proxyBackend;
export const POST = proxyBackend;
export const PUT = proxyBackend;
export const PATCH = proxyBackend;
export const DELETE = proxyBackend;
