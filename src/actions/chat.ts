"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { toActionFailure } from "@/actions/error-mapping";
import { actionSuccess, invalidInput, type ActionState } from "@/actions/state";
import { requireActor } from "@/lib/auth/actor";
import { markOrderRead, sendOrderMessage } from "@/lib/chat/mutations";
import { describeError, logger } from "@/lib/logger";
import { formText } from "@/lib/validation/form";
import { sendOrderMessageSchema } from "@/lib/validation/orders";

const orderIdSchema = z.uuid();

/**
 * Posts a chat message.
 *
 * The message is committed to Postgres first; delivery to connected clients is
 * a consequence of that commit (LISTEN/NOTIFY), never a precondition. The
 * conversation therefore stays correct even with no socket at all.
 */
export async function sendOrderMessageAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = sendOrderMessageSchema.safeParse({
    orderId: formText(formData, "orderId"),
    body: formText(formData, "body"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await sendOrderMessage({
      actor,
      orderId: parsed.data.orderId,
      body: parsed.data.body,
    });
    // Keeps unread counters accurate for visitors without an open socket.
    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    return actionSuccess(null);
  } catch (error) {
    return toActionFailure(error, "sendOrderMessageAction failed");
  }
}

/**
 * Marks the conversation as read. Called from the chat client when the panel is
 * visible; failures are logged and ignored because a read receipt must never
 * break the page.
 */
export async function markOrderReadAction(orderId: string): Promise<void> {
  const parsed = orderIdSchema.safeParse(orderId);
  if (!parsed.success) return;

  try {
    const actor = await requireActor();
    await markOrderRead({ actor, orderId: parsed.data });
  } catch (error) {
    logger.warn("markOrderReadAction failed", describeError(error));
  }
}
