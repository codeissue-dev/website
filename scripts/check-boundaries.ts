import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';

const projectRoot = resolve('.');
const sourceRoots = ['features', 'components', 'lib', 'db'] as const;
const routeRoot = resolve(projectRoot, 'app');
const sourceExtensions = new Set(['.ts', '.tsx', '.mts']);
const importPattern = /(?:from\s+|import\s*\()['"]([^'"]+)['"]/g;

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory);
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry);
      return (await stat(path)).isDirectory() ? walk(path) : [path];
    }),
  );
  return files.flat();
}

function resolveLocalImport(file: string, specifier: string) {
  if (specifier.startsWith('@/'))
    return resolve(projectRoot, specifier.slice(2));
  if (specifier.startsWith('.')) return resolve(dirname(file), specifier);
  return null;
}

for (const root of sourceRoots) {
  const files = (await walk(resolve(projectRoot, root))).filter((file) =>
    sourceExtensions.has(extname(file)),
  );

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(importPattern)) {
      const target = resolveLocalImport(file, match[1]);
      if (!target) continue;
      assert.ok(
        !target.startsWith(routeRoot),
        `${relative(projectRoot, file)} must not import from app/: ${match[1]}`,
      );
    }
  }
}

const routeFiles = (await walk(routeRoot)).filter(
  (file) => /\/(page|layout)\.tsx$/.test(file) && !file.includes('/api/'),
);

for (const file of routeFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/from ['"](@\/features\/[^'"]+)['"]/g)) {
    const segments = match[1].split('/');
    assert.ok(
      segments.length <= 4,
      `${relative(projectRoot, file)} should import a feature public entrypoint, not ${match[1]}`,
    );
  }
}

console.log(
  `Boundary check passed for ${sourceRoots.length} source roots and ${routeFiles.length} route files.`,
);
