"use client";

import { useActionState } from "react";

import { firstFieldError, idleActionState } from "@/actions/state";
import { setUserRoleAction } from "@/actions/users";
import { SelectField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/auth/roles";

const ROLE_OPTIONS = USER_ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

export function UserRoleForm({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: UserRole;
  isSelf: boolean;
}) {
  const [state, formAction] = useActionState(setUserRoleAction, idleActionState);

  if (isSelf) {
    return (
      <p className="text-xs text-ink-subtle">
        You cannot change your own role. Ask another administrator if you need it
        changed.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="userId" value={userId} />
      <SelectField
        id={`role-${userId}`}
        name="role"
        label="Role"
        defaultValue={role}
        options={ROLE_OPTIONS}
        error={firstFieldError(state, "role")}
      />
      <FormMessage state={state} />
      <div className="flex justify-end">
        <SubmitButton size="sm" variant="secondary" pendingLabel="Saving...">
          Update role
        </SubmitButton>
      </div>
    </form>
  );
}
