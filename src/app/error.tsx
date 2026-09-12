"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("Errors");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="section-title">{t("errorTitle")}</h1>
      <p className="text-sm leading-relaxed text-ink-muted">{t("errorBody")}</p>
      {error.digest ? (
        <p className="font-mono text-xs text-ink-subtle">
          {t("errorReference", { digest: error.digest })}
        </p>
      ) : null}
      <Button
        onClick={() => {
          reset();
        }}
        size="sm"
        className="mt-2"
      >
        {t("tryAgain")}
      </Button>
    </div>
  );
}
