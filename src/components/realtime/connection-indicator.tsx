import type { ConnectionState } from "@/components/realtime/use-order-stream";
import { cn } from "@/lib/utils";

const LABELS: Record<ConnectionState, string> = {
  connecting: "Connecting",
  open: "Live",
  reconnecting: "Reconnecting",
  offline: "Offline",
};

const DOT_TONES: Record<ConnectionState, string> = {
  connecting: "bg-caution",
  open: "bg-positive",
  reconnecting: "bg-caution",
  offline: "bg-ink-subtle",
};

const DESCRIPTIONS: Record<ConnectionState, string> = {
  connecting: "Opening the live connection.",
  open: "Messages and status changes arrive as they happen.",
  reconnecting:
    "The live connection dropped. Retrying, and missed messages will be requested on reconnect.",
  offline:
    "No live connection. Messages you send are still saved, and the page shows them after a refresh.",
};

/** Honest connection state: it reflects the socket, not a decorative animation. */
export function ConnectionIndicator({
  state,
  className,
}: {
  state: ConnectionState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-ink-muted",
        className,
      )}
      title={DESCRIPTIONS[state]}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-pill", DOT_TONES[state])}
      />
      <span aria-live="polite">{LABELS[state]}</span>
    </span>
  );
}
