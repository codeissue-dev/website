import { cn } from "@/lib/utils";

const MARKERS = [
  "terminal-marker-0",
  "terminal-marker-1",
  "terminal-marker-2",
  "terminal-marker-3",
] as const;

/**
 * The project log: a terminal window that runs the real delivery steps as log
 * lines and waits for the next brief. Purely decorative - the same steps are
 * rendered as text in the process section - so it is hidden from assistive
 * technology. It stays dark in both themes, the way code blocks do.
 */
export function ProjectTerminal({
  title,
  steps,
  prompt,
  className,
}: {
  title: string;
  steps: readonly string[];
  prompt: string;
  className?: string;
}) {
  return (
    <div className={cn("terminal", className)} aria-hidden="true">
      <div className="terminal-bar">
        <span className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-amber" />
          <span className="terminal-dot terminal-dot-green" />
        </span>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">
        {steps.map((step, index) => (
          <p key={step} className="terminal-line">
            <span className={MARKERS[index % MARKERS.length]} />
            <span className="terminal-step">{step}</span>
            <span className="terminal-time">{String(index + 1).padStart(2, "0")}</span>
          </p>
        ))}
        <p className="terminal-prompt">
          <span className="terminal-gt">$</span>
          <span className="terminal-step">{prompt}</span>
          <span className="term-cursor" />
        </p>
      </div>
    </div>
  );
}
