export function optionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function requiredEnv(name: string) {
  const value = optionalEnv(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function credentialFreeUrl(name: string, protocols: readonly string[]) {
  const value = requiredEnv(name);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }
  if (!protocols.includes(url.protocol)) {
    throw new Error(`${name} must use ${protocols.join(' or ')}.`);
  }
  if (url.username || url.password || url.hash) {
    throw new Error(`${name} must not contain credentials or a fragment.`);
  }
  return url;
}

export function httpUrlEnv(name: string) {
  const url = credentialFreeUrl(name, ['http:', 'https:']);
  if (url.search) {
    throw new Error(`${name} must not contain a query string.`);
  }
  return url;
}

export function webSocketUrlEnv(name: string) {
  return credentialFreeUrl(name, ['ws:', 'wss:']);
}
