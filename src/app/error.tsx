"use client";

import { Button } from "@/components/ui/button";

/**
 * Root error boundary.
 *
 * Only the framework-provided digest is shown. The message, stack and any
 * database detail stay on the server, where they are logged.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="section-eyebrow">Error</p>
      <h1 className="section-title">Something went wrong on our side</h1>
      <p className="text-sm leading-relaxed text-ink-muted">
        The page could not be rendered. Nothing you submitted was lost if it was already
        saved, and trying again is safe.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-ink-subtle">Reference: {error.digest}</p>
      ) : null}
      <Button
        onClick={() => {
          reset();
        }}
        size="sm"
        className="mt-2"
      >
        Try again
      </Button>
    </div>
  );
}
