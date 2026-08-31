import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/section";
import { FOOTER_COLUMNS } from "@/content/navigation";
import { SITE } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="public-footer relative z-10 overflow-hidden border-t border-line">
      <div aria-hidden="true" className="footer-glow" />
      <Container className="relative grid gap-8 py-12 md:grid-cols-[1.45fr_repeat(3,1fr)] md:py-14">
        <div className="flex flex-col gap-3">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            {SITE.summary}
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading} className="flex flex-col gap-3">
            <h2 className="footer-heading">{column.heading}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="relative flex flex-col gap-1.5 border-t border-line py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.name}
        </p>
        <p>{SITE.closingNote}</p>
      </Container>
    </footer>
  );
}
