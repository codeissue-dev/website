import { httpUrlEnv, optionalEnv, webSocketUrlEnv } from '@/lib/config/env';

export const BACKEND_TIMEOUT_MS = 15_000;
export const SOCKET_TICKET_TIMEOUT_MS = 8_000;

export function buildBackendIdentityHeaders(user: {
  id: string;
  role: string;
}) {
  const headers = new Headers({ accept: 'application/json' });
  headers.set('x-codeissue-user-id', user.id);
  headers.set('x-codeissue-user-role', user.role);

  const token = optionalEnv('BACKEND_API_TOKEN');
  if (token) headers.set('authorization', `Bearer ${token}`);

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

export function buildSocketTicketTarget() {
  const base = httpUrlEnv('BACKEND_API_URL');
  const path = optionalEnv('BACKEND_WS_TICKET_PATH') ?? '/ws/ticket';
  return new URL(path, `${base.toString().replace(/\/$/, '')}/`);
}

export function buildSocketUrl(ticket: string) {
  const socketUrl = webSocketUrlEnv('BACKEND_WS_URL');
  socketUrl.searchParams.set('ticket', ticket);
  return socketUrl;
}
