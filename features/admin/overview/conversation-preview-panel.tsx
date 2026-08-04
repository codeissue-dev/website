import Link from 'next/link';

import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { ArrowRightIcon } from '@/components/icons';
import { Panel, PanelHeader } from '@/components/ui/panel';
import type { ConversationSummary } from '@/lib/admin';
import { formatRelativeTime } from '@/lib/format';

export function ConversationPreviewPanel({
  conversations,
  locale,
  eyebrow,
  title,
  viewAll,
}: {
  conversations: ConversationSummary[];
  locale: string;
  eyebrow: string;
  title: string;
  viewAll: string;
}) {
  return (
    <Panel className="xl:row-span-2">
      <PanelHeader
        eyebrow={eyebrow}
        title={title}
        action={<PanelLink href="/admin/inbox" label={viewAll} />}
      />
      <div className="divide-y divide-border">
        {conversations.slice(0, 5).map((conversation) => (
          <article
            key={conversation.id}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 px-5 py-4 transition-colors hover:bg-white/[0.025] sm:px-6"
          >
            <ChannelAvatar source={conversation.source} />
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <strong className="truncate text-sm font-medium">
                  {conversation.contact}
                </strong>
                <time className="shrink-0 text-sm text-muted-foreground">
                  {formatRelativeTime(conversation.lastMessageAt, locale)}
                </time>
              </div>
              <span className="mt-1 block truncate text-sm text-foreground/80">
                {conversation.subject}
              </span>
              <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
                {conversation.preview}
              </p>
            </div>
            {conversation.unreadCount > 0 ? (
              <b className="grid size-6 place-items-center rounded-full bg-white text-sm font-medium text-black">
                {conversation.unreadCount}
              </b>
            ) : null}
          </article>
        ))}
      </div>
    </Panel>
  );
}

function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <ArrowRightIcon className="size-3.5" />
    </Link>
  );
}
