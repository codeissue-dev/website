"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { toActionFailure } from "@/actions/error-mapping";
import { getTranslations } from "next-intl/server";
import { actionFailure, actionSuccess, type ActionState } from "@/actions/state";
import { invalidInput } from "@/actions/invalid-input";
import { requireActor } from "@/lib/auth/actor";
import {
  assignExecutor,
  changeOrderStatus,
  createOrder,
  type CreatedOrder,
} from "@/lib/orders/mutations";
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
  const t = await getTranslations("Actions");
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

  if (!created) return actionFailure(t("orderNotSaved"));
  redirect(`/orders/${created.reference}?submitted=1`);
}

export async function changeOrderStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tStatuses = await getTranslations("Statuses");
  const t = await getTranslations("Actions");
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
    return actionSuccess(t("statusUpdated", { status: tStatuses(result.toStatus) }));
  } catch (error) {
    return toActionFailure(error, "changeOrderStatusAction failed");
  }
}

export async function assignExecutorAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const t = await getTranslations("Actions");
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
        ? t("executorUnassigned")
        : t("executorAssigned"),
    );
  } catch (error) {
    return toActionFailure(error, "assignExecutorAction failed");
  }
}
