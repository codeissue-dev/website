import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

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
      className="border-b border-line bg-surface-muted/45"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            id="process-heading"
            eyebrow="Process"
            title="How working with us goes"
            description="No discovery theatre and no sales call before anyone has read what you need. The written brief is the start of the work."
          />
          <ButtonLink href="/register" variant="secondary" size="sm" className="mt-6">
            Create an account
          </ButtonLink>
        </div>
        <ol className="stagger-list flex flex-col border-b border-line">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="group flex gap-4 border-t border-line py-6 first:border-t-0 first:pt-0 sm:gap-6"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs font-semibold text-accent tabular-nums transition-colors duration-200 group-hover:border-accent/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pt-1">
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
