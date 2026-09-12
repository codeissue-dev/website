import type { ZodError } from "zod";
import { getTranslations } from "next-intl/server";

import { actionFailure, fieldErrorsFromZod, type ActionState } from "@/actions/state";

/**
 * Server-side translation of Zod validation results.
 *
 * Validation schemas raise messages that are dictionary keys in the `Fields`
 * namespace; anything unknown falls back to the key itself (English), so a
 * missed entry degrades instead of breaking the form.
 */
export async function invalidInput(error: ZodError): Promise<ActionState> {
  const t = await getTranslations("Fields");
  const fieldErrors = Object.fromEntries(
    Object.entries(fieldErrorsFromZod(error)).map(([field, messages]) => [
      field,
      messages.map((message) => (t.has(message) ? t(message) : message)),
    ]),
  );

  const summaryKey = "Please correct the highlighted fields.";
  return actionFailure(t.has(summaryKey) ? t(summaryKey) : summaryKey, fieldErrors);
}
