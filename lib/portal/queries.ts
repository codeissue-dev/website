import { and, asc, desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { messages, orders } from '@/db/schema';

import type { PortalProject, PortalProjectDetail } from './types';

function mapProject(row: {
  id: string;
  title: string;
  status: PortalProject['status'];
  summary: string | null;
  updatedAt: Date;
  conversationId: string | null;
}): PortalProject {
  return {
    ...row,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getUserProjects(userId: string, limit = 24) {
  const rows = await db
    .select({
      id: orders.id,
      title: orders.title,
      status: orders.status,
      summary: orders.summary,
      updatedAt: orders.updatedAt,
      conversationId: orders.conversationId,
    })
    .from(orders)
    .where(eq(orders.requestedById, userId))
    .orderBy(desc(orders.updatedAt))
    .limit(limit);

  return rows.map(mapProject);
}

export async function getUserProject(
  userId: string,
  projectId: string,
): Promise<PortalProjectDetail | null> {
  const [row] = await db
    .select({
      id: orders.id,
      title: orders.title,
      status: orders.status,
      summary: orders.summary,
      updatedAt: orders.updatedAt,
      conversationId: orders.conversationId,
    })
    .from(orders)
    .where(and(eq(orders.id, projectId), eq(orders.requestedById, userId)))
    .limit(1);

  if (!row) return null;

  const thread = row.conversationId
    ? await db
        .select({
          id: messages.id,
          authorName: messages.authorName,
          body: messages.body,
          direction: messages.direction,
          sentAt: messages.sentAt,
        })
        .from(messages)
        .where(eq(messages.conversationId, row.conversationId))
        .orderBy(asc(messages.sentAt))
    : [];

  return {
    ...mapProject(row),
    messages: thread.map((message) => ({
      ...message,
      sentAt: message.sentAt.toISOString(),
    })),
  };
}
