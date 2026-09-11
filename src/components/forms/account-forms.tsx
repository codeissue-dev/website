"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { changePasswordAction, updateProfileAction } from "@/actions/auth";
import { firstFieldError, idleActionState } from "@/actions/state";
import { TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

export function ProfileForm({ name }: { name: string }) {
  const t = useTranslations("AccountForm");
  const [state, formAction] = useActionState(updateProfileAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField
        name="name"
        label={t("name")}
        required
        minLength={2}
        maxLength={120}
        autoComplete="name"
        defaultValue={name}
        hint={t("nameHint")}
        error={firstFieldError(state, "name")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel={t("saving")}>
          {t("saveName")}
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const t = useTranslations("AccountForm");
  const [state, formAction] = useActionState(changePasswordAction, idleActionState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <TextField
        name="currentPassword"
        label={t("currentPassword")}
        type="password"
        required
        autoComplete="current-password"
        error={firstFieldError(state, "currentPassword")}
      />
      <TextField
        name="password"
        label={t("newPassword")}
        type="password"
        required
        minLength={10}
        autoComplete="new-password"
        hint={t("newPasswordHint")}
        error={firstFieldError(state, "password")}
      />
      <TextField
        name="confirmPassword"
        label={t("repeatNewPassword")}
        type="password"
        required
        autoComplete="new-password"
        error={firstFieldError(state, "confirmPassword")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel={t("saving")}>
          {t("changePassword")}
        </SubmitButton>
      </div>
    </form>
  );
}
