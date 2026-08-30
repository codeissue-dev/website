"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { toActionFailure } from "@/actions/error-mapping";
import {
  actionFailure,
  actionSuccess,
  invalidInput,
  type ActionState,
} from "@/actions/state";
import { signIn, signOut } from "@/auth";
import { requireActor } from "@/lib/auth/actor";
import {
  changeUserPassword,
  createUserWithPassword,
  updateUserName,
} from "@/lib/users/mutations";
import {
  changePasswordSchema,
  credentialsSchema,
  profileSchema,
  registerSchema,
} from "@/lib/validation/auth";
import { formText } from "@/lib/validation/form";

const DEFAULT_SIGNED_IN_PATH = "/dashboard";

/** Only internal, non-protocol-relative paths are accepted as redirect targets. */
function safeNextPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return DEFAULT_SIGNED_IN_PATH;
  return value;
}

/**
 * Registration.
 *
 * The Credentials provider authenticates, it never creates accounts, so this
 * action owns validation, email normalization, hashing and persistence, then
 * establishes the session through the same provider.
 */
export async function registerAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formText(formData, "name"),
    email: formText(formData, "email"),
    password: formText(formData, "password"),
    confirmPassword: formText(formData, "confirmPassword"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    await createUserWithPassword({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // The account exists; only the automatic sign-in failed.
      return actionFailure("Your account was created. Please sign in to continue.");
    }
    return toActionFailure(error, "registerAction failed");
  }

  redirect(DEFAULT_SIGNED_IN_PATH);
}

/**
 * Sign in. Failures are deliberately indistinguishable: an unknown email and a
 * wrong password produce the same message, so the form cannot be used to
 * enumerate accounts.
 */
export async function signInAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formText(formData, "email"),
    password: formText(formData, "password"),
  });
  if (!parsed.success) {
    return actionFailure("Enter your email address and password.");
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return actionFailure("Those sign-in details are not correct.");
    }
    return toActionFailure(error, "signInAction failed");
  }

  redirect(safeNextPath(formText(formData, "next")));
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function updateProfileAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = profileSchema.safeParse({ name: formText(formData, "name") });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await updateUserName({ userId: actor.id, name: parsed.data.name });
    revalidatePath("/account");
    return actionSuccess("Your profile has been updated.");
  } catch (error) {
    return toActionFailure(error, "updateProfileAction failed");
  }
}

export async function changePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formText(formData, "currentPassword"),
    password: formText(formData, "password"),
    confirmPassword: formText(formData, "confirmPassword"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await changeUserPassword({
      userId: actor.id,
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.password,
    });
    return actionSuccess("Your password has been changed.");
  } catch (error) {
    return toActionFailure(error, "changePasswordAction failed");
  }
}
