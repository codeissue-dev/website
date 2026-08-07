'use server';

import { revalidatePath } from 'next/cache';

import { backendRequest } from '@/lib/backend/client';
import {
  formRequestId,
  websiteIdempotencyKey,
} from '@/lib/backend/idempotency';
import { requireAdmin } from '@/lib/auth/guards';
import { parseOrderDraft } from '@/lib/orders/input';

export async function createOrder(formData: FormData) {
  const session = await requireAdmin();
  const draft = parseOrderDraft({
    title: formData.get('title'),
    currency: formData.get('currency'),
    value: formData.get('value'),
  });
  const idempotencyKey = websiteIdempotencyKey(formRequestId(formData));

  await backendRequest(
    '/v1/intake/orders',
    {
      id: session.user.id,
      role: 'admin',
      name: session.user.name ?? session.user.username,
    },
    {
      method: 'POST',
      headers: { 'idempotency-key': idempotencyKey },
      body: JSON.stringify({
        title: draft.title,
        currency: draft.currency,
        valueCents: draft.valueCents,
        requester: {
          externalId: `admin:${session.user.id}`,
          displayName:
            session.user.name ?? session.user.username ?? 'CodeIssue admin',
        },
      }),
    },
  );

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
}
