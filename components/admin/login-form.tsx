'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { authenticate } from '@/app/login/actions';
import { fieldClass } from '@/lib/ui/styles';

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
    <button
      type="submit"
      className="mt-1 inline-flex h-11 w-full items-center justify-between border border-signal bg-signal px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-signal-soft disabled:pointer-events-none disabled:opacity-50"
      disabled={pending}
    >
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
    <form action={action} className="mt-8 grid gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="grid gap-2">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground">
          {copy.email}
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="admin@codeissue.dev"
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground">
          {copy.password}
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={12}
          required
          placeholder="••••••••••••"
          className={fieldClass}
        />
      </label>
      {state.error ? (
        <p className="m-0 text-xs text-danger">{copy.error}</p>
      ) : null}
      <SubmitButton copy={copy} />
    </form>
  );
}
