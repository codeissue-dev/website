import { and, eq, ne, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import type { UserRole } from "@/lib/auth/roles";
import { hashPassword, normalizeEmail, verifyPassword } from "@/lib/auth/password";
import { ConflictError, NotFoundError, isUniqueViolation } from "@/lib/errors";

export type CreatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

/**
 * Registration.
 *
 * The Credentials provider never creates users, so this is the only path that
 * persists a password. Email uniqueness is enforced by a unique index; the
 * race between check and insert is resolved by handling `23505`.
 */
export async function createUserWithPassword(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<CreatedUser> {
  const email = normalizeEmail(input.email);
  const passwordHash = await hashPassword(input.password);

  try {
    const inserted = await getDb()
      .insert(users)
      .values({
        name: input.name,
        email,
        passwordHash,
        role: input.role ?? "CUSTOMER",
      })
      .returning({ id: users.id, email: users.email, role: users.role });

    const created = inserted[0];
    if (!created) {
      throw new ConflictError("The account could not be created. Please try again.");
    }
    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError("An account with this email already exists.");
    }
    throw error;
  }
}

/** Role management. The last administrator can never be demoted. */
export async function setUserRole(input: {
  userId: string;
  role: UserRole;
}): Promise<void> {
  await getDb().transaction(async (tx) => {
    const rows = await tx
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, input.userId))
      .limit(1)
      .for("update");

    const target = rows[0];
    if (!target) throw new NotFoundError("That user no longer exists.");
    if (target.role === input.role) return;

    if (target.role === "ADMIN") {
      const remaining = await tx
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.role, "ADMIN"), ne(users.id, target.id)))
        .limit(1);

      if (remaining.length === 0) {
        throw new ConflictError(
          "This is the last administrator. Promote another administrator first.",
        );
      }
    }

    await tx
      .update(users)
      .set({ role: input.role, updatedAt: new Date() })
      .where(eq(users.id, target.id));
  });
}

export async function updateUserName(input: {
  userId: string;
  name: string;
}): Promise<void> {
  const updated = await getDb()
    .update(users)
    .set({ name: input.name, updatedAt: new Date() })
    .where(eq(users.id, input.userId))
    .returning({ id: users.id });

  if (updated.length === 0) throw new NotFoundError("That user no longer exists.");
}

export async function changeUserPassword(input: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const db = getDb();
  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, input.userId))
    .limit(1);

  const user = rows[0];
  if (!user) throw new NotFoundError("That user no longer exists.");

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!valid) throw new ConflictError("Your current password is not correct.");

  const passwordHash = await hashPassword(input.newPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));
}

/**
 * Used by the administrator CLI: promotes an existing account, or reports that
 * no such account exists. Never creates credentials implicitly.
 */
export async function promoteExistingUserToAdmin(email: string): Promise<CreatedUser> {
  const normalized = normalizeEmail(email);
  const updated = await getDb()
    .update(users)
    .set({ role: "ADMIN", updatedAt: new Date() })
    .where(eq(users.email, normalized))
    .returning({ id: users.id, email: users.email, role: users.role });

  const user = updated[0];
  if (!user) throw new NotFoundError(`No account exists for ${normalized}.`);
  return user;
}

export async function touchUserUpdatedAt(userId: string): Promise<void> {
  await getDb()
    .update(users)
    .set({ updatedAt: sql`now()` })
    .where(eq(users.id, userId));
}
