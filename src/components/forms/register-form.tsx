"use client";

import { useActionState } from "react";

import { registerAction } from "@/actions/auth";
import { firstFieldError, idleActionState } from "@/actions/state";
import { TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

/**
 * Registration.
 *
 * Credentials sign-in never creates accounts, so this form posts to a dedicated
 * Server Action that validates, normalises the email, hashes the password and
 * inserts the row before starting a session.
 */
export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField
        name="name"
        label="Name"
        required
        minLength={2}
        maxLength={120}
        autoComplete="name"
        error={firstFieldError(state, "name")}
      />
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
        minLength={10}
        autoComplete="new-password"
        hint="At least 10 characters, including a letter and a number."
        error={firstFieldError(state, "password")}
      />
      <TextField
        name="confirmPassword"
        label="Repeat password"
        type="password"
        required
        autoComplete="new-password"
        error={firstFieldError(state, "confirmPassword")}
      />

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Creating account…">Create account</SubmitButton>
    </form>
  );
}
