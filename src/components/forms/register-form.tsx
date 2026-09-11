"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("RegisterForm");
  const [state, formAction] = useActionState(registerAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField
        name="email"
        label={t("email")}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        error={firstFieldError(state, "email")}
      />
      <TextField
        name="password"
        label={t("password")}
        type="password"
        required
        minLength={10}
        autoComplete="new-password"
        hint={t("passwordHint")}
        error={firstFieldError(state, "password")}
      />
      <TextField
        name="confirmPassword"
        label={t("confirmPassword")}
        type="password"
        required
        autoComplete="new-password"
        error={firstFieldError(state, "confirmPassword")}
      />

      <FormMessage state={state} />

      <SubmitButton pendingLabel={t("pending")}>{t("submit")}</SubmitButton>
    </form>
  );
}
