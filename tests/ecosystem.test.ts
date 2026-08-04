import assert from 'node:assert/strict';
import test from 'node:test';

import { parseRegistrationDraft } from '../lib/auth/credentials';
import { parseReplyDraft } from '../lib/inbox/input';
import { parseIssueDraft } from '../lib/issues/input';
import { parseNormalizedMessageEvent } from '../lib/integrations/contracts';
import { parseOrderDraft } from '../lib/orders/input';
import { assertFile, readJson, readText } from './helpers/project';

type ProjectPackage = {
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
};

type ProjectLock = {
  packages: Record<string, { dependencies?: Record<string, string> }>;
};

test('installs the ecosystem stack and runs typed tests through tsx', async () => {
  const [packageJson, packageLock] = await Promise.all([
    readJson<ProjectPackage>('package.json'),
    readJson<ProjectLock>('package-lock.json'),
  ]);

  const dependencies = packageJson.dependencies;
  assert.equal(dependencies['next-i18next'], '16.0.8');
  assert.equal(dependencies['next-auth'], '5.0.0-beta.32');
  assert.equal(dependencies['@auth/drizzle-adapter'], '1.11.3');
  assert.equal(dependencies['drizzle-orm'], '0.45.2');
  assert.equal(dependencies.pg, '8.22.0');
  assert.deepEqual(packageLock.packages['']?.dependencies, dependencies);
  assert.equal(
    packageJson.scripts.test,
    'node --import tsx --test tests/index.ts',
  );
  assert.equal(packageJson.scripts['db:migrate'], 'drizzle-kit migrate');
});

test('ships Auth.js, protected admin pages, APIs, and live event monitor', async () => {
  const files = [
    'auth.ts',
    'app/api/auth/[...nextauth]/route.ts',
    'app/login/page.tsx',
    'app/register/page.tsx',
    'app/issues/new/page.tsx',
    'app/issues/new/actions.ts',
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

  await Promise.all(files.map(assertFile));

  const [auth, guard, stream] = await Promise.all([
    readText('auth.ts'),
    readText('lib/auth/guards.ts'),
    readText('components/admin/event-stream.tsx'),
  ]);
  assert.doesNotMatch(auth, /DrizzleAdapter/);
  assert.match(auth, /Credentials/);
  assert.match(auth, /username/);
  assert.match(auth, /session:\s*\{ strategy: 'jwt' \}/);
  assert.match(guard, /requireAdmin/);
  assert.match(stream, /new WebSocket\(ticket\.url\)/);
  assert.match(stream, /fetch\('\/api\/admin\/socket'/);
});

test('defines the operational data model and tenant boundary', async () => {
  const [schema, workspaceService] = await Promise.all([
    readText('db/schema.ts'),
    readText('lib/workspaces/service.ts'),
  ]);
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

  assert.match(workspaceService, /DEFAULT_WORKSPACE_SLUG/);
  assert.match(workspaceService, /requireWorkspaceAccess/);
  assert.match(schema, /contacts_integration_external_unique/);
  assert.match(schema, /messages_conversation_external_unique/);
});

test('runs with Docker Compose and PostgreSQL 18 storage conventions', async () => {
  const [compose, dockerfile, envExample] = await Promise.all([
    readText('docker-compose.yml'),
    readText('Dockerfile'),
    readText('.env.example'),
  ]);

  assert.match(compose, /image:\s*postgres:18-alpine/);
  assert.match(compose, /PGDATA:\s*\/var\/lib\/postgresql\/18\/docker/);
  assert.match(compose, /postgres_data:\/var\/lib\/postgresql/);
  assert.match(compose, /npm run db:migrate/);
  assert.match(dockerfile, /FROM node:22\.22\.1-alpine/);
  assert.match(envExample, /DATABASE_URL=/);
  assert.match(envExample, /BACKEND_WS_URL=/);
  assert.match(envExample, /INTEGRATION_WEBHOOK_SECRET=/);
});

test('normalizes channel messages through a tested contract', () => {
  const normalized = parseNormalizedMessageEvent({
    eventId: 'telegram:update:1',
    eventType: 'message.received',
    occurredAt: '2026-08-04T10:30:00.000Z',
    contact: { externalId: 'user:1', displayName: 'Alex' },
    thread: { externalId: 'chat:1', subject: 'New request' },
    message: { externalId: 'message:1', text: 'Build a portal.' },
  });

  if (!normalized) throw new Error('Expected a normalized message event.');
  assert.equal(normalized.message.direction, 'inbound');
  assert.equal(normalized.contact.displayName, 'Alex');
  assert.equal(normalized.thread.externalId, 'chat:1');
});

test('keeps route handlers thin and moves ingestion into a service', async () => {
  const [route, service] = await Promise.all([
    readText('app/api/webhooks/[provider]/route.ts'),
    readText('lib/integrations/ingest.ts'),
  ]);

  assert.match(route, /ingestIntegrationEvent/);
  assert.doesNotMatch(route, /insert\(contacts\)/);
  assert.match(service, /insert\(contacts\)/);
  assert.match(service, /insert\(conversations\)/);
  assert.match(service, /insert\(messages\)/);
  assert.match(service, /db\.transaction/);
});

test('validates account, issue, order, and reply commands before persistence', () => {
  assert.deepEqual(
    parseRegistrationDraft({
      username: '  Build_Ops  ',
      displayName: 'Alex',
      password: 'very-strong-password',
    }),
    {
      username: 'build_ops',
      displayName: 'Alex',
      password: 'very-strong-password',
    },
  );
  assert.deepEqual(
    parseIssueDraft({
      title: 'Customer portal',
      projectType: 'web-product',
      brief: 'We need a workspace that combines projects, files, and billing.',
      desiredOutcome: 'A useful internal release for the support team.',
      contactChannel: 'telegram',
      contactHandle: '@alexbuilds',
      budgetRange: '$5k-$10k',
    }),
    {
      title: 'Customer portal',
      projectType: 'web-product',
      brief: 'We need a workspace that combines projects, files, and billing.',
      desiredOutcome: 'A useful internal release for the support team.',
      contactChannel: 'telegram',
      contactHandle: '@alexbuilds',
      budgetRange: '$5k-$10k',
    },
  );
  assert.deepEqual(
    parseOrderDraft({
      title: 'Customer portal',
      currency: 'eur',
      value: '12,50',
    }),
    { title: 'Customer portal', currency: 'EUR', valueCents: 1250 },
  );
  assert.deepEqual(
    parseReplyDraft({
      conversationId: '123e4567-e89b-12d3-a456-426614174000',
      body: '  We can start discovery tomorrow.  ',
    }),
    {
      conversationId: '123e4567-e89b-12d3-a456-426614174000',
      body: 'We can start discovery tomorrow.',
    },
  );
});

test('supports username-only registration and issue intake without email', async () => {
  const [
    auth,
    schema,
    register,
    registerForm,
    issueAction,
    issueForm,
    migration,
  ] = await Promise.all([
    readText('auth.ts'),
    readText('db/schema.ts'),
    readText('app/register/actions.ts'),
    readText('components/auth/register-form.tsx'),
    readText('app/issues/new/actions.ts'),
    readText('components/issues/new-issue-form.tsx'),
    readText('drizzle/0001_username_issue_intake.sql'),
  ]);

  assert.match(auth, /credentials:\s*\{[\s\S]*?username/);
  assert.doesNotMatch(register, /formData\.get\('email'\)/);
  assert.doesNotMatch(registerForm, /type="email"|name="email"/);
  assert.match(register, /db\.transaction/);
  assert.match(register, /workspaceMembers/);
  assert.match(schema, /username: text\('username'\)\.notNull\(\)/);
  assert.match(schema, /requestedById/);
  assert.match(schema, /intake: jsonb/);
  assert.match(issueAction, /contactChannel/);
  assert.doesNotMatch(issueAction, /email/);
  assert.doesNotMatch(issueForm, /type="email"|name="email"/);
  assert.match(migration, /ALTER COLUMN "email" DROP NOT NULL/);
});
