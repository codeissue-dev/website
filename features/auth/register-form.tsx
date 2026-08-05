'use client';

import { useActionState } from 'react';

import { registerAccount, type RegisterState } from './actions';
import { FormError, FormField } from '@/components/forms/form-field';
import { SubmitButton } from '@/components/forms/submit-button';
import { Input } from '@/components/ui/input';

type RegisterCopy = {
  displayName: string;
  username: string;
  usernameHint: string;
  password: string;
  passwordHint: string;
  submit: string;
  submitting: string;
  errors: Record<string, string>;
};

export function RegisterForm({
  copy,
  callbackUrl,
}: {
  copy: RegisterCopy;
  callbackUrl: string;
}) {
  const [state, action] = useActionState(registerAccount, {
    error: undefined,
  } as RegisterState);
  const error = state.error
    ? (copy.errors[state.error] ?? copy.errors.unknown)
    : null;

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FormField label={copy.displayName}>
        <Input
          type="text"
          name="displayName"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          required
        />
      </FormField>
      <FormField label={copy.username} hint={copy.usernameHint}>
        <Input
          type="text"
          name="username"
          autoComplete="username"
          minLength={3}
          maxLength={32}
          pattern="[a-zA-Z0-9][a-zA-Z0-9_-]{2,31}"
          required
        />
      </FormField>
      <FormField label={copy.password} hint={copy.passwordHint}>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
        />
      </FormField>
      <FormError>{error}</FormError>
      <SubmitButton
        idle={copy.submit}
        pending={copy.submitting}
        fullWidth
        className="mt-1"
      />
    </form>
  );
}
