import { z } from "zod";

import {
  commaSeparatedList,
  optionalHttpUrl,
  optionalText,
  optionalUuid,
  requiredText,
} from "@/lib/validation/fields";

const slugSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(
    z
      .string()
      .min(3, "Slug needs at least 3 characters")
      .max(80, "Slug must stay under 80 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and single hyphens",
      ),
  );

const optionalPositiveInt = (
  max: number,
  label: string,
): z.ZodType<number | null, string> =>
  z
    .string()
    .transform((value) => value.trim())
    .refine(
      (value) => value.length === 0 || /^\d{1,6}$/.test(value),
      `${label} must be a whole number`,
    )
    .transform((value) => (value.length === 0 ? null : Number.parseInt(value, 10)))
    .refine(
      (value) => value === null || (value >= 1 && value <= max),
      `${label} must be between 1 and ${max}`,
    );

const sortOrderSchema = z
  .string()
  .transform((value) => value.trim())
  .transform((value) => (value.length === 0 ? "0" : value))
  .pipe(z.coerce.number().int().min(-1000).max(1000));

export const portfolioItemSchema = z.object({
  slug: slugSchema,
  title: requiredText({ min: 3, max: 140, label: "Title" }),
  summary: requiredText({ min: 20, max: 300, label: "Summary" }),
  problem: requiredText({ min: 20, max: 2000, label: "Problem" }),
  solution: requiredText({ min: 20, max: 2000, label: "Solution" }),
  techStack: commaSeparatedList({ max: 20, label: "Tech stack" }),
  industry: optionalText(80, "Industry"),
  projectUrl: optionalHttpUrl,
  deliveryWeeks: optionalPositiveInt(260, "Delivery time"),
  sortOrder: sortOrderSchema,
  published: z.boolean(),
});

export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;

export const testimonialSchema = z.object({
  authorName: requiredText({ min: 2, max: 120, label: "Author name" }),
  authorRole: optionalText(120, "Author role"),
  company: optionalText(120, "Company"),
  quote: requiredText({ min: 40, max: 1200, label: "Quote" }),
  rating: optionalPositiveInt(5, "Rating"),
  orderId: optionalUuid,
  sortOrder: sortOrderSchema,
  published: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const contentIdSchema = z.object({
  id: z.uuid("Unknown record"),
});

export const togglePublishedSchema = z.object({
  id: z.uuid("Unknown record"),
  published: z.boolean(),
});
