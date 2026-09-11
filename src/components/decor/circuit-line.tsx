import { cn } from "@/lib/utils";

/**
 * A schematic trace: two solder points and a track of dots travelling between
 * them. The track is a repeating background tile inside a flex row, so it fits
 * any width exactly and never spills past its endpoints. Decorative wiring.
 */
export function CircuitLine({ className }: { className?: string }) {
  return (
    <div className={cn("circuit", className)} aria-hidden="true">
      <span className="circuit-node circuit-node-cyan" />
      <span className="circuit-track" />
      <span className="circuit-node circuit-node-violet" />
    </div>
  );
}
