import { getAdminSessionForApi } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const maxRequestBytes = 5_000_000;

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyBackend(request: Request, context: RouteContext) {
  const session = await getAdminSessionForApi();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    return Response.json(
      { error: 'BACKEND_API_URL is not configured.' },
      { status: 503 },
    );
  }

  const { path } = await context.params;
  if (
    path.some(
      (segment) =>
        segment === '.' ||
        segment === '..' ||
        !/^[a-zA-Z0-9._~-]+$/.test(segment),
    )
  ) {
    return Response.json({ error: 'Invalid backend path.' }, { status: 400 });
  }

  let target: URL;
  try {
    const base = new URL(baseUrl);
    if (base.protocol !== 'http:' && base.protocol !== 'https:') {
      throw new Error('Unsupported backend protocol.');
    }
    const incomingUrl = new URL(request.url);
    target = new URL(path.join('/'), `${base.toString().replace(/\/$/, '')}/`);
    target.search = incomingUrl.search;
  } catch {
    return Response.json(
      { error: 'BACKEND_API_URL is invalid.' },
      { status: 503 },
    );
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

  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') ?? 'application/json');
  headers.set('x-codeissue-user-id', session.user.id);
  headers.set('x-codeissue-user-role', session.user.role);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  if (process.env.BACKEND_API_TOKEN) {
    headers.set('authorization', `Bearer ${process.env.BACKEND_API_TOKEN}`);
  }

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
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
