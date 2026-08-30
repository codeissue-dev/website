export const USER_ROLES = ["CUSTOMER", "EXECUTOR", "ADMIN"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = "CUSTOMER";

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.some((role) => role === value);
}

/**
 * Narrows an untrusted role-ish value to a role, defaulting to the least
 * privileged role. Used when reading role claims that are not authoritative.
 */
export function toUserRoleOrDefault(value: unknown): UserRole {
  return isUserRole(value) ? value : DEFAULT_USER_ROLE;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  EXECUTOR: "Executor",
  ADMIN: "Administrator",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  CUSTOMER: "Submits project requests and follows their own orders.",
  EXECUTOR: "Delivers assigned projects and moves them through the workflow.",
  ADMIN: "Runs the pipeline: assignment, statuses, users and public content.",
};
