import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const WIDTHS = {
  default: "max-w-5xl",
  narrow: "max-w-3xl",
  prose: "max-w-2xl",
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

/**
 * The one horizontal measure in the product.
 *
 * The public pages, the auth screens and the workspace all sit inside this
 * container, which is why a column of text lines up across the whole site.
 */
export function Container({
  children,
  className,
  width = "default",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  width?: ContainerWidth;
  as?: "div" | "header" | "footer" | "nav" | "main" | "article";
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full px-4 sm:px-6", WIDTHS[width], className)}
    >
      {children}
    </Tag>
  );
}

const PADDING = {
  default: "py-16 sm:py-20",
  compact: "py-12 sm:py-14",
  none: "",
} as const;

export type SectionPadding = keyof typeof PADDING;

/**
 * A band of public-site content: shared vertical rhythm, one hairline divider
 * between bands and the accessible name wiring each section needs.
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
      className={cn(divider && "section-band", className)}
    >
      <Container width={width} className={cn(PADDING[padding], innerClassName)}>
        {children}
      </Container>
    </section>
  );
}

/**
 * Two-column section body: the heading rail on the left, the content on the
 * right. Used where a section has more rows than a single heading can carry.
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
        "grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14",
        className,
      )}
    >
      <div
        className={cn(sticky && "lg:sticky lg:top-24 lg:self-start", asideClassName)}
      >
        {aside}
      </div>
      {children}
    </div>
  );
}
