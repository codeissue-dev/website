import Link from "next/link";

import { buttonClass } from "@/components/ui/button";

/**
 * Server-rendered pagination: plain links, so paging works without JavaScript
 * and every page is a real, shareable URL.
 */
export function Pagination({
  page,
  pageCount,
  total,
  hrefForPage,
  itemLabel,
}: {
  page: number;
  pageCount: number;
  total: number;
  hrefForPage: (page: number) => string;
  itemLabel: string;
}) {
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < pageCount ? page + 1 : null;

  return (
    <nav
      aria-label={`${itemLabel} pagination`}
      className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5"
    >
      <p className="text-xs text-ink-muted" aria-live="polite">
        Page {page} of {Math.max(pageCount, 1)} · {total} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        {previousPage === null ? (
          <span
            aria-disabled="true"
            className={buttonClass({
              variant: "secondary",
              size: "sm",
              className: "pointer-events-none opacity-55",
            })}
          >
            Previous
          </span>
        ) : (
          <Link
            href={hrefForPage(previousPage)}
            className={buttonClass({ variant: "secondary", size: "sm" })}
            rel="prev"
          >
            Previous
          </Link>
        )}
        {nextPage === null ? (
          <span
            aria-disabled="true"
            className={buttonClass({
              variant: "secondary",
              size: "sm",
              className: "pointer-events-none opacity-55",
            })}
          >
            Next
          </span>
        ) : (
          <Link
            href={hrefForPage(nextPage)}
            className={buttonClass({ variant: "secondary", size: "sm" })}
            rel="next"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
