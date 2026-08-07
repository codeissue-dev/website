'use server';

import { revalidatePath } from 'next/cache';

import { backendRequest } from '@/lib/backend/client';
import {
  formRequestId,
  websiteIdempotencyKey,
} from '@/lib/backend/idempotency';
import { requireAdmin } from '@/lib/auth/guards';
import { siteConfig } from '@/lib/config/site';
import { parseReplyDraft } from '@/lib/inbox/input';

export async function queueReply(formData: FormData) {
  const session = await requireAdmin();
  const draft = parseReplyDraft({
    conversationId: formData.get('conversationId'),
    body: formData.get('body'),
  });

  const externalMessageId = websiteIdempotencyKey(formRequestId(formData));

  await backendRequest(
    `/v1/conversations/${encodeURIComponent(draft.conversationId)}/messages`,
    {
      id: session.user.id,
      role: 'admin',
      name: session.user.name ?? session.user.username ?? siteConfig.name,
    },
    {
      method: 'POST',
      body: JSON.stringify({
        externalMessageId,
        body: draft.body,
      }),
    },
  );

  revalidatePath('/admin');
  revalidatePath('/admin/inbox');
  revalidatePath('/admin/events');
}
