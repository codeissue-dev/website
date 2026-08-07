import '@/lib/env/load-local-env';

import { eq } from 'drizzle-orm';

import { db, pool } from '@/db/client';
import { users, workspaceMembers, workspaces } from '@/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { brandConfig } from '@/lib/brand/config';
import { DEFAULT_WORKSPACE_SLUG } from '@/lib/workspaces/service';

const adminUsername = (process.env.ADMIN_USERNAME ?? 'admin')
  .trim()
  .toLowerCase();

function getAdminPassword(): string {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD is required. Copy .env.example to .env and set a strong password.',
    );
  }

  return adminPassword;
}

async function seed() {
  const passwordHash = await hashPassword(getAdminPassword());

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, adminUsername))
    .limit(1);

  const [admin] = existingUser
    ? await db
        .update(users)
        .set({
          name: existingUser.name ?? `${brandConfig.name} admin`,
          username: adminUsername,
          passwordHash,
          role: 'admin',
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning()
    : await db
        .insert(users)
        .values({
          name: `${brandConfig.name} admin`,
          username: adminUsername,
          email: null,
          passwordHash,
          role: 'admin',
        })
        .returning();

  const [workspace] = await db
    .insert(workspaces)
    .values({ name: brandConfig.workspace.name, slug: DEFAULT_WORKSPACE_SLUG })
    .onConflictDoUpdate({
      target: workspaces.slug,
      set: { name: brandConfig.workspace.name },
    })
    .returning();

  await db
    .insert(workspaceMembers)
    .values({ workspaceId: workspace.id, userId: admin.id, role: 'admin' })
    .onConflictDoUpdate({
      target: [workspaceMembers.workspaceId, workspaceMembers.userId],
      set: { role: 'admin' },
    });

  console.log(
    `Seeded ${brandConfig.name} authentication and workspace metadata. Admin: ${adminUsername}`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
