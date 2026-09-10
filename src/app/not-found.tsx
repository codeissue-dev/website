import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("Errors");

  return (
    <div className="page-enter mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="section-eyebrow">
        <span className="eyebrow-dot text-critical" />
        404
      </p>
      <h1 className="section-title">{t("notFoundTitle")}</h1>
      <p className="max-w-lg text-sm leading-relaxed text-ink-muted">
        {t("notFoundBody")}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="sm">
          {t("notFoundHome")}
        </ButtonLink>
        <ButtonLink href="/dashboard" variant="secondary" size="sm">
          {t("notFoundDashboard")}
        </ButtonLink>
      </div>
    </div>
  );
}
