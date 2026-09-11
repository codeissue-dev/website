"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { createOrderAction } from "@/actions/orders";
import { firstFieldError, idleActionState } from "@/actions/state";
import { TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

/** Today in the visitor's timezone, so the date picker cannot offer the past. */
function todayIsoDate(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function NewOrderForm() {
  const t = useTranslations("NewOrder");
  const [state, formAction] = useActionState(createOrderAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        name="title"
        label={t("titleLabel")}
        required
        minLength={6}
        maxLength={140}
        placeholder={t("titlePlaceholder")}
        hint={t("titleHint")}
        error={firstFieldError(state, "title")}
      />

      <TextAreaField
        name="detailedDescription"
        label={t("ideaLabel")}
        required
        minLength={80}
        maxLength={8000}
        rows={8}
        placeholder={t("ideaPlaceholder")}
        hint={t("ideaHint")}
        error={firstFieldError(state, "detailedDescription")}
      />

      <TextAreaField
        name="problemStatement"
        label={t("problemLabel")}
        required
        minLength={30}
        maxLength={2000}
        rows={4}
        placeholder={t("problemPlaceholder")}
        error={firstFieldError(state, "problemStatement")}
      />

      <TextAreaField
        name="keyFeatures"
        label={t("featuresLabel")}
        required
        minLength={20}
        maxLength={4000}
        rows={4}
        placeholder={t("featuresPlaceholder")}
        error={firstFieldError(state, "keyFeatures")}
      />

      <TextAreaField
        name="technicalPreferences"
        label={t("techLabel")}
        maxLength={2000}
        rows={3}
        placeholder={t("techPlaceholder")}
        hint={t("techHint")}
        error={firstFieldError(state, "technicalPreferences")}
      />

      <TextAreaField
        name="referenceLinks"
        label={t("linksLabel")}
        maxLength={2000}
        rows={3}
        placeholder={t("linksPlaceholder")}
        hint={t("linksHint")}
        error={firstFieldError(state, "referenceLinks")}
      />

      <TextField
        name="desiredDeadline"
        label={t("deadlineLabel")}
        type="date"
        min={todayIsoDate()}
        hint={t("deadlineHint")}
        error={firstFieldError(state, "desiredDeadline")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton pendingLabel={t("submitting")}>{t("submit")}</SubmitButton>
      </div>
    </form>
  );
}
