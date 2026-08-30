"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { toActionFailure } from "@/actions/error-mapping";
import {
  actionFailure,
  actionSuccess,
  invalidInput,
  type ActionState,
} from "@/actions/state";
import { requireActor } from "@/lib/auth/actor";
import {
  assignExecutor,
  changeOrderStatus,
  createOrder,
  type CreatedOrder,
} from "@/lib/orders/mutations";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import { formText } from "@/lib/validation/form";
import {
  assignExecutorSchema,
  changeOrderStatusSchema,
  createOrderSchema,
} from "@/lib/validation/orders";

/** Views that depend on order data and must be refreshed after a write. */
function revalidateOrderViews(reference?: string): void {
  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  if (reference) revalidatePath(`/orders/${reference}`);
}

/**
 * Submit a project request.
 *
 * The customer is the authenticated actor; a `customerId` in the payload would
 * be ignored because it is never read.
 */
export async function createOrderAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createOrderSchema.safeParse({
    title: formText(formData, "title"),
    detailedDescription: formText(formData, "detailedDescription"),
    problemStatement: formText(formData, "problemStatement"),
    keyFeatures: formText(formData, "keyFeatures"),
    technicalPreferences: formText(formData, "technicalPreferences"),
    referenceLinks: formText(formData, "referenceLinks"),
    desiredDeadline: formText(formData, "desiredDeadline"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  let created: CreatedOrder | null = null;
  try {
    const actor = await requireActor();
    created = await createOrder({ actor, data: parsed.data });
    revalidateOrderViews(created.reference);
  } catch (error) {
    return toActionFailure(error, "createOrderAction failed");
  }

  if (!created) return actionFailure("The request could not be saved.");
  redirect(`/orders/${created.reference}?submitted=1`);
}

export async function changeOrderStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = changeOrderStatusSchema.safeParse({
    orderId: formText(formData, "orderId"),
    toStatus: formText(formData, "toStatus"),
    note: formText(formData, "note"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    const result = await changeOrderStatus({
      actor,
      orderId: parsed.data.orderId,
      toStatus: parsed.data.toStatus,
      note: parsed.data.note,
    });
    revalidateOrderViews(result.reference);
    return actionSuccess(`Status updated to ${ORDER_STATUS_LABELS[result.toStatus]}.`);
  } catch (error) {
    return toActionFailure(error, "changeOrderStatusAction failed");
  }
}

export async function assignExecutorAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = assignExecutorSchema.safeParse({
    orderId: formText(formData, "orderId"),
    executorId: formText(formData, "executorId"),
    note: formText(formData, "note"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    const result = await assignExecutor({
      actor,
      orderId: parsed.data.orderId,
      executorId: parsed.data.executorId,
      note: parsed.data.note,
    });
    revalidateOrderViews(result.reference);
    return actionSuccess(
      result.assignedExecutorId === null
        ? "The executor has been unassigned."
        : "The executor has been assigned.",
    );
  } catch (error) {
    return toActionFailure(error, "assignExecutorAction failed");
  }
}
