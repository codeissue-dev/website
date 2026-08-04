export type RegistrationDraft = {
  username: string;
  displayName: string;
  password: string;
};

const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,31}$/;

export function normalizeUsername(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

export function parseRegistrationDraft(input: {
  username: unknown;
  displayName: unknown;
  password: unknown;
}): RegistrationDraft {
  const username = normalizeUsername(input.username);
  const displayName = String(input.displayName ?? '').trim();
  const password = String(input.password ?? '');

  if (!USERNAME_PATTERN.test(username)) {
    throw new Error('invalid_username');
  }

  if (displayName.length < 2 || displayName.length > 80) {
    throw new Error('invalid_display_name');
  }

  if (password.length < 12 || password.length > 128) {
    throw new Error('invalid_password');
  }

  return { username, displayName, password };
}
