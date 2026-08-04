import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ExternalLink } from '../features/landing/components/external-link';
import { readText } from './helpers/project';

test('uses Next Link for the internal admin route', async () => {
  const headerSource = await readText(
    'features/landing/components/site-header.tsx',
  );

  assert.match(headerSource, /import Link from 'next\/link';/);
  assert.match(headerSource, /<Link\s+href="\/admin"/);
  assert.doesNotMatch(headerSource, /<a\s+href="\/admin"/);
});

test('narrows the required seed password before hashing', async () => {
  const seedSource = await readText('scripts/seed.ts');

  assert.match(seedSource, /function getAdminPassword\(\): string/);
  assert.match(seedSource, /process\.env\.ADMIN_PASSWORD\?\.trim\(\)/);
  assert.match(seedSource, /hashPassword\(getAdminPassword\(\)\)/);
});

test('external links always isolate the opener context', () => {
  const markup = renderToStaticMarkup(
    <ExternalLink href="https://example.com">Example</ExternalLink>,
  );

  assert.match(markup, /target="_blank"/);
  assert.match(markup, /rel="noreferrer"/);
});
