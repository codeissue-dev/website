import { queueReply } from '@/app/admin/inbox/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { getConversations } from '@/lib/admin';
import { formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { compactButton, fieldClass, textareaClass } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export default async function InboxPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getConversations(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.inbox;
  const selected = result.data[0];

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        compact
      />

      <section className="mt-8 grid min-h-[42rem] overflow-x-auto border border-border bg-surface/40 lg:grid-cols-[22rem_minmax(32rem,1fr)]">
        <aside className="min-w-[20rem] border-r border-border">
          <div className="border-b border-border p-4">
            <input
              type="search"
              placeholder={page.search}
              aria-label={page.search}
              className={fieldClass}
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={cn(
                  compactButton,
                  'border-signal bg-signal/10 text-signal-soft',
                )}
              >
                {page.all}
              </button>
              <button type="button" className={compactButton}>
                {page.unread}
              </button>
            </div>
          </div>
          <div>
            {result.data.map((conversation, index) => (
              <article
                key={conversation.id}
                className={cn(
                  'relative grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-b border-border p-4 transition-colors hover:bg-surface-soft',
                  index === 0 &&
                    'bg-surface-soft before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-signal',
                )}
              >
                <ChannelAvatar source={conversation.source} />
                <div className="min-w-0">
                  <header className="flex items-center justify-between gap-3">
                    <strong className="truncate text-xs">
                      {conversation.contact}
                    </strong>
                    <time className="shrink-0 font-mono text-[0.54rem] text-muted-foreground">
                      {formatRelativeTime(conversation.lastMessageAt, lng)}
                    </time>
                  </header>
                  <span className="mt-1 block truncate text-xs text-foreground/80">
                    {conversation.subject}
                  </span>
                  <p className="mt-2 line-clamp-2 text-[0.7rem] leading-5 text-muted-foreground">
                    {conversation.preview}
                  </p>
                </div>
                {conversation.unreadCount > 0 ? (
                  <b className="grid size-5 place-items-center bg-signal font-mono text-[0.54rem] text-primary-foreground">
                    {conversation.unreadCount}
                  </b>
                ) : null}
              </article>
            ))}
          </div>
        </aside>

        <div className="flex min-w-[32rem] flex-col">
          {selected ? (
            <>
              <header className="flex min-h-20 items-center justify-between gap-5 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <ChannelAvatar source={selected.source} />
                  <div className="min-w-0">
                    <strong className="block truncate text-sm">
                      {selected.contact}
                    </strong>
                    <small className="mt-1 block truncate text-xs text-muted-foreground">
                      {selected.subject}
                    </small>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[0.54rem] uppercase tracking-[0.1em] text-muted-foreground">
                    {page.assigned}
                  </span>
                  <strong className="mt-1 block text-xs">
                    {selected.assignedTo ?? page.unassigned}
                  </strong>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 bg-surface-quiet/60 p-5 sm:p-8">
                <time className="self-center font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted-foreground">
                  {formatRelativeTime(selected.lastMessageAt, lng)}
                </time>
                <article className="max-w-[72%] border border-border bg-surface p-4">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.1em] text-signal">
                    {selected.contact}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selected.preview}
                  </p>
                </article>
                <article className="max-w-[72%] self-end border border-signal/40 bg-signal/10 p-4">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.1em] text-signal-soft">
                    Codeissue system
                  </span>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {page.systemMessage}
                  </p>
                </article>
              </div>
              <form
                className="border-t border-border bg-surface p-4"
                action={queueReply}
              >
                <input
                  type="hidden"
                  name="conversationId"
                  value={selected.id}
                />
                <textarea
                  name="body"
                  maxLength={10_000}
                  placeholder={page.replyPlaceholder}
                  aria-label={page.replyPlaceholder}
                  required
                  className={cn(textareaClass, 'min-h-28 resize-y')}
                />
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.08em] text-muted-foreground">
                    {selected.source} · {selected.contact}
                  </span>
                  <button
                    type="submit"
                    className="inline-flex h-10 min-w-28 items-center justify-center border border-signal bg-signal px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-signal-soft"
                  >
                    {page.send} →
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-sm text-muted-foreground">
              {page.empty}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
