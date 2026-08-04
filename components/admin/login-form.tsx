'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { authenticate } from '@/app/login/actions';
import { fieldClass } from '@/lib/ui/styles';

type LoginCopy = {
  username: string;
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
      className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50"
      disabled={pending}
    >
      {pending ? copy.submitting : copy.submit}
      <span aria-hidden="true">-&gt;</span>
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
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">
          {copy.username}
        </span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">
          {copy.password}
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={12}
          required
          className={fieldClass}
        />
      </label>
      {state.error ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {copy.error}
        </p>
      ) : null}
      <SubmitButton copy={copy} />
    </form>
  );
}
