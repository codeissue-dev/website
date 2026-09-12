"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/actions/error-mapping";
import { actionFailure, actionSuccess, type ActionState } from "@/actions/state";
import { invalidInput } from "@/actions/invalid-input";
import { getTranslations } from "next-intl/server";
import { requireActor } from "@/lib/auth/actor";
import { assertCanManageUsers } from "@/lib/auth/rbac";
import { setUserRole } from "@/lib/users/mutations";
import { formText } from "@/lib/validation/form";
import { setUserRoleSchema } from "@/lib/validation/users";

/**
 * Role management.
 *
 * Administrators only, and an administrator cannot change their own role: that
 * prevents a single mis-click from locking the workspace out of administration
 * (the last-administrator rule in the data layer is the second guard).
 */
export async function setUserRoleAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const t = await getTranslations("Actions");
  const parsed = setUserRoleSchema.safeParse({
    userId: formText(formData, "userId"),
    role: formText(formData, "role"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    assertCanManageUsers(actor);

    if (actor.id === parsed.data.userId) {
      return actionFailure(t("ownRole"));
    }

    await setUserRole({ userId: parsed.data.userId, role: parsed.data.role });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return actionSuccess(t("roleUpdated"));
  } catch (error) {
    return toActionFailure(error, "setUserRoleAction failed");
  }
}
