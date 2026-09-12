"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";

import { changeOrderStatusAction } from "@/actions/orders";
import { firstFieldError, idleActionState } from "@/actions/state";
import { SelectField, TextAreaField } from "@/components/ui/fields";
import { ConfirmSubmitButton, SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import {
  isOrderStatus,
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
  const t = useTranslations("OrderForms");
  const tStatuses = useTranslations("Statuses");
  const tTransitions = useTranslations("Transitions");
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
        {blockedByAssignment ? t("needAssignment") : t("noTransitions")}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <SelectField
        name="toStatus"
        label={t("moveTo")}
        value={active.to}
        onChange={(event) => {
          const next = event.target.value;
          if (isOrderStatus(next)) setSelected(next);
        }}
        error={firstFieldError(state, "toStatus")}
        options={available.map((transition) => ({
          value: transition.to,
          label: t("toStatus", {
            action: tTransitions(transition.labelKey),
            status: tStatuses(transition.to),
          }),
        }))}
      />

      <TextAreaField
        name="note"
        label={active.requiresNote === true ? t("note") : t("noteOptional")}
        rows={3}
        required={active.requiresNote === true}
        maxLength={1000}
        hint={active.requiresNote === true ? t("noteRequiredHint") : t("noteHint")}
        error={firstFieldError(state, "note")}
      />

      {blockedByAssignment ? (
        <p className="text-xs text-ink-muted">{t("assignmentBlocked")}</p>
      ) : null}

      <FormMessage state={state} />

      <div className="flex justify-end">
        {active.destructive === true ? (
          <ConfirmSubmitButton
            size="sm"
            confirmMessage={t("confirm", {
              action: tTransitions(active.labelKey),
            })}
            pendingLabel={t("saving")}
          >
            {tTransitions(active.labelKey)}
          </ConfirmSubmitButton>
        ) : (
          <SubmitButton size="sm" pendingLabel={t("saving")}>
            {tTransitions(active.labelKey)}
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
