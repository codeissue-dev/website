import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/section";
import { FOOTER_COLUMNS } from "@/content/navigation";
import { SITE } from "@/content/site";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            {t("summary")}
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.headingKey} className="flex flex-col gap-3">
            <h2 className="footer-heading">{t(column.headingKey)}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link link-underline">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-1.5 border-t border-line py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>{t("copyright", { year, name: SITE.name })}</p>
        <p>{t("closing")}</p>
      </Container>
    </footer>
  );
}
