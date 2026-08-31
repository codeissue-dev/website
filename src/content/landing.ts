/**
 * Landing page copy.
 *
 * The sections on the home page are presentation only: every sentence they show
 * is defined here, so wording can be reviewed and tested without reading JSX.
 * Anything that describes the real product (delivery stages, published work,
 * reviews) is read from the database instead of this file.
 */

export type LandingCard = {
  readonly title: string;
  readonly body: string;
};

export type ProcessStep = LandingCard;

export type FaqEntry = {
  readonly question: string;
  readonly answer: string;
};

export type ProofPoint = {
  readonly term: string;
  readonly detail: string;
};

/**
 * Section headings are split into a plain part and an accented part so the
 * highlight colour stays a styling decision made in the component.
 */
export type SplitHeading = {
  readonly lead: string;
  readonly accent: string;
};

export const HERO = {
  eyebrow: "Software for work that is ready to move",
  heading: {
    lead: "Build the product that",
    accent: "keeps work moving.",
  } satisfies SplitHeading,
  body: "Bring the process that needs fixing. We turn it into focused software and keep the project clear from the first brief to the handover.",
  primaryAction: { href: "/register", label: "Start a project" },
  secondaryAction: { href: "/work", label: "Browse public projects" },
} as const;

export const HERO_PROOF: readonly ProofPoint[] = [
  {
    term: "One written brief",
    detail: "A clear place to explain the problem before anyone starts building.",
  },
  {
    term: "Visible progress",
    detail: "Every stage and update is part of the same project record.",
  },
  {
    term: "Useful handover",
    detail: "The result, source and context remain accessible after delivery.",
  },
];

/**
 * The decorative project console in the hero.
 *
 * It is illustrative, marked `aria-hidden` in the component, and mirrors the
 * real delivery flow instead of inventing metrics that do not exist.
 */
export const HERO_CONSOLE = {
  title: "project space",
  liveLabel: "Live",
  nav: ["Overview", "Brief", "Conversation", "Delivery"],
  navNote: "Everything in one thread",
  breadcrumb: "New request / Product workspace",
  kicker: "Project brief",
  projectTitle: "A better home for the work",
  status: "In progress",
  summary: [
    { label: "Scope", value: "Confirmed" },
    { label: "Next step", value: "Build review" },
    { label: "Updates", value: "In the thread" },
  ],
  progress: {
    label: "Delivery progress",
    percent: 72,
    ticks: ["Brief", "Scope", "Build", "Review"],
  },
  activityTitle: "Recent activity",
  activity: [
    { tone: "blue", label: "Scope approved" },
    { tone: "violet", label: "Build started" },
    { tone: "mint", label: "Update posted" },
  ],
  messageTitle: "Project update",
  footerLabel: "The path stays visible",
} as const;

export type ConsoleActivityTone = (typeof HERO_CONSOLE.activity)[number]["tone"];

export const CAPABILITIES_SECTION = {
  eyebrow: "What we build",
  heading: {
    lead: "Software with a job to do,",
    accent: "not filler.",
  } satisfies SplitHeading,
  description:
    "The best projects start with a real bottleneck, a useful question or a task that has outgrown the tools around it.",
} as const;

export const CAPABILITIES: readonly LandingCard[] = [
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

export const PROCESS_SECTION = {
  eyebrow: "How it works",
  heading: {
    lead: "A short path from a note to",
    accent: "a useful release.",
  } satisfies SplitHeading,
  description:
    "No sales maze. The written brief starts the conversation, and the project space keeps it moving.",
  action: { href: "/register", label: "Open a project" },
} as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
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

export const WORKFLOW_SECTION = {
  eyebrow: "The project space",
  heading: {
    lead: "Everyone sees the same",
    accent: "next step.",
  } satisfies SplitHeading,
  description:
    "The stages below are the real states used by the platform. Only the right moves are available, and every change is recorded.",
} as const;

export const PORTFOLIO_SECTION = {
  eyebrow: "Public projects",
  heading: {
    lead: "Finished work,",
    accent: "shared with permission.",
  } satisfies SplitHeading,
  description:
    "Every project here has an approved public write-up. The work stays private unless the client chooses otherwise.",
  action: { href: "/work", label: "View all projects" },
  empty: {
    title: "Public case studies are on their way",
    description:
      "We only show a finished project after the client approves it for publication.",
  },
} as const;

export const TESTIMONIALS_SECTION = {
  eyebrow: "Client reviews",
  heading: {
    lead: "Words from people who",
    accent: "shipped with us.",
  } satisfies SplitHeading,
  description:
    "Quotes are published in the client\u2019s own words and only after they approve sharing them.",
  note: "Feedback belongs next to the finished work, not in a made-up carousel.",
  empty: {
    title: "Reviews will appear here",
    description:
      "We publish client feedback only when it is approved for the public site.",
  },
} as const;

export const FAQ_SECTION = {
  eyebrow: "Questions",
  heading: {
    lead: "A few useful",
    accent: "answers.",
  } satisfies SplitHeading,
  description:
    "If your question is not here, include it in the brief. It will be answered in the project thread.",
} as const;

export const FAQ_ENTRIES: readonly FaqEntry[] = [
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

export const CTA_SECTION = {
  eyebrow: "Start with the work you have",
  heading: {
    lead: "Give the next project",
    accent: "a clear place to start.",
  } satisfies SplitHeading,
  description:
    "Open an account, write the brief and keep the conversation next to the work from day one.",
  primaryAction: { href: "/register", label: "Open a project" },
  secondaryAction: { href: "/sign-in", label: "Sign in" },
} as const;

export const WORK_INDEX = {
  eyebrow: "Public projects",
  heading: {
    lead: "Things we finished and",
    accent: "can show.",
  } satisfies SplitHeading,
  description:
    "Every write-up below has been approved by the client. We do not turn private work into portfolio material without permission.",
  empty: {
    title: "There are no public cases yet",
    description:
      "Finished projects appear here after the client approves a public write-up.",
  },
} as const;
