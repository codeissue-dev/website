import { and, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { brandConfig } from '@/lib/brand/config';
import { workspaceMembers, workspaces } from '@/db/schema';

export const DEFAULT_WORKSPACE_SLUG = brandConfig.workspace.slug;

export async function findWorkspaceBySlug(slug = DEFAULT_WORKSPACE_SLUG) {
  const [workspace] = await db
    .select({ id: workspaces.id, slug: workspaces.slug, name: workspaces.name })
    .from(workspaces)
    .where(eq(workspaces.slug, slug))
    .limit(1);

  return workspace ?? null;
}

export async function hasWorkspaceAccess(workspaceId: string, userId: string) {
  const [membership] = await db
    .select({ userId: workspaceMembers.userId })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
      ),
    )
    .limit(1);

  return Boolean(membership);
}

export async function ensureWorkspaceMembership(
  workspaceId: string,
  userId: string,
) {
  await db
    .insert(workspaceMembers)
    .values({ workspaceId, userId, role: 'user' })
    .onConflictDoNothing();
}

export async function requireWorkspaceAccess(
  workspaceId: string,
  userId: string,
) {
  if (!(await hasWorkspaceAccess(workspaceId, userId))) {
    throw new Error('Workspace access denied.');
  }
}

export async function ensureDefaultWorkspace() {
  const [workspace] = await db
    .insert(workspaces)
    .values({ name: brandConfig.workspace.name, slug: DEFAULT_WORKSPACE_SLUG })
    .onConflictDoUpdate({
      target: workspaces.slug,
      set: { name: brandConfig.workspace.name },
    })
    .returning({
      id: workspaces.id,
      slug: workspaces.slug,
      name: workspaces.name,
    });

  if (!workspace) throw new Error('Workspace could not be initialized.');
  return workspace;
}

export async function requireDefaultWorkspace() {
  const workspace = await findWorkspaceBySlug();
  if (!workspace) throw new Error('Workspace is not initialized.');
  return workspace;
}
