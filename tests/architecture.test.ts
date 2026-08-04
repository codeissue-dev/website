import assert from 'node:assert/strict';
import test from 'node:test';

import { assertFile, readText } from './helpers/project';

test('organizes public UI, admin queries, and integration services by feature', async () => {
  const files = [
    'features/landing/landing-page.tsx',
    'features/landing/hooks/use-landing-interactions.ts',
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
