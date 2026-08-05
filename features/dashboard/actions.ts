'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db/client';
import { conversations, messages, orders } from '@/db/schema';
import { requireUser } from '@/lib/auth/guards';

export type ProjectMessageState = { error?: string; sent?: boolean };

export async function sendProjectMessage(
  projectId: string,
  _previousState: ProjectMessageState,
  formData: FormData,
): Promise<ProjectMessageState> {
  const session = await requireUser(`/dashboard/projects/${projectId}`);
  const body = String(formData.get('message') ?? '').trim();

  if (body.length < 1 || body.length > 5000) {
    return { error: 'invalid_message' };
  }

  try {
    await db.transaction(async (tx) => {
      const [project] = await tx
        .select({
          id: orders.id,
          title: orders.title,
          workspaceId: orders.workspaceId,
          conversationId: orders.conversationId,
        })
        .from(orders)
        .where(
          and(
            eq(orders.id, projectId),
            eq(orders.requestedById, session.user.id),
          ),
        )
        .limit(1);

      if (!project) throw new Error('project_not_found');

      let conversationId = project.conversationId;
      if (!conversationId) {
        const [conversation] = await tx
          .insert(conversations)
          .values({
            workspaceId: project.workspaceId,
            subject: project.title,
            status: 'open',
            unreadCount: 1,
            lastMessageAt: new Date(),
          })
          .returning({ id: conversations.id });

        if (!conversation) throw new Error('conversation_not_created');
        conversationId = conversation.id;

        await tx
          .update(orders)
          .set({ conversationId, updatedAt: new Date() })
          .where(eq(orders.id, project.id));
      } else {
        await tx
          .update(conversations)
          .set({
            unreadCount: 1,
            status: 'open',
            lastMessageAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(conversations.id, conversationId));
      }

      await tx.insert(messages).values({
        conversationId,
        direction: 'inbound',
        authorName:
          session.user.name ?? session.user.username ?? 'project member',
        body,
      });
    });
  } catch (error) {
    console.error('Project message could not be sent.', error);
    return { error: 'service_unavailable' };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath('/dashboard/messages');
  return { sent: true };
}
