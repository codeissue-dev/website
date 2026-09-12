"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { firstFieldError, idleActionState } from "@/actions/state";
import { setUserRoleAction } from "@/actions/users";
import { SelectField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { USER_ROLES, type UserRole } from "@/lib/auth/roles";

export function UserRoleForm({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: UserRole;
  isSelf: boolean;
}) {
  const t = useTranslations("UserRoleForm");
  const tRoles = useTranslations("Roles");
  const [state, formAction] = useActionState(setUserRoleAction, idleActionState);
  const roleOptions = USER_ROLES.map((userRole) => ({
    value: userRole,
    label: tRoles(userRole),
  }));

  if (isSelf) {
    return <p className="text-xs text-ink-subtle">{t("selfNote")}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="userId" value={userId} />
      <SelectField
        id={`role-${userId}`}
        name="role"
        label={t("role")}
        defaultValue={role}
        options={roleOptions}
        error={firstFieldError(state, "role")}
      />
      <FormMessage state={state} />
      <div className="flex justify-end">
        <SubmitButton size="sm" variant="secondary" pendingLabel={t("saving")}>
          {t("update")}
        </SubmitButton>
      </div>
    </form>
  );
}
