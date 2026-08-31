"use client";

import { useActionState } from "react";

import { signInAction } from "@/actions/auth";
import { firstFieldError, idleActionState } from "@/actions/state";
import { TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

/**
 * Sign-in.
 *
 * Failures are deliberately generic: the response never reveals whether an
 * address is registered.
 */
export function SignInForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signInAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        error={firstFieldError(state, "email")}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        required
        autoComplete="current-password"
        error={firstFieldError(state, "password")}
      />

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>
    </form>
  );
}
