import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Spectral marks a section label may carry; values are literal class names. */
const EYEBROW_TONES = {
  accent: "text-accent",
  cyan: "text-cyan",
  violet: "text-violet",
  amber: "text-amber",
  positive: "text-positive",
  pink: "text-pink",
} as const;

export type EyebrowTone = keyof typeof EYEBROW_TONES;

/**
 * Heading treatment for public-site sections: a labelled dot, the section
 * label, the title, then an optional sentence of context. The whole block
 * reveals once on scroll.
 */
export function SectionHeading({
  id,
  eyebrow,
  eyebrowTone,
  title,
  description,
  className,
}: {
  id?: string;
  eyebrow?: string;
  eyebrowTone?: EyebrowTone;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-heading", className)}>
      <Reveal>
        {eyebrow ? (
          <p className="section-eyebrow">
            <span
              className={cn("eyebrow-dot", eyebrowTone && EYEBROW_TONES[eyebrowTone])}
            />
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {description ? <p className="section-description">{description}</p> : null}
      </Reveal>
    </div>
  );
}
