import {
  httpUrlEnv,
  optionalEnv,
  requiredEnv,
  webSocketUrlEnv,
} from '@/lib/config/env';

export const BACKEND_TIMEOUT_MS = 15_000;
export const SOCKET_TICKET_TIMEOUT_MS = 8_000;

export type BackendIdentity = {
  id: string;
  role: 'user' | 'admin';
  name?: string | null;
};

const protectedIdentityHeaders = new Set([
  'authorization',
  'x-codeissue-source',
  'x-codeissue-user-id',
  'x-codeissue-user-role',
  'x-codeissue-user-name',
  'x-codeissue-actor-id',
  'x-codeissue-actor-name',
]);

function mergeRequestHeaders(base: Headers, providedHeaders?: HeadersInit) {
  const provided = new Headers(providedHeaders);
  provided.forEach((value, key) => {
    if (protectedIdentityHeaders.has(key.toLowerCase())) {
      throw new Error(`The ${key} header is managed by the backend bridge.`);
    }
    base.set(key, value);
  });
  return base;
}

export class BackendApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'BackendApiError';
  }
}

function websiteToken() {
  return requiredEnv('WEBSITE_API_TOKEN');
}

export function buildBackendIdentityHeaders(user: BackendIdentity) {
  const headers = new Headers({
    accept: 'application/json',
    authorization: `Bearer ${websiteToken()}`,
    'x-codeissue-source': 'website',
    'x-codeissue-user-id': user.id,
    'x-codeissue-user-role': user.role,
  });
  if (user.name) headers.set('x-codeissue-user-name', user.name);
  return headers;
}

export function buildTelegramHeaders(actor?: {
  id?: string;
  name?: string | null;
}) {
  const headers = new Headers({
    accept: 'application/json',
    authorization: `Bearer ${requiredEnv('TELEGRAM_API_TOKEN')}`,
    'content-type': 'application/json',
    'x-codeissue-source': 'telegram',
    'x-codeissue-actor-id': actor?.id ?? 'website-telegram-webhook',
  });
  if (actor?.name) headers.set('x-codeissue-actor-name', actor.name);
  return headers;
}

export function buildBackendTarget(path: string[], requestUrl: string) {
  if (
    path.some(
      (segment) =>
        segment === '.' ||
        segment === '..' ||
        !/^[a-zA-Z0-9._~-]+$/.test(segment),
    )
  ) {
    throw new Error('Invalid backend path.');
  }

  const base = httpUrlEnv('BACKEND_API_URL');
  const target = new URL(
    path.join('/'),
    `${base.toString().replace(/\/$/, '')}/`,
  );
  target.search = new URL(requestUrl).search;
  return target;
}

function backendPath(path: string) {
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\') ||
    /[\u0000-\u001f\u007f]/u.test(path)
  ) {
    throw new Error('Backend path must be a safe absolute path.');
  }
  return path;
}

function backendUrl(path: string) {
  const base = httpUrlEnv('BACKEND_API_URL');
  const target = new URL(
    backendPath(path).slice(1),
    `${base.toString().replace(/\/$/, '')}/`,
  );
  if (target.origin !== base.origin) {
    throw new Error('Backend path must stay on the configured backend origin.');
  }
  return target;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as {
    error?: unknown;
    message?: unknown;
  } | null;
  if (!response.ok) {
    throw new BackendApiError(
      response.status,
      typeof payload?.error === 'string'
        ? payload.error
        : 'backend_request_failed',
      typeof payload?.message === 'string'
        ? payload.message
        : `Backend request failed with status ${response.status}.`,
    );
  }
  return payload as T;
}

export async function backendRequest<T>(
  path: string,
  user: BackendIdentity,
  init: RequestInit = {},
): Promise<T> {
  const headers = mergeRequestHeaders(
    buildBackendIdentityHeaders(user),
    init.headers,
  );
  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  const response = await fetch(backendUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(BACKEND_TIMEOUT_MS),
  });
  return parseResponse<T>(response);
}

export async function telegramBackendRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = mergeRequestHeaders(buildTelegramHeaders(), init.headers);
  const response = await fetch(backendUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(BACKEND_TIMEOUT_MS),
  });
  return parseResponse<T>(response);
}

export function buildSocketTicketTarget() {
  const base = httpUrlEnv('BACKEND_API_URL');
  const path = backendPath(
    optionalEnv('BACKEND_WS_TICKET_PATH') ?? '/ws/ticket',
  );
  const target = new URL(
    path.slice(1),
    `${base.toString().replace(/\/$/, '')}/`,
  );
  if (target.origin !== base.origin) {
    throw new Error('WebSocket ticket path must stay on the backend origin.');
  }
  return target;
}

export function buildSocketUrl(ticket: string, suggestedUrl?: string | null) {
  const socketUrl = suggestedUrl
    ? new URL(suggestedUrl)
    : webSocketUrlEnv('BACKEND_WS_URL');
  if (socketUrl.protocol !== 'ws:' && socketUrl.protocol !== 'wss:') {
    throw new Error('Backend socket URL must use ws:// or wss://.');
  }
  if (
    socketUrl.username ||
    socketUrl.password ||
    socketUrl.search ||
    socketUrl.hash
  ) {
    throw new Error(
      'Backend socket URL must not contain credentials, a query, or a fragment.',
    );
  }
  socketUrl.searchParams.set('ticket', ticket);
  return socketUrl;
}
