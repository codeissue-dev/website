import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import type { UserRole } from "@/lib/auth/roles";
import { ForbiddenError, UnauthenticatedError } from "@/lib/errors";
import { loadUserById, type PublicUser } from "@/lib/users/queries";

/**
 * The authenticated actor.
 *
 * The session cookie proves *who* the visitor is; the role is always re-read
 * from Postgres so a stale JWT can never grant privileges after a demotion.
 */
export type Actor = PublicUser;

export async function getActor(): Promise<Actor | null> {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return null;
  return loadUserById(userId);
}

/** For server actions and route handlers: throws, callers map to safe errors. */
export async function requireActor(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) throw new UnauthenticatedError();
  return actor;
}

export async function requireRole(roles: readonly UserRole[]): Promise<Actor> {
  const actor = await requireActor();
  if (!roles.includes(actor.role)) {
    throw new ForbiddenError("You do not have access to this action.");
  }
  return actor;
}

export function buildSignInPath(nextPath?: string): string {
  if (!nextPath || !nextPath.startsWith("/")) return "/sign-in";
  return `/sign-in?next=${encodeURIComponent(nextPath)}`;
}

/** For pages and layouts: sends unauthenticated visitors to sign in. */
export async function requireActorForPage(nextPath?: string): Promise<Actor> {
  const actor = await getActor();
  if (!actor) redirect(buildSignInPath(nextPath));
  return actor;
}

/**
 * For role-gated pages. Responds with the not-found view rather than a
 * "forbidden" page so unauthorized users learn nothing about the route.
 */
export async function requireRoleForPage(
  roles: readonly UserRole[],
  nextPath?: string,
): Promise<Actor> {
  const actor = await requireActorForPage(nextPath);
  if (!roles.includes(actor.role)) notFound();
  return actor;
}
