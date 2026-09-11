"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { assignExecutorAction } from "@/actions/orders";
import { firstFieldError, idleActionState } from "@/actions/state";
import { SelectField, TextAreaField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { displayName } from "@/lib/utils";

export type ExecutorOption = {
  id: string;
  name: string | null;
  email: string;
};

/**
 * Executor assignment. Administrators only: the action re-checks the role and
 * refuses to assign anyone who does not actually hold the executor role.
 */
export function AssignExecutorForm({
  orderId,
  executors,
  currentExecutorId,
}: {
  orderId: string;
  executors: ExecutorOption[];
  currentExecutorId: string | null;
}) {
  const t = useTranslations("OrderForms");
  const [state, formAction] = useActionState(assignExecutorAction, idleActionState);

  if (executors.length === 0) {
    return <p className="text-sm text-ink-muted">{t("noExecutors")}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <SelectField
        name="executorId"
        label={t("executor")}
        defaultValue={currentExecutorId ?? ""}
        error={firstFieldError(state, "executorId")}
        options={[
          { value: "", label: t("executor") },
          ...executors.map((executor) => ({
            value: executor.id,
            label: displayName(executor.name, executor.email),
          })),
        ]}
      />

      <TextAreaField
        name="note"
        label={t("noteOptional")}
        rows={2}
        maxLength={1000}
        hint={t("assignmentNoteHint")}
        error={firstFieldError(state, "note")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel={t("saving")}>
          {t("saveAssignment")}
        </SubmitButton>
      </div>
    </form>
  );
}
