"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/actions/error-mapping";
import { actionSuccess, invalidInput, type ActionState } from "@/actions/state";
import { requireActor } from "@/lib/auth/actor";
import {
  createPortfolioItem,
  createTestimonial,
  deletePortfolioItem,
  deleteTestimonial,
  setPortfolioItemPublished,
  setTestimonialPublished,
  updatePortfolioItem,
  updateTestimonial,
} from "@/lib/content/mutations";
import {
  contentIdSchema,
  portfolioItemSchema,
  testimonialSchema,
  togglePublishedSchema,
} from "@/lib/validation/content";
import { formBooleanValue, formFlag, formText } from "@/lib/validation/form";

/** Public pages read published content, so they are revalidated on every write. */
function revalidatePublicContent(): void {
  revalidatePath("/");
  revalidatePath("/work");
}

function portfolioPayload(formData: FormData): unknown {
  return {
    slug: formText(formData, "slug"),
    title: formText(formData, "title"),
    summary: formText(formData, "summary"),
    problem: formText(formData, "problem"),
    solution: formText(formData, "solution"),
    techStack: formText(formData, "techStack"),
    industry: formText(formData, "industry"),
    projectUrl: formText(formData, "projectUrl"),
    deliveryWeeks: formText(formData, "deliveryWeeks"),
    sortOrder: formText(formData, "sortOrder"),
    published: formFlag(formData, "published"),
  };
}

function testimonialPayload(formData: FormData): unknown {
  return {
    authorName: formText(formData, "authorName"),
    authorRole: formText(formData, "authorRole"),
    company: formText(formData, "company"),
    quote: formText(formData, "quote"),
    rating: formText(formData, "rating"),
    orderId: formText(formData, "orderId"),
    sortOrder: formText(formData, "sortOrder"),
    published: formFlag(formData, "published"),
  };
}

export async function createPortfolioItemAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = portfolioItemSchema.safeParse(portfolioPayload(formData));
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await createPortfolioItem({ actor, data: parsed.data });
    revalidatePath("/admin/portfolio");
    revalidatePublicContent();
    return actionSuccess("The portfolio item has been created.");
  } catch (error) {
    return toActionFailure(error, "createPortfolioItemAction failed");
  }
}

export async function updatePortfolioItemAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const identifier = contentIdSchema.safeParse({ id: formText(formData, "id") });
  if (!identifier.success) return invalidInput(identifier.error);

  const parsed = portfolioItemSchema.safeParse(portfolioPayload(formData));
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await updatePortfolioItem({ actor, id: identifier.data.id, data: parsed.data });
    revalidatePath("/admin/portfolio");
    revalidatePublicContent();
    return actionSuccess("The portfolio item has been updated.");
  } catch (error) {
    return toActionFailure(error, "updatePortfolioItemAction failed");
  }
}

export async function setPortfolioItemPublishedAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = togglePublishedSchema.safeParse({
    id: formText(formData, "id"),
    published: formBooleanValue(formData, "published"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await setPortfolioItemPublished({
      actor,
      id: parsed.data.id,
      published: parsed.data.published,
    });
    revalidatePath("/admin/portfolio");
    revalidatePublicContent();
    return actionSuccess(
      parsed.data.published
        ? "The item is now public."
        : "The item is no longer public.",
    );
  } catch (error) {
    return toActionFailure(error, "setPortfolioItemPublishedAction failed");
  }
}

export async function deletePortfolioItemAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contentIdSchema.safeParse({ id: formText(formData, "id") });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await deletePortfolioItem({ actor, id: parsed.data.id });
    revalidatePath("/admin/portfolio");
    revalidatePublicContent();
    return actionSuccess("The portfolio item has been deleted.");
  } catch (error) {
    return toActionFailure(error, "deletePortfolioItemAction failed");
  }
}

export async function createTestimonialAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = testimonialSchema.safeParse(testimonialPayload(formData));
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await createTestimonial({ actor, data: parsed.data });
    revalidatePath("/admin/testimonials");
    revalidatePublicContent();
    return actionSuccess("The testimonial has been saved.");
  } catch (error) {
    return toActionFailure(error, "createTestimonialAction failed");
  }
}

export async function updateTestimonialAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const identifier = contentIdSchema.safeParse({ id: formText(formData, "id") });
  if (!identifier.success) return invalidInput(identifier.error);

  const parsed = testimonialSchema.safeParse(testimonialPayload(formData));
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await updateTestimonial({ actor, id: identifier.data.id, data: parsed.data });
    revalidatePath("/admin/testimonials");
    revalidatePublicContent();
    return actionSuccess("The testimonial has been updated.");
  } catch (error) {
    return toActionFailure(error, "updateTestimonialAction failed");
  }
}

export async function setTestimonialPublishedAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = togglePublishedSchema.safeParse({
    id: formText(formData, "id"),
    published: formBooleanValue(formData, "published"),
  });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await setTestimonialPublished({
      actor,
      id: parsed.data.id,
      published: parsed.data.published,
    });
    revalidatePath("/admin/testimonials");
    revalidatePublicContent();
    return actionSuccess(
      parsed.data.published
        ? "The testimonial is now public."
        : "The testimonial is no longer public.",
    );
  } catch (error) {
    return toActionFailure(error, "setTestimonialPublishedAction failed");
  }
}

export async function deleteTestimonialAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contentIdSchema.safeParse({ id: formText(formData, "id") });
  if (!parsed.success) return invalidInput(parsed.error);

  try {
    const actor = await requireActor();
    await deleteTestimonial({ actor, id: parsed.data.id });
    revalidatePath("/admin/testimonials");
    revalidatePublicContent();
    return actionSuccess("The testimonial has been deleted.");
  } catch (error) {
    return toActionFailure(error, "deleteTestimonialAction failed");
  }
}
