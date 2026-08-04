'use client';

import { useActionState } from 'react';

import { authenticate, type LoginState } from './actions';
import { FormError, FormField } from '@/components/forms/form-field';
import { SubmitButton } from '@/components/forms/submit-button';
import { fieldClass } from '@/lib/ui/styles';

type LoginCopy = {
  username: string;
  password: string;
  submit: string;
  submitting: string;
  error: string;
};

export function LoginForm({
  copy,
  callbackUrl,
}: {
  copy: LoginCopy;
  callbackUrl: string;
}) {
  const [state, action] = useActionState(authenticate, {
    error: undefined,
  } as LoginState);

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FormField label={copy.username}>
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
          className={fieldClass}
        />
      </FormField>
      <FormField label={copy.password}>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={12}
          required
          className={fieldClass}
        />
      </FormField>
      <FormError>{state.error ? copy.error : null}</FormError>
      <SubmitButton
        idle={copy.submit}
        pending={copy.submitting}
        fullWidth
        className="mt-1"
      />
    </form>
  );
}
