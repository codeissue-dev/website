import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";

const COLUMNS: Array<{
  heading: string;
  links: Array<{ href: string; label: string }>;
}> = [
  {
    heading: "The studio",
    links: [
      { href: "/#capabilities", label: "What we build" },
      { href: "/#process", label: "How it works" },
      { href: "/#workflow", label: "Project flow" },
    ],
  },
  {
    heading: "In public",
    links: [
      { href: "/work", label: "Finished projects" },
      { href: "/#testimonials", label: "Client reviews" },
      { href: "/#faq", label: "Questions" },
    ],
  },
  {
    heading: "Your account",
    links: [
      { href: "/register", label: "Open an account" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/orders/new", label: "Start a project" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="public-footer relative z-10 overflow-hidden border-t border-line">
      <div aria-hidden="true" className="footer-glow" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.45fr_repeat(3,1fr)] md:py-14">
        <div className="flex flex-col gap-3">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            Software built around a real brief and kept visible from the first note to
            delivery.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.heading} className="flex flex-col gap-3">
            <h2 className="footer-heading">{column.heading}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-1.5 border-t border-line px-4 py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {year} codeissue</p>
        <p>Built for people who want the work to stay clear.</p>
      </div>
    </footer>
  );
}
