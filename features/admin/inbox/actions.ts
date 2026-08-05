'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db/client';
import { conversations, integrationEvents, messages } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/guards';
import { siteConfig } from '@/lib/config/site';
import { parseReplyDraft } from '@/lib/inbox/input';
import { requireWorkspaceAccess } from '@/lib/workspaces/service';

export async function queueReply(formData: FormData) {
  const session = await requireAdmin();
  const draft = parseReplyDraft({
    conversationId: formData.get('conversationId'),
    body: formData.get('body'),
  });

  const [conversation] = await db
    .select({
      id: conversations.id,
      workspaceId: conversations.workspaceId,
      integrationId: conversations.integrationId,
    })
    .from(conversations)
    .where(eq(conversations.id, draft.conversationId))
    .limit(1);

  if (!conversation) throw new Error('Conversation not found.');
  await requireWorkspaceAccess(conversation.workspaceId, session.user.id);

  await db.transaction(async (tx) => {
    const now = new Date();
    const [message] = await tx
      .insert(messages)
      .values({
        conversationId: conversation.id,
        direction: 'outbound',
        authorName:
          session.user.name ?? session.user.username ?? siteConfig.name,
        body: draft.body,
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
        body: draft.body,
      },
    });
  });

  revalidatePath('/admin');
  revalidatePath('/admin/inbox');
  revalidatePath('/admin/events');
}
