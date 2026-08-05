import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ConversationSummary } from '@/lib/admin';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function ConversationList({
  conversations,
  locale,
  copy,
}: {
  conversations: ConversationSummary[];
  locale: string;
  copy: { search: string; all: string; unread: string };
}) {
  return (
    <aside className="border-b border-border lg:border-r lg:border-b-0">
      <div className="border-b border-border p-4">
        <Input
          type="search"
          placeholder={copy.search}
          aria-label={copy.search}
        />
        <div className="mt-3 flex gap-2">
          <Button type="button" variant="secondary" size="sm">
            {copy.all}
          </Button>
          <Button type="button" variant="ghost" size="sm">
            {copy.unread}
          </Button>
        </div>
      </div>
      <div className="max-h-[28rem] overflow-y-auto lg:max-h-[calc(42rem-7rem)]">
        {conversations.map((conversation, index) => (
          <article
            key={conversation.id}
            className={cn(
              'relative grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-b border-border px-4 py-4 transition-colors hover:bg-white/[0.03]',
              index === 0 && 'bg-white/[0.045]',
            )}
          >
            {index === 0 ? (
              <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-signal" />
            ) : null}
            <ChannelAvatar source={conversation.source} />
            <div className="min-w-0">
              <header className="flex items-center justify-between gap-3">
                <strong className="truncate text-sm font-medium">
                  {conversation.contact}
                </strong>
                <time className="shrink-0 text-sm text-muted-foreground">
                  {formatRelativeTime(conversation.lastMessageAt, locale)}
                </time>
              </header>
              <span className="mt-1 block truncate text-sm text-foreground/80">
                {conversation.subject}
              </span>
              <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
                {conversation.preview}
              </p>
            </div>
            {conversation.unreadCount > 0 ? (
              <b className="grid size-5 place-items-center rounded-full bg-white text-sm font-medium text-black">
                {conversation.unreadCount}
              </b>
            ) : null}
          </article>
        ))}
      </div>
    </aside>
  );
}
