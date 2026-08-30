import { Capabilities } from "@/components/landing/capabilities";
import { Cta } from "@/components/landing/cta";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { Process } from "@/components/landing/process";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { Workflow } from "@/components/landing/workflow";
import {
  listPublishedPortfolioItems,
  listPublishedTestimonials,
} from "@/lib/content/queries";

/**
 * The landing page reads published content from PostgreSQL on every request.
 *
 * It is deliberately not prerendered: `next build` must succeed without a
 * database, and published content changes the moment an administrator publishes
 * it.
 */
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [portfolioItems, testimonials] = await Promise.all([
    listPublishedPortfolioItems(6),
    listPublishedTestimonials(6),
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
