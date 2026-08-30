"use client";

import { useEffect, useRef } from "react";

import { markOrderReadAction } from "@/actions/chat";
import { ChatComposer } from "@/components/orders/chat-composer";
import { ChatThread } from "@/components/orders/chat-thread";
import { StatusTimeline } from "@/components/orders/status-timeline";
import { ConnectionIndicator } from "@/components/realtime/connection-indicator";
import { useOrderStream } from "@/components/realtime/use-order-stream";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderStatus } from "@/lib/orders/status";
import type { ChatMessagePayload, StatusEventPayload } from "@/lib/realtime/events";

/**
 * The live half of the order page: conversation and status history.
 *
 * Both lists are seeded by the server render and then kept current by one
 * WebSocket subscription for this order, so a single connection serves both.
 */
export function OrderRealtimePanel({
  orderId,
  viewerId,
  canWrite,
  initialStatus,
  initialMessages,
  initialEvents,
  initialHistoryComplete,
}: {
  orderId: string;
  viewerId: string;
  canWrite: boolean;
  initialStatus: OrderStatus;
  initialMessages: ChatMessagePayload[];
  initialEvents: StatusEventPayload[];
  initialHistoryComplete: boolean;
}) {
  const stream = useOrderStream({
    orderId,
    initialStatus,
    initialMessages,
    initialEvents,
    initialHistoryComplete,
  });

  const markedCountRef = useRef(-1);

  // Read state is stored once per order, not by rewriting historical messages.
  useEffect(() => {
    if (document.visibilityState !== "visible") return;
    if (markedCountRef.current === stream.messages.length) return;
    markedCountRef.current = stream.messages.length;
    void markOrderReadAction(orderId);
  }, [orderId, stream.messages.length]);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel className="flex flex-col lg:col-span-2">
        <PanelHeader
          title="Project conversation"
          description="Shared with the codeissue team working on this project."
          actions={<ConnectionIndicator state={stream.connection} />}
        />
        {stream.notice ? (
          <p
            role="status"
            className="border-b border-line bg-surface-muted px-4 py-2 text-xs text-ink-muted sm:px-5"
          >
            {stream.notice}
          </p>
        ) : null}
        <ChatThread
          messages={stream.messages}
          viewerId={viewerId}
          historyComplete={stream.historyComplete}
        />
        {canWrite ? (
          <ChatComposer orderId={orderId} />
        ) : (
          <p className="border-t border-line px-4 py-3 text-xs text-ink-muted sm:px-5">
            This conversation is read-only for your role.
          </p>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="Status history"
          actions={<StatusBadge status={stream.status} />}
        />
        <PanelBody>
          <StatusTimeline events={[...stream.events].reverse()} />
        </PanelBody>
      </Panel>
    </div>
  );
}
