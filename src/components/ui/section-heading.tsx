import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Heading treatment for public-site sections: the title, then an optional
 * sentence of context. The whole block reveals once on scroll.
 */
export function SectionHeading({
  id,
  title,
  description,
  className,
}: {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-heading", className)}>
      <Reveal>
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {description ? <p className="section-description">{description}</p> : null}
      </Reveal>
    </div>
  );
}
