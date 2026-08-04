'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db/client';
import { orders, workspaceMembers, workspaces } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/guards';

const supportedCurrencies = new Set(['USD', 'EUR', 'RUB']);

export async function createOrder(formData: FormData) {
  const session = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  const currency = String(formData.get('currency') ?? 'USD').toUpperCase();
  const value = Number(String(formData.get('value') ?? '').replace(',', '.'));

  if (title.length < 3 || title.length > 200) {
    throw new Error('Order title must contain 3-200 characters.');
  }
  if (!supportedCurrencies.has(currency)) {
    throw new Error('Unsupported order currency.');
  }
  if (!Number.isFinite(value) || value < 0 || value > 100_000_000) {
    throw new Error('Order value is invalid.');
  }

  const [workspace] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.slug, 'codeissue'))
    .limit(1);
  if (!workspace) throw new Error('Workspace is not initialized.');

  const [membership] = await db
    .select({ userId: workspaceMembers.userId })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspace.id),
        eq(workspaceMembers.userId, session.user.id),
      ),
    )
    .limit(1);
  if (!membership) throw new Error('Workspace access denied.');

  await db.insert(orders).values({
    workspaceId: workspace.id,
    ownerId: session.user.id,
    title,
    status: 'lead',
    currency,
    valueCents: Math.round(value * 100),
  });

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
}
