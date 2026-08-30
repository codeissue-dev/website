"use client";

import { useEffect, useRef } from "react";

import { roleLabel } from "@/components/ui/status-badge";
import type { ChatMessagePayload } from "@/lib/realtime/events";
import { cn, formatDateTime, toIsoString } from "@/lib/utils";

/**
 * Persisted conversation for one order. Every entry shown here exists as an
 * `order_messages` row; nothing is rendered from local state alone.
 */
export function ChatThread({
  messages,
  viewerId,
  historyComplete,
}: {
  messages: ChatMessagePayload[];
  viewerId: string;
  historyComplete: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastCountRef = useRef(0);

  useEffect(() => {
    const node = scrollRef.current;
    if (node === null) return;
    if (messages.length === lastCountRef.current) return;
    lastCountRef.current = messages.length;
    // Jump, not animate: correct with `prefers-reduced-motion` and cheaper.
    node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  return (
    <div
      ref={scrollRef}
      className="flex max-h-[28rem] min-h-[12rem] flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5"
      aria-label="Project conversation"
      // A log region announces new messages without stealing focus.
      role="log"
      aria-live="polite"
      tabIndex={0}
    >
      {!historyComplete && messages.length > 0 ? (
        <p className="text-center text-xs text-ink-subtle">
          Showing the most recent part of this conversation.
        </p>
      ) : null}

      {messages.length === 0 ? (
        <p className="my-auto text-center text-sm text-ink-muted">
          No messages yet. Anything you write here stays attached to this project.
        </p>
      ) : (
        messages.map((message) => {
          const own = message.sender.id === viewerId;
          return (
            <article
              key={message.id}
              className={cn(
                "flex max-w-[42rem] flex-col gap-1 rounded-panel border px-3 py-2",
                own
                  ? "self-end border-line-strong bg-surface-muted"
                  : "self-start border-line bg-surface",
              )}
            >
              <header className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs font-semibold text-ink">
                  {own
                    ? "You"
                    : (message.sender.name ?? roleLabel(message.sender.role))}
                </span>
                {!own ? (
                  <span className="text-xs text-ink-subtle">
                    {roleLabel(message.sender.role)}
                  </span>
                ) : null}
                <time
                  dateTime={toIsoString(message.createdAt)}
                  className="ml-auto text-xs text-ink-subtle tabular-nums"
                >
                  {formatDateTime(message.createdAt)}
                </time>
              </header>
              <p className="text-sm whitespace-pre-line text-ink">{message.body}</p>
            </article>
          );
        })
      )}
    </div>
  );
}
