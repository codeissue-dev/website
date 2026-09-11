"use client";

import { useTranslations } from "next-intl";

import type { ConnectionState } from "@/components/realtime/use-order-stream";
import { cn } from "@/lib/utils";

const DOT_TONES: Record<ConnectionState, string> = {
  connecting: "bg-caution",
  open: "bg-positive",
  reconnecting: "bg-caution",
  offline: "bg-ink-subtle",
};

/** Honest connection state: it reflects the socket, not a decorative animation. */
export function ConnectionIndicator({
  state,
  className,
}: {
  state: ConnectionState;
  className?: string;
}) {
  const t = useTranslations("Realtime");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-ink-muted",
        className,
      )}
      title={t(`${state}Hint`)}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-pill", DOT_TONES[state])}
      />
      <span aria-live="polite">{t(state)}</span>
    </span>
  );
}
