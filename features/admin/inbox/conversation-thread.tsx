import { queueReply } from './actions';
import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ConversationSummary } from '@/lib/admin';
import { siteConfig } from '@/lib/config/site';
import { formatRelativeTime } from '@/lib/format';

export function ConversationThread({
  conversation,
  locale,
  copy,
}: {
  conversation?: ConversationSummary;
  locale: string;
  copy: {
    assigned: string;
    unassigned: string;
    systemMessage: string;
    replyPlaceholder: string;
    send: string;
    empty: string;
  };
}) {
  if (!conversation) {
    return (
      <div className="grid flex-1 place-items-center p-8 text-sm text-muted-foreground">
        {copy.empty}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col">
      <header className="flex min-h-20 items-center justify-between gap-5 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <ChannelAvatar source={conversation.source} />
          <div className="min-w-0">
            <strong className="block truncate text-sm font-medium">
              {conversation.contact}
            </strong>
            <small className="mt-1 block truncate text-sm text-muted-foreground">
              {conversation.subject}
            </small>
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <span className="block text-sm text-muted-foreground">
            {copy.assigned}
          </span>
          <strong className="mt-1 block text-sm font-medium">
            {conversation.assignedTo ?? copy.unassigned}
          </strong>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 bg-black/25 p-5 sm:p-8">
        <time className="self-center rounded-full border border-border bg-surface px-2.5 py-1 text-sm text-muted-foreground">
          {formatRelativeTime(conversation.lastMessageAt, locale)}
        </time>
        <article className="max-w-[88%] rounded-lg border border-border bg-surface p-4 sm:max-w-[72%]">
          <span className="text-sm font-medium">{conversation.contact}</span>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {conversation.preview}
          </p>
        </article>
        <article className="max-w-[88%] self-end rounded-lg border border-signal/25 bg-signal/10 p-4 sm:max-w-[72%]">
          <span className="text-sm font-medium text-signal-soft">
            {siteConfig.name} system
          </span>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.systemMessage}
          </p>
        </article>
      </div>

      <form
        className="border-t border-border bg-card p-4 sm:p-5"
        action={queueReply}
      >
        <input type="hidden" name="conversationId" value={conversation.id} />
        <Textarea
          name="body"
          maxLength={10_000}
          placeholder={copy.replyPlaceholder}
          aria-label={copy.replyPlaceholder}
          required
          className="min-h-24"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="hidden text-sm text-muted-foreground sm:block">
            {conversation.source} / {conversation.contact}
          </span>
          <Button type="submit" className="ml-auto">
            {copy.send} -&gt;
          </Button>
        </div>
      </form>
    </div>
  );
}
