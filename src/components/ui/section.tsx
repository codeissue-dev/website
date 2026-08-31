import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const WIDTHS = {
  default: "max-w-6xl",
  narrow: "max-w-4xl",
  prose: "max-w-3xl",
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

/**
 * The one horizontal measure used across the site.
 *
 * Page width and gutters were repeated in a dozen files before this primitive;
 * changing the measure now happens in a single place.
 */
export function Container({
  children,
  className,
  width = "default",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  width?: ContainerWidth;
  as?: "div" | "header" | "footer" | "nav" | "main";
}) {
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6", WIDTHS[width], className)}>
      {children}
    </Tag>
  );
}

const PADDING = {
  default: "py-20 sm:py-28",
  compact: "py-14 sm:py-20",
  none: "",
} as const;

export type SectionPadding = keyof typeof PADDING;

/**
 * A public-site content band: shared vertical rhythm, hairline divider and the
 * accessible name wiring that every landing section needs.
 */
export function Section({
  children,
  id,
  labelledBy,
  className,
  innerClassName,
  padding = "default",
  width = "default",
  divider = true,
}: {
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  padding?: SectionPadding;
  width?: ContainerWidth;
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("public-section", divider && "border-b border-line", className)}
    >
      <Container width={width} className={cn(PADDING[padding], innerClassName)}>
        {children}
      </Container>
    </section>
  );
}

/**
 * Two-column section body: a sticky heading rail beside the content.
 * Used by the process, workflow, reviews and FAQ sections.
 */
export function SectionSplit({
  aside,
  children,
  className,
  asideClassName,
  sticky = false,
}: {
  aside: ReactNode;
  children: ReactNode;
  className?: string;
  asideClassName?: string;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16",
        className,
      )}
    >
      <div
        className={cn(sticky && "lg:sticky lg:top-28 lg:self-start", asideClassName)}
      >
        {aside}
      </div>
      {children}
    </div>
  );
}
