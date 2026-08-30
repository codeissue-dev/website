import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-medium whitespace-nowrap transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-ink bg-ink text-inverse shadow-[0_8px_20px_rgb(18_24_38/0.16)] hover:-translate-y-px hover:border-accent hover:bg-accent hover:shadow-[0_12px_26px_rgb(39_131_222/0.24)] active:translate-y-0",
  secondary:
    "border-line bg-surface/90 text-ink shadow-[0_1px_2px_rgb(18_24_38/0.05)] hover:-translate-y-px hover:border-line-strong hover:bg-surface-muted hover:shadow-[0_8px_18px_rgb(18_24_38/0.08)] active:translate-y-0",
  ghost:
    "text-ink-muted hover:-translate-y-px hover:bg-surface-muted hover:text-ink active:translate-y-0",
  danger:
    "border-critical/40 text-critical hover:-translate-y-px hover:border-critical/60 hover:bg-critical/10 active:translate-y-0",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-[0.8125rem]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

/** Shared visual contract for buttons, button links, and disabled pagination. */
export function buttonClass(options: ButtonStyleOptions = {}): string {
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

/** Reusable native button with the shared interaction treatment. */
export function Button({ variant, size, className, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonClass({ variant, size, className })}
      {...props}
    />
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** A Next.js Link that follows the shared button contract. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
