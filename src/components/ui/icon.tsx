import type { ReactNode } from "react";

/**
 * One icon family for the whole product: a 16px box, a 1.5px stroke, round
 * joins and `currentColor`.
 *
 * Icons here only repeat what the neighbouring text already says, so they are
 * hidden from assistive technology.
 */
function Glyph({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M13 8H3.5" />
      <path d="M7 3.5 3 8l4 4.5" />
    </Glyph>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="m4 6.25 4 4 4-4" />
    </Glyph>
  );
}

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M8.5 3.5H3.5v9h9v-5" />
      <path d="M10 3.5h2.5V6" />
      <path d="M12.5 3.5 7.5 8.5" />
    </Glyph>
  );
}
