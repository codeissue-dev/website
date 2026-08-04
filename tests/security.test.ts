import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildBackendIdentityHeaders,
  buildBackendTarget,
  buildSocketUrl,
} from '../lib/backend/client';
import { hashPassword, verifyPassword } from '../lib/auth/password';
import {
  parseProvider,
  readJsonObjectBody,
  secretsMatch,
  WebhookRequestError,
} from '../lib/integrations/request';
import { readText } from './helpers/project';

test('protects admin APIs and never forwards browser authorization blindly', async () => {
  const [events, backend, socket] = await Promise.all([
    readText('app/api/admin/events/route.ts'),
    readText('app/api/admin/backend/[...path]/route.ts'),
    readText('app/api/admin/socket/route.ts'),
  ]);

  assert.match(events, /getAdminSessionForApi/);
  assert.match(backend, /getAdminSessionForApi/);
  assert.match(backend, /buildBackendIdentityHeaders/);
  assert.doesNotMatch(backend, /request\.headers\.get\('authorization'\)/);
  assert.match(socket, /getAdminSessionForApi/);
  assert.match(socket, /buildSocketUrl/);
});

test('builds backend targets and trusted identity headers centrally', () => {
  const previousApiUrl = process.env.BACKEND_API_URL;
  const previousSocketUrl = process.env.BACKEND_WS_URL;
  const previousToken = process.env.BACKEND_API_TOKEN;

  process.env.BACKEND_API_URL = 'https://backend.example/api/';
  process.env.BACKEND_WS_URL = 'wss://backend.example/events';
  process.env.BACKEND_API_TOKEN = 'server-only-token';

  try {
    const target = buildBackendTarget(
      ['orders', 'active'],
      'https://codeissue.dev/api/admin/backend/orders/active?page=2',
    );
    const headers = buildBackendIdentityHeaders({
      id: 'user-1',
      role: 'admin',
    });
    const socket = buildSocketUrl('short-lived-ticket');

    assert.equal(
      target.toString(),
      'https://backend.example/api/orders/active?page=2',
    );
    assert.equal(headers.get('x-codeissue-user-id'), 'user-1');
    assert.equal(headers.get('authorization'), 'Bearer server-only-token');
    assert.equal(socket.searchParams.get('ticket'), 'short-lived-ticket');
    assert.throws(
      () => buildBackendTarget(['..'], 'https://codeissue.dev/'),
      /Invalid backend path/,
    );
  } finally {
    const restore = (name: string, value: string | undefined) => {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    };
    restore('BACKEND_API_URL', previousApiUrl);
    restore('BACKEND_WS_URL', previousSocketUrl);
    restore('BACKEND_API_TOKEN', previousToken);
  }
});

test('validates webhook credentials, provider names, and body limits', async () => {
  assert.equal(secretsMatch('same-secret', 'same-secret'), true);
  assert.equal(secretsMatch('wrong', 'same-secret'), false);
  assert.equal(parseProvider('telegram_bot'), 'telegram_bot');
  assert.throws(() => parseProvider('../admin'), /Invalid provider/);

  const payload = await readJsonObjectBody(
    new Request('https://codeissue.dev/webhook', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'event-1' }),
    }),
  );
  assert.equal(payload.eventId, 'event-1');

  await assert.rejects(
    () =>
      readJsonObjectBody(
        new Request('https://codeissue.dev/webhook', {
          method: 'POST',
          headers: { 'content-length': '1000001' },
          body: '{}',
        }),
      ),
    (error: unknown) =>
      error instanceof WebhookRequestError && error.status === 413,
  );
});

test('uses scrypt and timing-safe password verification', async () => {
  const password = 'a-strong-password-2026';
  const hash = await hashPassword(password);

  assert.match(hash, /^scrypt:/);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('incorrect-password', hash), false);
  await assert.rejects(() => hashPassword('too-short'), /at least 12/);
});
