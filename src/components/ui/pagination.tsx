import { ButtonLink, buttonClass } from "@/components/ui/button";

/** Server-rendered pagination with real shareable Next.js routes. */
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
          <ButtonLink
            href={hrefForPage(previousPage)}
            variant="secondary"
            size="sm"
            rel="prev"
          >
            Previous
          </ButtonLink>
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
          <ButtonLink
            href={hrefForPage(nextPage)}
            variant="secondary"
            size="sm"
            rel="next"
          >
            Next
          </ButtonLink>
        )}
      </div>
    </nav>
  );
}
