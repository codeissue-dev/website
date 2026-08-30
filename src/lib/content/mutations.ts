import { eq } from "drizzle-orm";

import type { ActorLike } from "@/lib/auth/rbac";
import { assertCanManagePublicContent } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { portfolioItems, testimonials } from "@/lib/db/schema";
import { ConflictError, NotFoundError, isUniqueViolation } from "@/lib/errors";
import type { PortfolioItemInput, TestimonialInput } from "@/lib/validation/content";

/**
 * Publishing state is stored, not inferred: `published_at` is set when a record
 * goes live and preserved afterwards, which the database check constraints
 * enforce independently of this code.
 */
function publishedAtFor(published: boolean, existing: Date | null): Date | null {
  if (!published) return existing;
  return existing ?? new Date();
}

export async function createPortfolioItem(input: {
  actor: ActorLike;
  data: PortfolioItemInput;
}): Promise<{ id: string }> {
  assertCanManagePublicContent(input.actor);

  try {
    const inserted = await getDb()
      .insert(portfolioItems)
      .values({
        slug: input.data.slug,
        title: input.data.title,
        summary: input.data.summary,
        problem: input.data.problem,
        solution: input.data.solution,
        techStack: input.data.techStack,
        industry: input.data.industry,
        projectUrl: input.data.projectUrl,
        deliveryWeeks: input.data.deliveryWeeks,
        sortOrder: input.data.sortOrder,
        published: input.data.published,
        publishedAt: publishedAtFor(input.data.published, null),
      })
      .returning({ id: portfolioItems.id });

    const created = inserted[0];
    if (!created) throw new ConflictError("The portfolio item could not be saved.");
    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError("Another portfolio item already uses that slug.");
    }
    throw error;
  }
}

export async function updatePortfolioItem(input: {
  actor: ActorLike;
  id: string;
  data: PortfolioItemInput;
}): Promise<void> {
  assertCanManagePublicContent(input.actor);

  const db = getDb();
  const existingRows = await db
    .select({ id: portfolioItems.id, publishedAt: portfolioItems.publishedAt })
    .from(portfolioItems)
    .where(eq(portfolioItems.id, input.id))
    .limit(1);

  const existing = existingRows[0];
  if (!existing) throw new NotFoundError("That portfolio item no longer exists.");

  try {
    await db
      .update(portfolioItems)
      .set({
        slug: input.data.slug,
        title: input.data.title,
        summary: input.data.summary,
        problem: input.data.problem,
        solution: input.data.solution,
        techStack: input.data.techStack,
        industry: input.data.industry,
        projectUrl: input.data.projectUrl,
        deliveryWeeks: input.data.deliveryWeeks,
        sortOrder: input.data.sortOrder,
        published: input.data.published,
        publishedAt: publishedAtFor(input.data.published, existing.publishedAt),
        updatedAt: new Date(),
      })
      .where(eq(portfolioItems.id, existing.id));
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError("Another portfolio item already uses that slug.");
    }
    throw error;
  }
}

export async function setPortfolioItemPublished(input: {
  actor: ActorLike;
  id: string;
  published: boolean;
}): Promise<void> {
  assertCanManagePublicContent(input.actor);

  const db = getDb();
  const existingRows = await db
    .select({ id: portfolioItems.id, publishedAt: portfolioItems.publishedAt })
    .from(portfolioItems)
    .where(eq(portfolioItems.id, input.id))
    .limit(1);

  const existing = existingRows[0];
  if (!existing) throw new NotFoundError("That portfolio item no longer exists.");

  await db
    .update(portfolioItems)
    .set({
      published: input.published,
      publishedAt: publishedAtFor(input.published, existing.publishedAt),
      updatedAt: new Date(),
    })
    .where(eq(portfolioItems.id, existing.id));
}

export async function deletePortfolioItem(input: {
  actor: ActorLike;
  id: string;
}): Promise<void> {
  assertCanManagePublicContent(input.actor);

  const deleted = await getDb()
    .delete(portfolioItems)
    .where(eq(portfolioItems.id, input.id))
    .returning({ id: portfolioItems.id });

  if (deleted.length === 0) {
    throw new NotFoundError("That portfolio item no longer exists.");
  }
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

export async function createTestimonial(input: {
  actor: ActorLike;
  data: TestimonialInput;
}): Promise<{ id: string }> {
  assertCanManagePublicContent(input.actor);

  const inserted = await getDb()
    .insert(testimonials)
    .values({
      authorName: input.data.authorName,
      authorRole: input.data.authorRole,
      company: input.data.company,
      quote: input.data.quote,
      rating: input.data.rating,
      orderId: input.data.orderId,
      sortOrder: input.data.sortOrder,
      published: input.data.published,
      publishedAt: publishedAtFor(input.data.published, null),
    })
    .returning({ id: testimonials.id });

  const created = inserted[0];
  if (!created) throw new ConflictError("The testimonial could not be saved.");
  return created;
}

export async function updateTestimonial(input: {
  actor: ActorLike;
  id: string;
  data: TestimonialInput;
}): Promise<void> {
  assertCanManagePublicContent(input.actor);

  const db = getDb();
  const existingRows = await db
    .select({ id: testimonials.id, publishedAt: testimonials.publishedAt })
    .from(testimonials)
    .where(eq(testimonials.id, input.id))
    .limit(1);

  const existing = existingRows[0];
  if (!existing) throw new NotFoundError("That testimonial no longer exists.");

  await db
    .update(testimonials)
    .set({
      authorName: input.data.authorName,
      authorRole: input.data.authorRole,
      company: input.data.company,
      quote: input.data.quote,
      rating: input.data.rating,
      orderId: input.data.orderId,
      sortOrder: input.data.sortOrder,
      published: input.data.published,
      publishedAt: publishedAtFor(input.data.published, existing.publishedAt),
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, existing.id));
}

export async function setTestimonialPublished(input: {
  actor: ActorLike;
  id: string;
  published: boolean;
}): Promise<void> {
  assertCanManagePublicContent(input.actor);

  const db = getDb();
  const existingRows = await db
    .select({ id: testimonials.id, publishedAt: testimonials.publishedAt })
    .from(testimonials)
    .where(eq(testimonials.id, input.id))
    .limit(1);

  const existing = existingRows[0];
  if (!existing) throw new NotFoundError("That testimonial no longer exists.");

  await db
    .update(testimonials)
    .set({
      published: input.published,
      publishedAt: publishedAtFor(input.published, existing.publishedAt),
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, existing.id));
}

export async function deleteTestimonial(input: {
  actor: ActorLike;
  id: string;
}): Promise<void> {
  assertCanManagePublicContent(input.actor);

  const deleted = await getDb()
    .delete(testimonials)
    .where(eq(testimonials.id, input.id))
    .returning({ id: testimonials.id });

  if (deleted.length === 0) {
    throw new NotFoundError("That testimonial no longer exists.");
  }
}
