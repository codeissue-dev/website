const CAPABILITIES: Array<{ title: string; body: string }> = [
  {
    title: "Internal tools",
    body: "Replace the spreadsheet that runs a critical process with something your team can actually rely on: real permissions, real history, real exports.",
  },
  {
    title: "Customer-facing products",
    body: "Portals, booking flows, dashboards and account areas, built to load fast and behave correctly on the devices your customers really use.",
  },
  {
    title: "Integrations and automation",
    body: "Move data between the systems you already pay for, on a schedule or on an event, with retries and a log you can inspect when something looks wrong.",
  },
  {
    title: "Data and reporting",
    body: "Model the data properly in PostgreSQL, then put the numbers your team argues about behind one page instead of four conflicting reports.",
  },
  {
    title: "Rescue and migration",
    body: "Take over a stalled codebase, get it building again, migrate it off whatever is failing, and document what was wrong so it stays fixed.",
  },
  {
    title: "Ongoing changes",
    body: "Shipping is the middle of the project, not the end. Send the next change through the same request flow and keep the same history.",
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="border-b border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2
            id="capabilities-heading"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            What we take on
          </h2>
          <p className="mt-3 text-ink-muted">
            Small teams and operators come to codeissue with a problem that is already
            costing them time. These are the shapes that work turns out to take most
            often.
          </p>
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <li key={capability.title} className="bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">{capability.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{capability.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
