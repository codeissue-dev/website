import type { ZodError } from "zod";

/**
 * Shared result shape for every form action.
 *
 * Client-safe on purpose: form components import this module, so it must not
 * pull in database or logging code.
 */
export type ActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Record<string, string[]>;
};

export const idleActionState: ActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export function actionSuccess(message: string | null = null): ActionState {
  return { status: "success", message, fieldErrors: {} };
}

export function actionFailure(
  message: string,
  fieldErrors: Record<string, string[]> = {},
): ActionState {
  return { status: "error", message, fieldErrors };
}

/** Groups Zod issues by field path so inputs can render their own errors. */
export function fieldErrorsFromZod(error: ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join(".") : "form";
    const existing = result[key];
    if (existing) existing.push(issue.message);
    else result[key] = [issue.message];
  }
  return result;
}

export function invalidInput(error: ZodError): ActionState {
  return actionFailure(
    "Please correct the highlighted fields.",
    fieldErrorsFromZod(error),
  );
}

export function firstFieldError(state: ActionState, field: string): string | undefined {
  return state.fieldErrors[field]?.[0];
}
