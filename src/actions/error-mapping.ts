import { getTranslations } from "next-intl/server";

import { isAppError, type AppErrorCode } from "@/lib/errors";
import { describeError, logger } from "@/lib/logger";

import { actionFailure, type ActionState } from "@/actions/state";

const TRANSITION_REASON_KEYS = new Set([
  "sameStatus",
  "forbiddenMove",
  "roleNotAllowed",
  "needExecutor",
  "needNote",
]);

const CODE_KEYS: Record<AppErrorCode, string> = {
  UNAUTHENTICATED: "unauthenticated",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "notFound",
  CONFLICT: "conflict",
  INVALID_INPUT: "invalidInput",
  INVALID_TRANSITION: "invalidTransition",
};

/**
 * Turns any thrown value into a safe form result, translated at the boundary.
 *
 * Expected domain errors are mapped by their stable code; transition
 * rejections arrive as dictionary keys and resolve into the same dictionary
 * the rest of the UI uses. Anything else is logged server-side and replaced
 * with a generic message, so SQL text, driver details, stack traces and
 * environment values never reach the browser.
 */
export async function toActionFailure(
  error: unknown,
  context: string,
): Promise<ActionState> {
  if (isAppError(error)) {
    if (
      error.code === "INVALID_TRANSITION" &&
      TRANSITION_REASON_KEYS.has(error.message)
    ) {
      const reasons = await getTranslations("Transitions.reasons");
      return actionFailure(reasons(error.message));
    }
    const t = await getTranslations("Errors");
    return actionFailure(t(CODE_KEYS[error.code]));
  }
  logger.error(context, describeError(error));
  const t = await getTranslations("Errors");
  return actionFailure(t("generic"));
}
