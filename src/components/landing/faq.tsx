import { SectionHeading } from "@/components/ui/section-heading";

const QUESTIONS: Array<{ question: string; answer: string }> = [
  {
    question: "What happens after I submit a request?",
    answer:
      "Your brief becomes a project with its own reference and activity record. Someone reads it, replies in the project thread and works with you on the scope.",
  },
  {
    question: "How do you price the work?",
    answer:
      "After reading the brief. An honest estimate depends on the scope, so the conversation and any changes stay visible in the project thread.",
  },
  {
    question: "Who owns the code?",
    answer:
      "You do. Delivery includes the source, migrations and deployment notes, so the product is not tied to a black box.",
  },
  {
    question: "Can you take over an existing project?",
    answer:
      "Yes. Tell us what is working, what is not and what cannot break. We start by making the project safe to build on again.",
  },
  {
    question: "Do you use AI while building?",
    answer:
      "We use tools where they help, but the engineer responsible for the work reviews every change. The outcome is tested software, not unreviewed output.",
  },
  {
    question: "How do I follow progress?",
    answer:
      "The project page keeps the status, history and conversation together. You can check it at any time and updates arrive while it is open.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:gap-16">
        <SectionHeading
          id="faq-heading"
          eyebrow="Questions"
          title={
            <>
              A few useful <span className="heading-accent">answers.</span>
            </>
          }
          description="If your question is not here, include it in the brief. It will be answered in the project thread."
        />
        <div className="faq-panel self-start overflow-hidden rounded-panel border border-line bg-surface/75">
          {QUESTIONS.map((entry) => (
            <details
              key={entry.question}
              className="faq-row group border-b border-line last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-sm font-semibold text-ink sm:px-6">
                {entry.question}
                <span aria-hidden="true" className="faq-icon">
                  +
                </span>
              </summary>
              <p className="max-w-3xl px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6">
                {entry.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
