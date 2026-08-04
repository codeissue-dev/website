'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { registerAccount } from '@/app/register/actions';
import { fieldClass } from '@/lib/ui/styles';

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

function SubmitButton({ copy }: { copy: RegisterCopy }) {
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

export function RegisterForm({
  copy,
  callbackUrl,
}: {
  copy: RegisterCopy;
  callbackUrl: string;
}) {
  const [state, action] = useActionState(registerAccount, {});
  const error = state.error
    ? (copy.errors[state.error] ?? copy.errors.unknown)
    : null;

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">
          {copy.displayName}
        </span>
        <input
          type="text"
          name="displayName"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          required
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">
          {copy.username}
        </span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          minLength={3}
          maxLength={32}
          pattern="[a-zA-Z0-9][a-zA-Z0-9_-]{2,31}"
          required
          className={fieldClass}
        />
        <small className="text-sm leading-5 text-muted-foreground">
          {copy.usernameHint}
        </small>
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">
          {copy.password}
        </span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          className={fieldClass}
        />
        <small className="text-sm leading-5 text-muted-foreground">
          {copy.passwordHint}
        </small>
      </label>
      {error ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <SubmitButton copy={copy} />
    </form>
  );
}
