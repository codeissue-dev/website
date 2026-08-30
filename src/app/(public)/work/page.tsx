import type { Metadata } from "next";
import Link from "next/link";

import { buttonClass } from "@/components/ui/button";
import { listPublishedPortfolioItems } from "@/lib/content/queries";
import { pluralize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Completed projects",
  description:
    "Custom software projects delivered by codeissue, written up with the problem, the solution and the stack used.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const items = await listPublishedPortfolioItems(60);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-wide text-ink-muted uppercase">
          Portfolio
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Completed projects
        </h1>
        <p className="mt-4 text-ink-muted">
          Every entry here is a project we delivered and were given permission to
          describe. Nothing is published without the customer&rsquo;s approval.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-panel border border-dashed border-line px-6 py-14 text-center">
          <p className="text-sm font-semibold text-ink">Nothing published yet</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted">
            Approved write-ups appear on this page as they are published. In the
            meantime, describe your project and ask us about comparable work &mdash; we
            answer directly in the project chat.
          </p>
          <Link
            href="/register"
            className={buttonClass({ size: "sm", className: "mt-6" })}
          >
            Submit a request
          </Link>
        </div>
      ) : (
        <ul className="mt-12 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="bg-surface">
              <Link
                href={`/work/${item.slug}`}
                className="flex h-full flex-col gap-3 p-5 transition-colors hover:bg-surface-muted"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {item.industry ? (
                    <span className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
                      {item.industry}
                    </span>
                  ) : null}
                  {item.deliveryWeeks !== null ? (
                    <span className="text-xs text-ink-subtle">
                      {item.deliveryWeeks}{" "}
                      {pluralize(item.deliveryWeeks, "week", "weeks")} to delivery
                    </span>
                  ) : null}
                </div>
                <h2 className="text-base font-semibold text-ink">{item.title}</h2>
                <p className="text-sm text-ink-muted">{item.summary}</p>
                {item.techStack.length > 0 ? (
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {item.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-ink-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <span className="text-sm font-medium text-ink">Read the write-up</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
