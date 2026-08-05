import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const required = [
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
  'docs/technical/assets.md',
  'docs/technical/deployment.md',
  'docs/technical/monorepo.md',
] as const;

for (const relativePath of required) {
  const path = resolve(relativePath);
  assert.ok((await stat(path)).isFile(), `${relativePath} must exist`);
  const source = await readFile(path, 'utf8');
  assert.ok(source.trim().length > 0, `${relativePath} must not be empty`);
  assert.doesNotMatch(
    source,
    /[А-Яа-яЁё]/,
    `${relativePath} must be written in English`,
  );
}

console.log(`Documentation check passed for ${required.length} files.`);
