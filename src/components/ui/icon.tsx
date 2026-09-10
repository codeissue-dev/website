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

export function SunIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <circle cx="8" cy="8" r="2.75" />
      <path d="M8 1.25v1.5" />
      <path d="M8 13.25v1.5" />
      <path d="M1.25 8h1.5" />
      <path d="M13.25 8h1.5" />
      <path d="m3.35 3.35 1.05 1.05" />
      <path d="m11.6 11.6 1.05 1.05" />
      <path d="m12.65 3.35-1.05 1.05" />
      <path d="m4.4 11.6-1.05 1.05" />
    </Glyph>
  );
}

export function MoonIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M13.25 9.4A5.4 5.4 0 1 1 6.6 2.75a4.4 4.4 0 0 0 6.65 6.65Z" />
    </Glyph>
  );
}

/* Capability glyphs: one per kind of work on the landing page. */

export function SlidersIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M2.5 4.75h11" />
      <circle cx="6" cy="4.75" r="1.75" />
      <path d="M2.5 11.25h11" />
      <circle cx="10" cy="11.25" r="1.75" />
    </Glyph>
  );
}

export function WindowIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M2 6.25h12" />
      <path d="M4.25 4.65h.01" />
      <path d="M6.25 4.65h.01" />
    </Glyph>
  );
}

export function NodesIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <circle cx="3.5" cy="8" r="1.75" />
      <circle cx="12.5" cy="3.75" r="1.75" />
      <circle cx="12.5" cy="12.25" r="1.75" />
      <path d="m5.15 7.15 5.7-2.55" />
      <path d="m5.15 8.85 5.7 2.55" />
    </Glyph>
  );
}

export function ChartIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M2.5 13.5h11" />
      <path d="M5 13.5V8.5" />
      <path d="M8 13.5V4.5" />
      <path d="M11 13.5v-3" />
    </Glyph>
  );
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M8 1.75 13 3.5v3.75c0 3.4-2.15 5.4-5 6.75-2.85-1.35-5-3.35-5-6.75V3.5L8 1.75Z" />
      <path d="m5.75 7.75 1.75 1.75 2.75-3" />
    </Glyph>
  );
}

export function PackageIcon({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M8 1.75 14 5v6l-6 3.25L2 11V5l6-3.25Z" />
      <path d="m2 5 6 3.25L14 5" />
      <path d="M8 8.25v6" />
    </Glyph>
  );
}
