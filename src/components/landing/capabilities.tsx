import { SectionHeading } from "@/components/ui/section-heading";

const CAPABILITIES: Array<{ title: string; body: string }> = [
  {
    title: "Internal tools",
    body: "Replace the spreadsheet behind a critical process with software your team can use every day.",
  },
  {
    title: "Customer products",
    body: "Portals, booking flows and account areas that feel fast and dependable on every screen.",
  },
  {
    title: "Integrations",
    body: "Connect the systems you already rely on and keep the data moving without manual copy and paste.",
  },
  {
    title: "Reporting",
    body: "Give the team one trustworthy view of the numbers instead of a collection of competing files.",
  },
  {
    title: "Recovery work",
    body: "Stabilise a stalled codebase, untangle the risky parts and leave it easier to change.",
  },
  {
    title: "The next release",
    body: "Keep improving a product with the same people, context and project history close at hand.",
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="capabilities-heading"
          eyebrow="What we build"
          title={
            <>
              Software with a job to do,{" "}
              <span className="heading-accent">not filler.</span>
            </>
          }
          description="The best projects start with a real bottleneck, a useful question or a task that has outgrown the tools around it."
        />
        <ul className="bento-grid stagger-grid mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability, index) => (
            <li
              key={capability.title}
              className={`bento-card bento-card-${index + 1} interactive-card`}
            >
              <span className="feature-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
              <span aria-hidden="true" className="feature-arrow">
                ↗
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
