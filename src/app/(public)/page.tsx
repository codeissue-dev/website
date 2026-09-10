import type { Metadata } from "next";

import { Capabilities } from "@/components/landing/capabilities";
import { Cta } from "@/components/landing/cta";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { Process } from "@/components/landing/process";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { Workflow } from "@/components/landing/workflow";
import { readWithFallback } from "@/lib/db/resilient";
import {
  listPublishedPortfolioItems,
  listPublishedTestimonials,
  type PublishedPortfolioItem,
  type PublishedTestimonial,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

/**
 * The landing page reads published content from PostgreSQL on every request.
 *
 * It is deliberately not prerendered: `next build` must succeed without a
 * database, and published content changes the moment an administrator publishes
 * it. The copy sections do not depend on the database, so a failed read only
 * empties the project and review lists; the page itself still renders.
 */
export default async function LandingPage() {
  const [portfolioItems, testimonials] = await Promise.all([
    readWithFallback(
      "landing portfolio",
      () => listPublishedPortfolioItems(6),
      [] as PublishedPortfolioItem[],
    ),
    readWithFallback(
      "landing testimonials",
      () => listPublishedTestimonials(6),
      [] as PublishedTestimonial[],
    ),
  ]);

  return (
    <>
      <Hero />
      <Capabilities />
      <Process />
      <Workflow />
      <PortfolioSection items={portfolioItems} />
      <TestimonialsSection testimonials={testimonials} />
      <Faq />
      <Cta />
    </>
  );
}
