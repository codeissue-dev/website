'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db/client';
import {
  conversations,
  integrationEvents,
  messages,
  workspaceMembers,
} from '@/db/schema';
import { requireAdmin } from '@/lib/auth/guards';

export async function queueReply(formData: FormData) {
  const session = await requireAdmin();
  const conversationId = String(formData.get('conversationId') ?? '');
  const body = String(formData.get('body') ?? '').trim();

  if (!/^[0-9a-f-]{36}$/i.test(conversationId)) {
    throw new Error('Invalid conversation ID.');
  }
  if (!body || body.length > 10_000) {
    throw new Error('Reply must contain 1-10000 characters.');
  }

  const [conversation] = await db
    .select({
      id: conversations.id,
      workspaceId: conversations.workspaceId,
      integrationId: conversations.integrationId,
    })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (!conversation) throw new Error('Conversation not found.');

  const [membership] = await db
    .select({ userId: workspaceMembers.userId })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, conversation.workspaceId),
        eq(workspaceMembers.userId, session.user.id),
      ),
    )
    .limit(1);
  if (!membership) throw new Error('Workspace access denied.');

  await db.transaction(async (tx) => {
    const now = new Date();
    const [message] = await tx
      .insert(messages)
      .values({
        conversationId: conversation.id,
        direction: 'outbound',
        authorName: session.user.name ?? session.user.email ?? 'Codeissue',
        body,
        sentAt: now,
      })
      .returning({ id: messages.id });

    await tx
      .update(conversations)
      .set({
        status: 'pending',
        unreadCount: 0,
        lastMessageAt: now,
        updatedAt: now,
      })
      .where(eq(conversations.id, conversation.id));

    await tx.insert(integrationEvents).values({
      workspaceId: conversation.workspaceId,
      integrationId: conversation.integrationId,
      source: 'operator',
      eventType: 'message.outbound.queued',
      externalEventId: `outbound:${message.id}`,
      status: 'received',
      payload: {
        messageId: message.id,
        conversationId: conversation.id,
        requestedBy: session.user.id,
        body,
      },
    });
  });

  revalidatePath('/admin');
  revalidatePath('/admin/inbox');
  revalidatePath('/admin/events');
}
