'use server';

import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { db } from '@/db/client';
import { users, workspaceMembers } from '@/db/schema';
import { parseRegistrationDraft } from '@/lib/auth/credentials';
import { hashPassword } from '@/lib/auth/password';
import { requireDefaultWorkspace } from '@/lib/workspaces/service';

export type LoginState = { error?: string };
export type RegisterState = { error?: string };

function safeCallbackUrl(value: FormDataEntryValue | null, fallback: string) {
  const callbackUrl = String(value ?? fallback);
  return callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : fallback;
}

function isUniqueViolation(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const directCode = 'code' in error ? error.code : undefined;
  const cause = 'cause' in error ? error.cause : undefined;
  const causeCode =
    cause && typeof cause === 'object' && 'code' in cause
      ? cause.code
      : undefined;
  return directCode === '23505' || causeCode === '23505';
}

export async function authenticate(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn('credentials', {
      username: String(formData.get('username') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: safeCallbackUrl(formData.get('callbackUrl'), '/admin'),
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: error.type };
    throw error;
  }

  return {};
}

export async function registerAccount(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  let draft: ReturnType<typeof parseRegistrationDraft>;

  try {
    draft = parseRegistrationDraft({
      username: formData.get('username'),
      displayName: formData.get('displayName'),
      password: formData.get('password'),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'unknown' };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, draft.username))
    .limit(1);

  if (existing) return { error: 'username_taken' };

  const workspace = await requireDefaultWorkspace();
  const passwordHash = await hashPassword(draft.password);

  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          username: draft.username,
          name: draft.displayName,
          email: null,
          passwordHash,
          role: 'viewer',
        })
        .returning({ id: users.id });

      if (!user) throw new Error('Account was not created.');

      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: user.id,
        role: 'viewer',
      });
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: 'username_taken' };
    throw error;
  }

  await signIn('credentials', {
    username: draft.username,
    password: draft.password,
    redirectTo: safeCallbackUrl(formData.get('callbackUrl'), '/issues/new'),
  });

  return {};
}
