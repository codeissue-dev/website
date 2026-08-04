import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('installs the ecosystem stack and keeps the lock root aligned', async () => {
  const [packageJson, packageLock] = await Promise.all([
    read('package.json').then(JSON.parse),
    read('package-lock.json').then(JSON.parse),
  ]);

  const dependencies = packageJson.dependencies;
  assert.equal(dependencies['next-i18next'], '16.0.8');
  assert.equal(dependencies['next-auth'], '5.0.0-beta.32');
  assert.equal(dependencies['@auth/drizzle-adapter'], '1.11.3');
  assert.equal(dependencies['drizzle-orm'], '0.45.2');
  assert.equal(dependencies.pg, '8.22.0');
  assert.deepEqual(packageLock.packages[''].dependencies, dependencies);
  assert.equal(packageJson.scripts['db:migrate'], 'drizzle-kit migrate');
  assert.equal(packageJson.scripts['db:seed'], 'tsx scripts/seed.ts');
});

test('ships Auth.js, protected admin pages, APIs, and live event monitor', async () => {
  const files = [
    'auth.ts',
    'app/api/auth/[...nextauth]/route.ts',
    'app/login/page.tsx',
    'app/admin/layout.tsx',
    'app/admin/page.tsx',
    'app/admin/inbox/page.tsx',
    'app/admin/orders/page.tsx',
    'app/admin/integrations/page.tsx',
    'app/admin/events/page.tsx',
    'components/admin/event-stream.tsx',
    'app/api/admin/events/route.ts',
    'app/api/admin/backend/[...path]/route.ts',
    'app/api/admin/socket/route.ts',
    'app/api/webhooks/[provider]/route.ts',
  ];

  await Promise.all(
    files.map((file) => access(new URL(`../${file}`, import.meta.url))),
  );

  const [auth, guard, stream] = await Promise.all([
    read('auth.ts'),
    read('lib/auth/guards.ts'),
    read('components/admin/event-stream.tsx'),
  ]);
  assert.match(auth, /DrizzleAdapter/);
  assert.match(auth, /Credentials/);
  assert.match(auth, /session:\s*\{ strategy: 'jwt' \}/);
  assert.match(guard, /requireAdmin/);
  assert.match(stream, /new WebSocket\(ticket\.url\)/);
  assert.match(stream, /fetch\('\/api\/admin\/socket'/);
  assert.match(stream, /fetch\('\/api\/admin\/events/);
});

test('defines the data model for auth, inbox, orders, integrations, and events', async () => {
  const schema = await read('db/schema.ts');
  const expectedTables = [
    'users',
    'accounts',
    'sessions',
    'workspaces',
    'workspaceMembers',
    'integrations',
    'contacts',
    'conversations',
    'messages',
    'orders',
    'integrationEvents',
  ];

  for (const table of expectedTables) {
    assert.match(schema, new RegExp(`export const ${table} = pgTable`));
  }

  assert.match(schema, /conversation_status/);
  assert.match(schema, /message_direction/);
  assert.match(schema, /order_status/);
  assert.match(schema, /event_status/);
});

test('runs with Docker Compose and PostgreSQL 18 storage conventions', async () => {
  const [compose, dockerfile, envExample] = await Promise.all([
    read('docker-compose.yml'),
    read('Dockerfile'),
    read('.env.example'),
  ]);

  assert.match(compose, /image:\s*postgres:18-alpine/);
  assert.match(compose, /PGDATA:\s*\/var\/lib\/postgresql\/18\/docker/);
  assert.match(compose, /postgres_data:\/var\/lib\/postgresql/);
  assert.match(compose, /npm run db:migrate/);
  assert.match(dockerfile, /FROM node:22\.22\.1-alpine/);
  assert.match(envExample, /DATABASE_URL=/);
  assert.match(envExample, /BACKEND_WS_URL=/);
  assert.match(envExample, /BACKEND_WS_TICKET_PATH=/);
  assert.match(envExample, /INTEGRATION_WEBHOOK_SECRET=/);
});

test('normalizes channel messages into the unified inbox model', async () => {
  const [contract, webhook, schema, migration] = await Promise.all([
    read('lib/integrations/contracts.ts'),
    read('app/api/webhooks/[provider]/route.ts'),
    read('db/schema.ts'),
    read('drizzle/0000_codeissue_ecosystem.sql'),
  ]);

  assert.match(contract, /message\.received/);
  assert.match(contract, /contact\.externalId/);
  assert.match(contract, /thread\.externalId/);
  assert.match(contract, /message\.externalId/);
  assert.match(webhook, /insert\(contacts\)/);
  assert.match(webhook, /insert\(conversations\)/);
  assert.match(webhook, /insert\(messages\)/);
  assert.match(schema, /contacts_integration_external_unique/);
  assert.match(schema, /conversations_integration_thread_unique/);
  assert.match(schema, /messages_conversation_external_unique/);
  assert.match(migration, /contacts_integration_external_unique/);
});

test('supports operator order creation and queued inbox replies', async () => {
  const [orderAction, replyAction, ordersPage, inboxPage] = await Promise.all([
    read('app/admin/orders/actions.ts'),
    read('app/admin/inbox/actions.ts'),
    read('app/admin/orders/page.tsx'),
    read('app/admin/inbox/page.tsx'),
  ]);

  assert.match(orderAction, /requireAdmin/);
  assert.match(orderAction, /workspaceMembers/);
  assert.match(orderAction, /insert\(orders\)/);
  assert.match(replyAction, /message\.outbound\.queued/);
  assert.match(replyAction, /insert\(messages\)/);
  assert.match(replyAction, /insert\(integrationEvents\)/);
  assert.match(ordersPage, /action=\{createOrder\}/);
  assert.match(inboxPage, /action=\{queueReply\}/);
});
