export function optionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function requiredEnv(name: string) {
  const value = optionalEnv(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export function httpUrlEnv(name: string) {
  const value = requiredEnv(name);
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`${name} must use http:// or https://.`);
  }
  return url;
}

export function webSocketUrlEnv(name: string) {
  const value = requiredEnv(name);
  const url = new URL(value);
  if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw new Error(`${name} must use ws:// or wss://.`);
  }
  return url;
}
