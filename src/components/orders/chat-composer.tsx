"use client";

import { useActionState, useEffect, useRef } from "react";

import { sendOrderMessageAction } from "@/actions/chat";
import { firstFieldError, idleActionState } from "@/actions/state";
import { SubmitButton } from "@/components/ui/form-controls";
import { CONTROL_CLASS } from "@/components/ui/fields";
import { MAX_MESSAGE_LENGTH } from "@/lib/validation/orders";

/**
 * Message composer.
 *
 * Submitting calls the Server Action, which authorizes the writer and commits
 * the row before anything is broadcast. The message then arrives through the
 * same live channel every other participant uses, so there is no optimistic
 * copy that could disagree with the database.
 */
export function ChatComposer({ orderId }: { orderId: string }) {
  const [state, formAction] = useActionState(sendOrderMessageAction, idleActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  const bodyError = firstFieldError(state, "body") ?? state.message;

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-2 border-t border-line px-4 py-3 sm:px-5"
    >
      <input type="hidden" name="orderId" value={orderId} />
      <label htmlFor="chat-body" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-body"
        name="body"
        rows={3}
        required
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Write a message about this project..."
        className={`${CONTROL_CLASS} resize-y`}
        aria-invalid={state.status === "error" ? true : undefined}
        aria-describedby={state.status === "error" ? "chat-body-error" : undefined}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey) return;
          event.preventDefault();
          event.currentTarget.form?.requestSubmit();
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          id="chat-body-error"
          className="text-xs text-ink-muted"
          role={state.status === "error" ? "alert" : undefined}
        >
          {state.status === "error" && bodyError
            ? bodyError
            : "Enter sends, Shift + Enter adds a line."}
        </p>
        <SubmitButton size="sm" pendingLabel="Sending...">
          Send
        </SubmitButton>
      </div>
    </form>
  );
}
