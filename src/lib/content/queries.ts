import { and, asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  orders,
  portfolioItems,
  testimonials,
  type PortfolioItemRow,
  type TestimonialRow,
} from "@/lib/db/schema";

export type PublishedPortfolioItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string[];
  industry: string | null;
  projectUrl: string | null;
  deliveryWeeks: number | null;
};

/** Public read: published records only. Nothing is hardcoded in the UI. */
export async function listPublishedPortfolioItems(
  limit = 6,
): Promise<PublishedPortfolioItem[]> {
  return getDb()
    .select({
      id: portfolioItems.id,
      slug: portfolioItems.slug,
      title: portfolioItems.title,
      summary: portfolioItems.summary,
      problem: portfolioItems.problem,
      solution: portfolioItems.solution,
      techStack: portfolioItems.techStack,
      industry: portfolioItems.industry,
      projectUrl: portfolioItems.projectUrl,
      deliveryWeeks: portfolioItems.deliveryWeeks,
    })
    .from(portfolioItems)
    .where(eq(portfolioItems.published, true))
    .orderBy(asc(portfolioItems.sortOrder), desc(portfolioItems.publishedAt))
    .limit(limit);
}

export async function loadPublishedPortfolioItem(
  slug: string,
): Promise<PublishedPortfolioItem | null> {
  const rows = await getDb()
    .select({
      id: portfolioItems.id,
      slug: portfolioItems.slug,
      title: portfolioItems.title,
      summary: portfolioItems.summary,
      problem: portfolioItems.problem,
      solution: portfolioItems.solution,
      techStack: portfolioItems.techStack,
      industry: portfolioItems.industry,
      projectUrl: portfolioItems.projectUrl,
      deliveryWeeks: portfolioItems.deliveryWeeks,
    })
    .from(portfolioItems)
    .where(and(eq(portfolioItems.slug, slug), eq(portfolioItems.published, true)))
    .limit(1);

  return rows[0] ?? null;
}

export type PublishedTestimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  quote: string;
  rating: number | null;
};

export async function listPublishedTestimonials(
  limit = 6,
): Promise<PublishedTestimonial[]> {
  return getDb()
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorRole: testimonials.authorRole,
      company: testimonials.company,
      quote: testimonials.quote,
      rating: testimonials.rating,
    })
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.publishedAt))
    .limit(limit);
}

/* -------------------------------------------------------------------------- */
/* Administration reads (published and unpublished)                           */
/* -------------------------------------------------------------------------- */

export async function listAllPortfolioItems(): Promise<PortfolioItemRow[]> {
  return getDb()
    .select()
    .from(portfolioItems)
    .orderBy(asc(portfolioItems.sortOrder), desc(portfolioItems.createdAt));
}

export async function loadPortfolioItem(id: string): Promise<PortfolioItemRow | null> {
  const rows = await getDb()
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function listAllTestimonials(): Promise<TestimonialRow[]> {
  return getDb()
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));
}

export async function loadTestimonial(id: string): Promise<TestimonialRow | null> {
  const rows = await getDb()
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export type DeliveredOrderOption = {
  id: string;
  reference: string;
  title: string;
};

/** Delivered projects a testimonial can be attached to. */
export async function listDeliveredOrderOptions(
  limit = 100,
): Promise<DeliveredOrderOption[]> {
  return getDb()
    .select({ id: orders.id, reference: orders.reference, title: orders.title })
    .from(orders)
    .where(eq(orders.status, "COMPLETED"))
    .orderBy(desc(orders.completedAt))
    .limit(limit);
}
