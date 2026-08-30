import Link from "next/link";

import { buttonClass } from "@/components/ui/button";

const STEPS: Array<{ title: string; body: string }> = [
  {
    title: "Write the brief",
    body: "Create an account and fill in the request form: the idea, the problem it solves, the features that matter, any technical preferences, and a deadline if you have one.",
  },
  {
    title: "We review it",
    body: "A person reads the request and replies in the project chat with questions, scope options and what we would build first. The project moves to Reviewing while that happens.",
  },
  {
    title: "Build in visible stages",
    body: "Once the scope is accepted the project is assigned and moves through the pipeline. Each change of status is recorded, so you can always see where the work stands.",
  },
  {
    title: "Review and handover",
    body: "You check the result while the project sits in quality assurance. When it is signed off it is marked completed, and the whole history stays in your account.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-b border-line"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <h2
            id="process-heading"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            How working with us goes
          </h2>
          <p className="mt-3 text-ink-muted">
            No discovery theatre and no sales call before anyone has read what you need.
            The written brief is the start of the work.
          </p>
          <Link
            href="/register"
            className={buttonClass({
              variant: "secondary",
              size: "sm",
              className: "mt-6",
            })}
          >
            Create an account
          </Link>
        </div>

        <ol className="flex flex-col">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-5 border-t border-line py-5 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-sm text-ink-subtle tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
