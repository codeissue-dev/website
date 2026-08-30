import type { ActionState } from "@/actions/state";
import { cn } from "@/lib/utils";

/**
 * Renders the form-level outcome of a Server Action.
 *
 * Messages come from the action result only; they are written for people and
 * never carry driver text, SQL or stack traces.
 */
export function FormMessage({
  state,
  className,
}: {
  state: ActionState;
  className?: string;
}) {
  const formErrors = state.fieldErrors.form;
  const message = state.message ?? formErrors?.[0] ?? null;
  if (state.status === "idle" || message === null) return null;

  const isError = state.status === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        isError
          ? "border-critical/40 bg-critical/8 text-critical"
          : "border-positive/40 bg-positive/8 text-positive",
        className,
      )}
    >
      {message}
    </p>
  );
}
