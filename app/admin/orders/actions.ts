'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db/client';
import { orders } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/guards';
import { parseOrderDraft } from '@/lib/orders/input';
import {
  requireDefaultWorkspace,
  requireWorkspaceAccess,
} from '@/lib/workspaces/service';

export async function createOrder(formData: FormData) {
  const session = await requireAdmin();
  const draft = parseOrderDraft({
    title: formData.get('title'),
    currency: formData.get('currency'),
    value: formData.get('value'),
  });
  const workspace = await requireDefaultWorkspace();

  await requireWorkspaceAccess(workspace.id, session.user.id);
  await db.insert(orders).values({
    workspaceId: workspace.id,
    ownerId: session.user.id,
    title: draft.title,
    status: 'lead',
    currency: draft.currency,
    valueCents: draft.valueCents,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
}
