"use client";

import { useActionState, useState } from "react";

import { changeOrderStatusAction } from "@/actions/orders";
import { firstFieldError, idleActionState } from "@/actions/state";
import { SelectField, TextAreaField } from "@/components/ui/fields";
import { ConfirmSubmitButton, SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import {
  isOrderStatus,
  ORDER_STATUS_LABELS,
  type OrderStatus,
  type OrderTransition,
} from "@/lib/orders/status";

/**
 * Status control.
 *
 * The options are the transitions the state machine allows for this actor and
 * this order, computed on the server. The server validates the transition again
 * inside the transaction, so a hand-crafted request cannot skip a step.
 */
export function OrderStatusForm({
  orderId,
  transitions,
  hasAssignedExecutor,
}: {
  orderId: string;
  transitions: OrderTransition[];
  hasAssignedExecutor: boolean;
}) {
  const [state, formAction] = useActionState(changeOrderStatusAction, idleActionState);

  const available = transitions.filter(
    (transition) => transition.requiresAssignedExecutor !== true || hasAssignedExecutor,
  );
  const blockedByAssignment = transitions.length > available.length;

  const [selected, setSelected] = useState<OrderStatus | null>(
    available[0]?.to ?? null,
  );
  const active =
    available.find((transition) => transition.to === selected) ?? available[0] ?? null;

  if (active === null) {
    return (
      <p className="text-sm text-ink-muted">
        {blockedByAssignment
          ? "Assign an executor to unlock the next step for this project."
          : "There is no status change available to you for this project right now."}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <SelectField
        name="toStatus"
        label="Move project to"
        value={active.to}
        onChange={(event) => {
          const next = event.target.value;
          if (isOrderStatus(next)) setSelected(next);
        }}
        error={firstFieldError(state, "toStatus")}
        options={available.map((transition) => ({
          value: transition.to,
          label: `${transition.actionLabel} to ${ORDER_STATUS_LABELS[transition.to]}`,
        }))}
      />

      <TextAreaField
        name="note"
        label={active.requiresNote === true ? "Note" : "Note (optional)"}
        rows={3}
        required={active.requiresNote === true}
        maxLength={1000}
        hint={
          active.requiresNote === true
            ? "This step needs an explanation. It is stored with the history entry and visible to the customer."
            : "Stored with the history entry and visible to everyone on the project."
        }
        error={firstFieldError(state, "note")}
      />

      {blockedByAssignment ? (
        <p className="text-xs text-ink-muted">
          Some later steps stay hidden until an executor is assigned.
        </p>
      ) : null}

      <FormMessage state={state} />

      <div className="flex justify-end">
        {active.destructive === true ? (
          <ConfirmSubmitButton
            size="sm"
            confirmMessage={`${active.actionLabel}: this is visible to the customer and recorded in the project history. Continue?`}
            pendingLabel="Saving..."
          >
            {active.actionLabel}
          </ConfirmSubmitButton>
        ) : (
          <SubmitButton size="sm" pendingLabel="Saving...">
            {active.actionLabel}
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
