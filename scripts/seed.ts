import { and, eq } from 'drizzle-orm';

import { db, pool } from '@/db/client';
import {
  contacts,
  conversations,
  integrationEvents,
  integrations,
  messages,
  orders,
  users,
  workspaceMembers,
  workspaces,
} from '@/db/schema';
import { hashPassword } from '@/lib/auth/password';
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
          name: existingUser.name ?? 'Codeissue Admin',
          username: adminUsername,
          passwordHash,
          role: 'owner',
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning()
    : await db
        .insert(users)
        .values({
          name: 'Codeissue Admin',
          username: adminUsername,
          email: null,
          passwordHash,
          role: 'owner',
        })
        .returning();

  const [workspace] = await db
    .insert(workspaces)
    .values({ name: 'Codeissue', slug: DEFAULT_WORKSPACE_SLUG })
    .onConflictDoUpdate({
      target: workspaces.slug,
      set: { name: 'Codeissue' },
    })
    .returning();

  await db
    .insert(workspaceMembers)
    .values({ workspaceId: workspace.id, userId: admin.id, role: 'owner' })
    .onConflictDoNothing();

  await db
    .insert(integrations)
    .values([
      {
        workspaceId: workspace.id,
        provider: 'telegram',
        displayName: 'Telegram',
        status: 'connected',
        externalAccountId: '@codeissue_dev',
        lastEventAt: new Date(),
      },
      {
        workspaceId: workspace.id,
        provider: 'discord',
        displayName: 'Discord',
        status: 'connected',
        externalAccountId: 'codeissue',
        lastEventAt: new Date(),
      },
      {
        workspaceId: workspace.id,
        provider: 'email',
        displayName: 'Outlook',
        status: 'planned',
        externalAccountId: 'codeissue@outlook.com',
      },
    ])
    .onConflictDoNothing();

  const [telegram] = await db
    .select()
    .from(integrations)
    .where(
      and(
        eq(integrations.workspaceId, workspace.id),
        eq(integrations.provider, 'telegram'),
      ),
    )
    .limit(1);

  const [existingConversation] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.workspaceId, workspace.id),
        eq(conversations.externalThreadId, 'seed-thread-1'),
      ),
    )
    .limit(1);

  let conversation = existingConversation;
  if (!conversation) {
    const [contact] = await db
      .insert(contacts)
      .values({
        workspaceId: workspace.id,
        integrationId: telegram?.id,
        externalId: 'seed-contact-1',
        displayName: 'Alex Morgan',
        email: 'alex@example.com',
        metadata: { source: 'telegram', username: '@alexbuilds' },
      })
      .returning();

    [conversation] = await db
      .insert(conversations)
      .values({
        workspaceId: workspace.id,
        integrationId: telegram?.id,
        contactId: contact.id,
        externalThreadId: 'seed-thread-1',
        subject: 'AI-assisted customer portal',
        status: 'open',
        assignedToId: admin.id,
        unreadCount: 2,
        lastMessageAt: new Date(),
      })
      .returning();

    await db.insert(messages).values([
      {
        conversationId: conversation.id,
        externalMessageId: 'seed-message-1',
        direction: 'inbound',
        authorName: 'Alex Morgan',
        body: 'We need a client portal that combines project updates, files, and billing.',
        sentAt: new Date(Date.now() - 1000 * 60 * 18),
      },
      {
        conversationId: conversation.id,
        externalMessageId: 'seed-message-2',
        direction: 'inbound',
        authorName: 'Alex Morgan',
        body: 'Can the first version be ready for internal review this month?',
        sentAt: new Date(Date.now() - 1000 * 60 * 7),
      },
    ]);

    await db.insert(orders).values({
      workspaceId: workspace.id,
      conversationId: conversation.id,
      ownerId: admin.id,
      title: 'Customer operations portal',
      status: 'discovery',
      currency: 'USD',
      valueCents: 1800000,
      summary:
        'Unified customer workspace with project, file, and billing modules.',
    });
  }

  await db
    .insert(integrationEvents)
    .values({
      workspaceId: workspace.id,
      integrationId: telegram?.id,
      source: 'telegram',
      eventType: 'message.received',
      externalEventId: 'seed-event-1',
      status: 'processed',
      payload: {
        conversationId: conversation.id,
        author: '@alexbuilds',
        preview:
          'Can the first version be ready for internal review this month?',
      },
      processedAt: new Date(),
    })
    .onConflictDoNothing();

  console.log(`Seeded Codeissue workspace. Admin: ${adminUsername}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
