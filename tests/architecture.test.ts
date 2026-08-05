import assert from 'node:assert/strict';
import test from 'node:test';

import { assertFile, readJson, readText } from './helpers/project';

test('organizes interface code by feature and shared responsibility', async () => {
  const files = [
    'features/landing/landing-page.tsx',
    'features/landing/index.ts',
    'features/landing/components/site-header.tsx',
    'features/landing/components/hero-background.tsx',
    'features/landing/components/approach-visual.tsx',
    'features/landing/components/service-visual.tsx',
    'features/landing/components/hero-content.tsx',
    'features/landing/components/mobile-navigation.tsx',
    'features/landing/components/hero-issue-overview.tsx',
    'features/landing/components/hero-issue-details.tsx',
    'features/landing/components/process-visual.tsx',
    'features/landing/components/process-timeline.tsx',
    'features/auth/index.ts',
    'features/auth/auth-shell.tsx',
    'features/auth/auth-route-footer.tsx',
    'features/auth/login-form.tsx',
    'features/auth/register-form.tsx',
    'features/issues/index.ts',
    'features/issues/new-issue-screen.tsx',
    'features/issues/components/issue-product-fields.tsx',
    'features/issues/components/issue-contact-fields.tsx',
    'features/issues/new-issue-form.tsx',
    'features/admin/shell/index.ts',
    'features/admin/shell/admin-shell.tsx',
    'features/admin/shell/admin-account.tsx',
    'features/admin/overview/overview-screen.tsx',
    'features/admin/inbox/inbox-screen.tsx',
    'features/admin/orders/orders-screen.tsx',
    'features/admin/integrations/integrations-screen.tsx',
    'features/admin/events/events-screen.tsx',
    'features/admin/events/event-stream.tsx',
    'components/admin/admin-nav-item.tsx',
    'components/admin/admin-nav-icon.tsx',
    'components/forms/form-field.tsx',
    'components/forms/form-select.tsx',
    'components/forms/submit-button.tsx',
    'components/i18n/locale-select.tsx',
    'components/layout/brand-link.tsx',
    'components/ui/panel.tsx',
    'components/ui/input.tsx',
    'components/ui/label.tsx',
    'components/ui/progress.tsx',
    'components/ui/select.tsx',
    'components/ui/separator.tsx',
    'components/ui/textarea.tsx',
    'lib/config/site.ts',
    'lib/i18n/locales.ts',
    'scripts/check-boundaries.ts',
    'lib/env/load-local-env.ts',
    'scripts/db-doctor.ts',
    'scripts/sync-db-password.ts',
  ];

  await Promise.all(files.map(assertFile));

  const compatibilityFiles = [
    'components/landing-page.tsx',
    'components/auth/auth-shell.tsx',
    'components/auth/register-form.tsx',
    'components/admin/login-form.tsx',
    'components/admin/event-stream.tsx',
    'components/issues/new-issue-form.tsx',
  ];
  const sources = await Promise.all(compatibilityFiles.map(readText));
  for (const source of sources) assert.match(source, /Compatibility export/);
});

test('keeps route files thin and delegates actions and screens to features', async () => {
  const routeFiles = [
    'app/admin/page.tsx',
    'app/admin/inbox/page.tsx',
    'app/admin/orders/page.tsx',
    'app/admin/integrations/page.tsx',
    'app/admin/events/page.tsx',
    'app/issues/new/page.tsx',
  ];

  for (const file of routeFiles) {
    const source = await readText(file);
    assert.ok(
      source.split('\n').length < 45,
      `${file} should stay focused on route composition`,
    );
    assert.match(source, /features\//);
  }

  const [orderExport, orderAction, issueExport, issueAction] =
    await Promise.all([
      readText('app/admin/orders/actions.ts'),
      readText('features/admin/orders/actions.ts'),
      readText('app/issues/new/actions.ts'),
      readText('features/issues/actions.ts'),
    ]);
  assert.match(orderExport, /features\/admin\/orders\/actions/);
  assert.match(orderAction, /parseOrderDraft/);
  assert.match(orderAction, /requireWorkspaceAccess/);
  assert.match(issueExport, /features\/issues\/actions/);
  assert.match(issueAction, /parseIssueDraft/);
});

test('prepares the website package for a future monorepo move', async () => {
  const packageJson = await readJson<{
    name: string;
    packageManager: string;
    engines: Record<string, string>;
  }>('package.json');
  const [guide, tsconfig, siteConfig] = await Promise.all([
    readText('docs/technical/monorepo.md'),
    readText('tsconfig.json'),
    readText('lib/config/site.ts'),
  ]);

  assert.equal(packageJson.name, '@codeissue/website');
  assert.match(packageJson.packageManager, /^npm@/);
  assert.match(packageJson.engines.node, /22\.22\.1/);
  assert.match(tsconfig, /"@\/\*"/);
  assert.match(guide, /apps\/website/);
  assert.match(guide, /packages\/ui/);
  assert.match(guide, /boundaries:check/);
  assert.match(siteConfig, /localeCookie/);
});

test('separates concise user docs from detailed technical docs in English', async () => {
  const files = [
    'README.md',
    'docs/README.md',
    'docs/user/README.md',
    'docs/user/getting-started.md',
    'docs/user/using-the-website.md',
    'docs/technical/README.md',
    'docs/technical/architecture.md',
    'docs/technical/development.md',
    'docs/technical/database.md',
    'docs/technical/testing.md',
    'docs/technical/localization.md',
    'docs/technical/deployment.md',
    'docs/technical/monorepo.md',
  ];

  const sources = await Promise.all(files.map(readText));
  for (const [index, source] of sources.entries()) {
    assert.doesNotMatch(
      source,
      /[А-Яа-яЁё]/,
      `${files[index]} should be English`,
    );
  }
  assert.ok(sources[0].split('\n').length < 60);
  assert.match(
    await readText('docs/technical/architecture.md'),
    /Feature boundaries/,
  );
  assert.match(
    await readText('docs/technical/deployment.md'),
    /Release sequence/,
  );
});

test('uses feature public entrypoints and enforces package boundaries', async () => {
  const [loginPage, adminPage, issuePage, boundaryScript, packageJson] =
    await Promise.all([
      readText('app/login/page.tsx'),
      readText('app/admin/page.tsx'),
      readText('app/issues/new/page.tsx'),
      readText('scripts/check-boundaries.ts'),
      readJson<{ scripts: Record<string, string> }>('package.json'),
    ]);

  assert.match(loginPage, /@\/features\/auth['"]/);
  assert.match(adminPage, /@\/features\/admin\/overview['"]/);
  assert.match(issuePage, /@\/features\/issues['"]/);
  assert.match(boundaryScript, /must not import from app/);
  assert.match(packageJson.scripts.check, /boundaries:check/);
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
  const [globals, landing, adminShell, authShell] = await Promise.all([
    readText('app/globals.css'),
    readText('features/landing/components/hero-section.tsx'),
    readText('features/admin/shell/admin-shell.tsx'),
    readText('features/auth/auth-shell.tsx'),
  ]);

  assert.match(globals, /@import 'tailwindcss'/);
  assert.doesNotMatch(
    globals,
    /styles\/(landing|admin|operations|auth|responsive)\.css/,
  );
  assert.match(landing, /className=/);
  assert.match(adminShell, /className=/);
  assert.match(authShell, /className=/);
});
