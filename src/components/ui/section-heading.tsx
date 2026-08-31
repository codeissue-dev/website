import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Heading treatment for public-site sections: a quiet label, the title in the
 * display face, then an optional sentence of context.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-heading", className)}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
