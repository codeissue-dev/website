import { AdminPageHeader } from '@/components/admin/admin-page-header';
import type { ConversationSummary } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';

import { ConversationList } from './conversation-list';
import { ConversationThread } from './conversation-thread';

export function InboxScreen({
  conversations,
  locale,
  copy,
}: {
  conversations: ConversationSummary[];
  locale: string;
  copy: Dictionary;
}) {
  const page = copy.admin.inbox;

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        compact
      />
      <section className="mt-8 grid min-h-[42rem] overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(255,255,255,0.035)_inset] lg:grid-cols-[22rem_minmax(0,1fr)]">
        <ConversationList
          conversations={conversations}
          locale={locale}
          copy={page}
        />
        <ConversationThread
          conversation={conversations[0]}
          locale={locale}
          copy={page}
        />
      </section>
    </main>
  );
}
