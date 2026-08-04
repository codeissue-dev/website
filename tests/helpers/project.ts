import { access, readFile } from 'node:fs/promises';

export function projectFile(path: string) {
  return new URL(`../../${path}`, import.meta.url);
}

export async function readText(path: string) {
  return readFile(projectFile(path), 'utf8');
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readText(path)) as T;
}

export async function assertFile(path: string) {
  await access(projectFile(path));
}

export function valueShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(valueShape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, valueShape(child)]),
    );
  }
  return typeof value;
}
