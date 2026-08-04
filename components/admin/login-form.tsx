'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { authenticate } from '@/app/login/actions';

type LoginCopy = {
  email: string;
  password: string;
  submit: string;
  submitting: string;
  error: string;
};

function SubmitButton({ copy }: { copy: LoginCopy }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="login-submit" disabled={pending}>
      {pending ? copy.submitting : copy.submit}
      <span aria-hidden="true">→</span>
    </button>
  );
}

export function LoginForm({
  copy,
  callbackUrl,
}: {
  copy: LoginCopy;
  callbackUrl: string;
}) {
  const [state, action] = useActionState(authenticate, {});

  return (
    <form action={action} className="login-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label>
        <span>{copy.email}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="admin@codeissue.dev"
        />
      </label>
      <label>
        <span>{copy.password}</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={12}
          required
          placeholder="••••••••••••"
        />
      </label>
      {state.error ? <p className="login-error">{copy.error}</p> : null}
      <SubmitButton copy={copy} />
    </form>
  );
}
