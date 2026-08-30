"use client";

import { useActionState } from "react";

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
  const [state, formAction] = useActionState(assignExecutorAction, idleActionState);

  if (executors.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No accounts hold the executor role yet. Grant the role in People, then assign
        the project here.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <SelectField
        name="executorId"
        label="Executor"
        defaultValue={currentExecutorId ?? ""}
        error={firstFieldError(state, "executorId")}
        options={[
          { value: "", label: "Unassigned" },
          ...executors.map((executor) => ({
            value: executor.id,
            label: displayName(executor.name, executor.email),
          })),
        ]}
      />

      <TextAreaField
        name="note"
        label="Note (optional)"
        rows={2}
        maxLength={1000}
        hint="Recorded in the project history alongside the assignment."
        error={firstFieldError(state, "note")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel="Saving…">
          Save assignment
        </SubmitButton>
      </div>
    </form>
  );
}
