import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-55";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-inverse hover:bg-ink/90",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-muted",
  ghost: "text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "border border-critical/40 text-critical hover:bg-critical/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[0.8125rem]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

/** Shared class builder so links can look identical to buttons. */
export function buttonClass(
  options: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {},
): string {
  return cn(
    BASE,
    VARIANTS[options.variant ?? "primary"],
    SIZES[options.size ?? "md"],
    options.className,
  );
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonClass({ variant, size, className })}
      {...props}
    />
  );
}
