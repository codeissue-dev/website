'use client';

import { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Dictionary } from '@/lib/i18n';

import { sendProjectMessage } from '../actions';

export function ProjectMessageForm({
  projectId,
  copy,
}: {
  projectId: string;
  copy: Dictionary['dashboard'];
}) {
  const [requestId] = useState(() => crypto.randomUUID());
  const action = sendProjectMessage.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="border-t border-border p-4 sm:p-5">
      <input type="hidden" name="requestId" value={requestId} />
      <Textarea
        name="message"
        required
        minLength={1}
        maxLength={5000}
        rows={4}
        placeholder={copy.messagePlaceholder}
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {state.error
            ? copy.messageError
            : state.sent
              ? copy.messageSent
              : copy.messageHint}
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? copy.sending : copy.sendMessage}
        </Button>
      </div>
    </form>
  );
}
