import { queueReply } from '@/app/admin/inbox/actions';
import { getConversations } from '@/lib/admin';
import { formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

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
      <div className="admin-page-heading admin-page-heading--compact">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
      </div>

      <section className="inbox-workspace">
        <aside className="inbox-list-pane">
          <div className="inbox-search">
            <input
              type="search"
              placeholder={page.search}
              aria-label={page.search}
            />
            <div>
              <button type="button" className="is-active">
                {page.all}
              </button>
              <button type="button">{page.unread}</button>
            </div>
          </div>
          <div className="inbox-conversations">
            {result.data.map((conversation, index) => (
              <article
                key={conversation.id}
                className={index === 0 ? 'is-active' : ''}
              >
                <div className="channel-avatar">
                  {conversation.source.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <header>
                    <strong>{conversation.contact}</strong>
                    <time>
                      {formatRelativeTime(conversation.lastMessageAt, lng)}
                    </time>
                  </header>
                  <span>{conversation.subject}</span>
                  <p>{conversation.preview}</p>
                </div>
                {conversation.unreadCount > 0 ? (
                  <b>{conversation.unreadCount}</b>
                ) : null}
              </article>
            ))}
          </div>
        </aside>

        <div className="inbox-thread-pane">
          {selected ? (
            <>
              <header className="thread-header">
                <div>
                  <span className="channel-avatar">
                    {selected.source.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <strong>{selected.contact}</strong>
                    <small>{selected.subject}</small>
                  </div>
                </div>
                <div className="thread-assignee">
                  <span>{page.assigned}</span>
                  <strong>{selected.assignedTo ?? page.unassigned}</strong>
                </div>
              </header>
              <div className="thread-messages">
                <time>{formatRelativeTime(selected.lastMessageAt, lng)}</time>
                <article className="message-bubble is-inbound">
                  <span>{selected.contact}</span>
                  <p>{selected.preview}</p>
                </article>
                <article className="message-bubble is-internal">
                  <span>Codeissue system</span>
                  <p>{page.systemMessage}</p>
                </article>
              </div>
              <form className="thread-composer" action={queueReply}>
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
                />
                <div>
                  <span>
                    {selected.source} · {selected.contact}
                  </span>
                  <button type="submit">{page.send} →</button>
                </div>
              </form>
            </>
          ) : (
            <div className="inbox-empty">{page.empty}</div>
          )}
        </div>
      </section>
    </main>
  );
}
