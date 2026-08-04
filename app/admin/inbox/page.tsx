import { queueReply } from '@/app/admin/inbox/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { buttonVariants } from '@/components/ui/button';
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

      <section className="mt-8 grid min-h-[42rem] overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(255,255,255,0.035)_inset] lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-b border-border lg:border-r lg:border-b-0">
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
                  'border-white/15 bg-white/[0.08] text-foreground',
                )}
              >
                {page.all}
              </button>
              <button type="button" className={compactButton}>
                {page.unread}
              </button>
            </div>
          </div>
          <div className="max-h-[28rem] overflow-y-auto lg:max-h-[calc(42rem-7rem)]">
            {result.data.map((conversation, index) => (
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
                      {formatRelativeTime(conversation.lastMessageAt, lng)}
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

        <div className="flex min-w-0 flex-col">
          {selected ? (
            <>
              <header className="flex min-h-20 items-center justify-between gap-5 border-b border-border px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <ChannelAvatar source={selected.source} />
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-medium">
                      {selected.contact}
                    </strong>
                    <small className="mt-1 block truncate text-sm text-muted-foreground">
                      {selected.subject}
                    </small>
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <span className="block text-sm text-muted-foreground">
                    {page.assigned}
                  </span>
                  <strong className="mt-1 block text-sm font-medium">
                    {selected.assignedTo ?? page.unassigned}
                  </strong>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 bg-black/25 p-5 sm:p-8">
                <time className="self-center rounded-full border border-border bg-surface px-2.5 py-1 text-sm text-muted-foreground">
                  {formatRelativeTime(selected.lastMessageAt, lng)}
                </time>
                <article className="max-w-[88%] rounded-lg border border-border bg-surface p-4 sm:max-w-[72%]">
                  <span className="text-sm font-medium">
                    {selected.contact}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selected.preview}
                  </p>
                </article>
                <article className="max-w-[88%] self-end rounded-lg border border-signal/25 bg-signal/10 p-4 sm:max-w-[72%]">
                  <span className="text-sm font-medium text-signal-soft">
                    Codeissue system
                  </span>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {page.systemMessage}
                  </p>
                </article>
              </div>
              <form
                className="border-t border-border bg-card p-4 sm:p-5"
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
                  className={cn(textareaClass, 'min-h-24 resize-y')}
                />
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {selected.source} / {selected.contact}
                  </span>
                  <button
                    type="submit"
                    className={buttonVariants({
                      size: 'md',
                      className: 'ml-auto',
                    })}
                  >
                    {page.send} -&gt;
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
