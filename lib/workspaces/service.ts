import { and, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { workspaceMembers, workspaces } from '@/db/schema';

export const DEFAULT_WORKSPACE_SLUG = 'codeissue';

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

export async function requireWorkspaceAccess(
  workspaceId: string,
  userId: string,
) {
  if (!(await hasWorkspaceAccess(workspaceId, userId))) {
    throw new Error('Workspace access denied.');
  }
}

export async function requireDefaultWorkspace() {
  const workspace = await findWorkspaceBySlug();
  if (!workspace) throw new Error('Workspace is not initialized.');
  return workspace;
}
