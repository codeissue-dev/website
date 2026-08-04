import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [landingSource, seedSource] = await Promise.all([
  readFile(new URL('../components/landing-page.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../scripts/seed.ts', import.meta.url), 'utf8'),
]);

test('uses Next Link for the internal admin route', () => {
  assert.match(landingSource, /import Link from 'next\/link';/);
  assert.match(landingSource, /<Link\s+href="\/admin"/);
  assert.doesNotMatch(landingSource, /<a\s+href="\/admin"/);
});

test('narrows the required seed password before hashing', () => {
  assert.match(seedSource, /function getAdminPassword\(\): string/);
  assert.match(seedSource, /process\.env\.ADMIN_PASSWORD\?\.trim\(\)/);
  assert.match(seedSource, /hashPassword\(getAdminPassword\(\)\)/);
  assert.doesNotMatch(seedSource, /hashPassword\(adminPassword\)/);
});
