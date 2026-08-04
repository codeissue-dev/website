import assert from 'node:assert/strict';
import test from 'node:test';

import { assertFile, readText } from './helpers/project';

test('organizes public UI, admin queries, and integration services by feature', async () => {
  const files = [
    'features/landing/landing-page.tsx',
    'features/landing/hooks/use-landing-interactions.ts',
    'features/landing/components/section-heading.tsx',
    'features/landing/components/scroll-progress.tsx',
    'features/landing/components/hero-art.tsx',
    'components/auth/auth-shell.tsx',
    'components/issues/new-issue-form.tsx',
    'components/admin/admin-page-header.tsx',
    'components/admin/channel-avatar.tsx',
    'components/admin/status-pill.tsx',
    'app/globals.css',
    'lib/ui/styles.ts',
    'lib/admin/types.ts',
    'lib/admin/fallback-data.ts',
    'lib/admin/queries.ts',
    'lib/admin/overview.ts',
    'lib/workspaces/service.ts',
    'lib/integrations/ingest.ts',
    'lib/backend/client.ts',
  ];

  await Promise.all(files.map(assertFile));

  const compatibilityBarrel = await readText('components/landing-page.tsx');
  assert.match(compatibilityBarrel, /features\/landing\/landing-page/);
});

test('keeps route files focused on transport and delegates business logic', async () => {
  const [webhookRoute, backendRoute, orderAction] = await Promise.all([
    readText('app/api/webhooks/[provider]/route.ts'),
    readText('app/api/admin/backend/[...path]/route.ts'),
    readText('app/admin/orders/actions.ts'),
  ]);

  assert.ok(webhookRoute.split('\n').length < 100);
  assert.ok(backendRoute.split('\n').length < 120);
  assert.match(orderAction, /parseOrderDraft/);
  assert.match(orderAction, /requireWorkspaceAccess/);
});

test('ships concise development and deployment documentation', async () => {
  await Promise.all([
    assertFile('README.md'),
    assertFile('docs/development.md'),
    assertFile('docs/deployment.md'),
    assertFile('docs/README.ru.md'),
  ]);
});

test('keeps the public page server-rendered and isolates browser behavior', async () => {
  const [landingPage, progress, interactions] = await Promise.all([
    readText('features/landing/landing-page.tsx'),
    readText('features/landing/components/scroll-progress.tsx'),
    readText('features/landing/hooks/use-landing-interactions.ts'),
  ]);

  assert.doesNotMatch(landingPage, /['"]use client['"]/);
  assert.match(progress, /['"]use client['"]/);
  assert.match(interactions, /pointermove/);
  assert.match(interactions, /--parallax-y/);
});

test('keeps visual composition in Tailwind utilities instead of feature CSS', async () => {
  const [globals, landing, admin, auth] = await Promise.all([
    readText('app/globals.css'),
    readText('features/landing/components/hero-section.tsx'),
    readText('app/admin/layout.tsx'),
    readText('app/login/page.tsx'),
  ]);

  assert.match(globals, /@import 'tailwindcss'/);
  assert.doesNotMatch(
    globals,
    /styles\/(landing|admin|operations|auth|responsive)\.css/,
  );
  assert.match(landing, /className=/);
  assert.match(admin, /className=/);
  assert.match(auth, /className=/);
});
