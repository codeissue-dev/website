import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";

const COLUMNS: Array<{
  heading: string;
  links: Array<{ href: string; label: string }>;
}> = [
  {
    heading: "Service",
    links: [
      { href: "/#capabilities", label: "Capabilities" },
      { href: "/#process", label: "How it works" },
      { href: "/#workflow", label: "Delivery workflow" },
    ],
  },
  {
    heading: "Proof",
    links: [
      { href: "/work", label: "Completed projects" },
      { href: "/#testimonials", label: "Customer feedback" },
      { href: "/#faq", label: "Questions" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/register", label: "Create an account" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/orders/new", label: "Submit a request" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-2.5">
          <Wordmark />
          <p className="max-w-xs text-sm text-ink-muted">
            Custom software, built to a written brief and tracked from the first message
            to delivery.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading} className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold tracking-wide text-ink uppercase">
              {column.heading}
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1.5 border-t border-line px-4 py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {year} codeissue</p>
        <p>Requests are answered by the people who do the work.</p>
      </div>
    </footer>
  );
}
