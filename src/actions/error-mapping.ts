import { isAppError, toUserFacingMessage } from "@/lib/errors";
import { describeError, logger } from "@/lib/logger";

import { actionFailure, type ActionState } from "@/actions/state";

/**
 * Turns any thrown value into a safe form result.
 *
 * Expected domain errors carry a message written for users. Anything else is
 * logged server-side and replaced with a generic message, so SQL text, driver
 * details, stack traces and environment values never reach the browser.
 */
export function toActionFailure(error: unknown, context: string): ActionState {
  if (isAppError(error)) {
    return actionFailure(toUserFacingMessage(error));
  }
  logger.error(context, describeError(error));
  return actionFailure(toUserFacingMessage(error));
}
