import type { ReactNode } from "react";

import type { SplitHeading } from "@/content/landing";
import { cn } from "@/lib/utils";

/**
 * A heading whose last phrase is highlighted.
 *
 * The split lives in the content module as plain strings, so copy stays free of
 * markup and the highlight remains a styling decision.
 */
export function SplitTitle({
  heading,
  accentClassName = "heading-accent",
}: {
  heading: SplitHeading;
  accentClassName?: string;
}) {
  return (
    <>
      {heading.lead} <span className={accentClassName}>{heading.accent}</span>
    </>
  );
}

type SectionHeadingProps = {
  id?: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  className?: string;
  accentClassName?: string;
} & ({ heading: SplitHeading; title?: never } | { title: ReactNode; heading?: never });

/** Shared heading treatment for public-site content sections. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  heading,
  description,
  className,
  accentClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("section-heading", className)}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="section-title">
        {heading ? (
          <SplitTitle heading={heading} accentClassName={accentClassName} />
        ) : (
          title
        )}
      </h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
