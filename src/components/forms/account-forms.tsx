"use client";

import { useActionState, useEffect, useRef } from "react";

import { changePasswordAction, updateProfileAction } from "@/actions/auth";
import { firstFieldError, idleActionState } from "@/actions/state";
import { TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

export function ProfileForm({ name }: { name: string }) {
  const [state, formAction] = useActionState(updateProfileAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField
        name="name"
        label="Name"
        required
        minLength={2}
        maxLength={120}
        autoComplete="name"
        defaultValue={name}
        hint="Used in the project chat and in the history of every status change you make."
        error={firstFieldError(state, "name")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel="Saving...">
          Save name
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, idleActionState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <TextField
        name="currentPassword"
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
        error={firstFieldError(state, "currentPassword")}
      />
      <TextField
        name="password"
        label="New password"
        type="password"
        required
        minLength={10}
        autoComplete="new-password"
        hint="At least 10 characters, including a letter and a number."
        error={firstFieldError(state, "password")}
      />
      <TextField
        name="confirmPassword"
        label="Repeat new password"
        type="password"
        required
        autoComplete="new-password"
        error={firstFieldError(state, "confirmPassword")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel="Saving...">
          Change password
        </SubmitButton>
      </div>
    </form>
  );
}
