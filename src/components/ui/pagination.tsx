import { ButtonLink, buttonClass } from "@/components/ui/button";

/** Server-rendered pagination: every page is a real, shareable route. */
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
  const disabledClass = buttonClass({
    variant: "secondary",
    size: "sm",
    className: "pointer-events-none",
  });

  return (
    <nav
      aria-label={`${itemLabel} pagination`}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-xs text-ink-muted" aria-live="polite">
        Page {page} of {Math.max(pageCount, 1)}, {total} {itemLabel} in total
      </p>
      <div className="flex items-center gap-2">
        {previousPage === null ? (
          <span aria-disabled="true" className={disabledClass}>
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
          <span aria-disabled="true" className={disabledClass}>
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
