import { cn } from "@/lib/utils";

/**
 * A schematic trace: a hairline with a light pulse travelling along it and
 * two solder points at the ends. Decorative wiring between content blocks.
 */
export function CircuitLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("circuit", className)}
    >
      <path className="circuit-base" d="M0 12h400" />
      <path className="circuit-flow" d="M0 12h400" />
      <circle className="circuit-node circuit-node-cyan" cx="8" cy="12" r="3" />
      <circle className="circuit-node circuit-node-violet" cx="392" cy="12" r="3" />
    </svg>
  );
}
