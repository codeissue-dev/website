const QUESTIONS: Array<{ question: string; answer: string }> = [
  {
    question: "What happens right after I submit a request?",
    answer:
      "Your request is stored as a project with a reference you can quote, and its history starts with the submission itself. A member of the team reads the brief and replies in the project chat with questions or a scope proposal. You are not left guessing whether it arrived.",
  },
  {
    question: "How is the price decided?",
    answer:
      "We only quote after reading the brief, because an honest number depends on scope. Discussion happens in the project chat where it stays on the record, and scope changes are agreed there before they are built.",
  },
  {
    question: "Who owns the code?",
    answer:
      "You do. You get the source, the migrations and the deployment instructions, so nothing about the project depends on us staying involved.",
  },
  {
    question: "Can you take over an existing project?",
    answer:
      "Yes. Describe the current state in the request, including what is broken and what must keep working. Rescue work starts with getting the project building and tested again before anything new is added.",
  },
  {
    question: "Do you use AI to write the code?",
    answer:
      "We use whatever tooling makes the work correct and fast, including AI assistance where it helps, and every line is reviewed by the engineer who is accountable for it. What you receive is reviewed, tested software, not generated output nobody read.",
  },
  {
    question: "How do I follow progress?",
    answer:
      "Each project page shows the current status, the full status history with author and time, and the conversation. Updates arrive live while the page is open, and nothing is lost if you close it: the history is stored in the database.",
  },
  {
    question: "What if the project needs changes after delivery?",
    answer:
      "Send the next change through the same request flow. It keeps the same account, the same reference format and the same history, so context is never rebuilt from scratch.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-b border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <h2
            id="faq-heading"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Questions we get asked
          </h2>
          <p className="mt-3 text-ink-muted">
            If something here is missing, ask it in the project chat once your request
            is in. A person answers it.
          </p>
        </div>

        <div className="overflow-hidden rounded-panel border border-line">
          {QUESTIONS.map((entry) => (
            <details
              key={entry.question}
              className="group border-b border-line last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ink">
                {entry.question}
                <span
                  aria-hidden="true"
                  className="font-mono text-ink-subtle group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="hidden font-mono text-ink-subtle group-open:inline"
                >
                  &minus;
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm text-ink-muted">{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
