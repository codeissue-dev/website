import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const LOCAL_ENV_FILES = ['.env.local', '.env'] as const;
let loaded = false;

export function loadLocalEnvironment(root = process.cwd()) {
  if (loaded) return;

  for (const file of LOCAL_ENV_FILES) {
    const path = resolve(root, file);
    if (existsSync(path)) loadEnvFile(path);
  }

  loaded = true;
}

loadLocalEnvironment();
