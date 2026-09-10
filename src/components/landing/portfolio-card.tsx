import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { ExternalLinkIcon } from "@/components/ui/icon";
import type { PublishedPortfolioItem } from "@/lib/content/queries";

/** One published project. Every value shown here comes from the CMS row. */
export async function PortfolioCard({ item }: { item: PublishedPortfolioItem }) {
  const t = await getTranslations("Portfolio");

  const meta = [
    item.industry,
    item.deliveryWeeks === null
      ? null
      : t("weeksToDelivery", { weeks: item.deliveryWeeks }),
  ].filter((value): value is string => value !== null && value.length > 0);

  return (
    <article className="project-card">
      {meta.length > 0 ? <p className="project-meta">{meta.join(", ")}</p> : null}
      <h3 className="mt-3">{item.title}</h3>
      <p className="mt-2">{item.summary}</p>
      {item.techStack.length > 0 ? (
        <ul className="project-stack mt-5 flex flex-wrap gap-1.5">
          {item.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
        <Link href={`/work/${item.slug}`} className="project-link">
          {t("readCase")}
        </Link>
        {item.projectUrl ? (
          <Link
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="project-link"
          >
            {t("liveProject")}
            <ExternalLinkIcon />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
