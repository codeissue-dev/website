"use client";

import { useActionState } from "react";

import { idleActionState } from "@/actions/state";
import type { ActionState } from "@/actions/state";
import { ConfirmSubmitButton, SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

type ContentAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Publish toggle and delete for one content row.
 *
 * Two independent forms so a failed delete never clears the publish result, and
 * so each button reports its own pending state.
 */
export function ContentRowActions({
  id,
  published,
  setPublishedAction,
  deleteAction,
  deleteConfirmMessage,
}: {
  id: string;
  published: boolean;
  setPublishedAction: ContentAction;
  deleteAction: ContentAction;
  deleteConfirmMessage: string;
}) {
  const [publishState, publishFormAction] = useActionState(
    setPublishedAction,
    idleActionState,
  );
  const [deleteState, deleteFormAction] = useActionState(deleteAction, idleActionState);

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <form action={publishFormAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="published" value={published ? "false" : "true"} />
          <SubmitButton
            size="sm"
            variant="secondary"
            pendingLabel={published ? "Unpublishing…" : "Publishing…"}
          >
            {published ? "Unpublish" : "Publish"}
          </SubmitButton>
        </form>

        <form action={deleteFormAction}>
          <input type="hidden" name="id" value={id} />
          <ConfirmSubmitButton
            size="sm"
            confirmMessage={deleteConfirmMessage}
            pendingLabel="Deleting…"
          >
            Delete
          </ConfirmSubmitButton>
        </form>
      </div>

      <FormMessage state={publishState} />
      <FormMessage state={deleteState} />
    </div>
  );
}
