import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('protects admin APIs and never forwards browser authorization blindly', async () => {
  const [events, backend, socket] = await Promise.all([
    read('app/api/admin/events/route.ts'),
    read('app/api/admin/backend/[...path]/route.ts'),
    read('app/api/admin/socket/route.ts'),
  ]);

  assert.match(events, /getAdminSessionForApi/);
  assert.match(events, /status: 401/);
  assert.match(backend, /getAdminSessionForApi/);
  assert.match(backend, /BACKEND_API_TOKEN/);
  assert.match(backend, /Invalid backend path/);
  assert.doesNotMatch(backend, /request\.headers\.get\('authorization'\)/);
  assert.match(socket, /getAdminSessionForApi/);
  assert.match(socket, /BACKEND_WS_URL/);
  assert.match(socket, /BACKEND_WS_TICKET_PATH/);
  assert.match(socket, /searchParams\.set\('ticket'/);
});

test('requires an explicit secret and size limit for inbound webhooks', async () => {
  const webhook = await read('app/api/webhooks/[provider]/route.ts');

  assert.match(webhook, /INTEGRATION_WEBHOOK_SECRET/);
  assert.match(webhook, /x-codeissue-webhook-secret/);
  assert.match(webhook, /Payload too large/);
  assert.match(webhook, /onConflictDoNothing/);
  assert.match(webhook, /timingSafeEqual/);
  assert.match(webhook, /parseNormalizedMessageEvent/);
  assert.match(webhook, /db\.transaction/);
});

test('uses scrypt and timing-safe password verification', async () => {
  const password = await read('lib/auth/password.ts');

  assert.match(password, /nodeScrypt/);
  assert.match(password, /timingSafeEqual/);
  assert.match(password, /password\.length < 12/);
});
