import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/button";

/** Shown for both a missing reference and an unavailable project. */
export default function OrderNotFound() {
  const t = useTranslations("Order");

  return (
    <div className="page-enter mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <h1 className="section-title">{t("notFoundTitle")}</h1>
      <p className="text-sm leading-relaxed text-ink-muted">{t("notFoundBody")}</p>
      <ButtonLink href="/orders" size="sm" className="mt-2">
        {t("backToProjects")}
      </ButtonLink>
    </div>
  );
}
