'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/auth';

export type LoginState = { error?: string };

function safeCallbackUrl(value: FormDataEntryValue | null) {
  const callbackUrl = String(value ?? '/admin');
  return callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : '/admin';
}

export async function authenticate(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn('credentials', {
      username: String(formData.get('username') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: safeCallbackUrl(formData.get('callbackUrl')),
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: error.type };
    throw error;
  }

  return {};
}
