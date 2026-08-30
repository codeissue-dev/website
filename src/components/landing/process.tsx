import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS: Array<{ title: string; body: string }> = [
  {
    title: "Write down the work",
    body: "Open an account and add the goal, the people it serves, the parts that matter and anything that should not change.",
  },
  {
    title: "Shape the scope",
    body: "We read the brief, ask useful questions in the project thread and agree what belongs in the first release.",
  },
  {
    title: "Build with the thread open",
    body: "The status, decisions and updates stay together, so the project is easy to follow without chasing messages.",
  },
  {
    title: "Review and hand over",
    body: "You review the result before delivery. The source, instructions and project history stay available in the account.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="process-heading"
            eyebrow="How it works"
            title={
              <>
                A short path from a note to{" "}
                <span className="heading-accent">a useful release.</span>
              </>
            }
            description="No sales maze. The written brief starts the conversation, and the project space keeps it moving."
          />
          <ButtonLink href="/register" variant="secondary" size="sm" className="mt-7">
            Open a project
          </ButtonLink>
        </div>
        <ol className="process-list stagger-list">
          {STEPS.map((step, index) => (
            <li key={step.title} className="process-step">
              <span className="process-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
