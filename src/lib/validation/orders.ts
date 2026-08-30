import { z } from "zod";

import { ORDER_STATUSES } from "@/lib/orders/status";
import {
  optionalFutureDate,
  optionalText,
  optionalUuid,
  requiredText,
} from "@/lib/validation/fields";

export const createOrderSchema = z.object({
  title: requiredText({ min: 6, max: 140, label: "Project title" }),
  detailedDescription: requiredText({
    min: 80,
    max: 8000,
    label: "Project description",
  }),
  problemStatement: requiredText({ min: 30, max: 2000, label: "Problem and goals" }),
  keyFeatures: requiredText({ min: 20, max: 4000, label: "Important features" }),
  technicalPreferences: optionalText(2000, "Technical preferences"),
  referenceLinks: optionalText(2000, "References"),
  desiredDeadline: optionalFutureDate,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const changeOrderStatusSchema = z.object({
  orderId: z.uuid("Unknown project"),
  toStatus: z.enum(ORDER_STATUSES, "Unknown status"),
  note: optionalText(1000, "Note"),
});

export type ChangeOrderStatusInput = z.infer<typeof changeOrderStatusSchema>;

export const assignExecutorSchema = z.object({
  orderId: z.uuid("Unknown project"),
  /** Empty string clears the assignment. */
  executorId: optionalUuid,
  note: optionalText(1000, "Note"),
});

export type AssignExecutorInput = z.infer<typeof assignExecutorSchema>;

/** Longest message the database check constraint accepts. */
export const MAX_MESSAGE_LENGTH = 4000;

export const sendOrderMessageSchema = z.object({
  orderId: z.uuid("Unknown project"),
  body: requiredText({ min: 1, max: MAX_MESSAGE_LENGTH, label: "Message" }),
});

export type SendOrderMessageInput = z.infer<typeof sendOrderMessageSchema>;

/* -------------------------------------------------------------------------- */
/* Listing / filtering                                                        */
/* -------------------------------------------------------------------------- */

export const ORDER_STATUS_FILTER_ALL = "ALL";

export const orderListParamsSchema = z.object({
  q: z.string().trim().max(120).default(""),
  status: z
    .union([z.enum(ORDER_STATUSES), z.literal(ORDER_STATUS_FILTER_ALL)])
    .default(ORDER_STATUS_FILTER_ALL),
  assignment: z.enum(["any", "unassigned", "assigned"]).default("any"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  perPage: z.coerce.number().int().min(5).max(50).default(10),
});

export type OrderListParams = z.infer<typeof orderListParamsSchema>;

/**
 * Next.js gives `searchParams` values as `string | string[] | undefined`.
 * Unknown or malformed values fall back to defaults instead of throwing, so a
 * hand-edited URL can never break a page.
 */
export function parseOrderListParams(
  searchParams: Record<string, string | string[] | undefined>,
): OrderListParams {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      normalized[key] = value;
      continue;
    }
    const first = Array.isArray(value) ? value[0] : undefined;
    if (typeof first === "string") normalized[key] = first;
  }

  const parsed = orderListParamsSchema.safeParse(normalized);
  return parsed.success ? parsed.data : orderListParamsSchema.parse({});
}

export function buildOrderListQueryString(params: OrderListParams): string {
  const search = new URLSearchParams();
  if (params.q.length > 0) search.set("q", params.q);
  if (params.status !== ORDER_STATUS_FILTER_ALL) search.set("status", params.status);
  if (params.assignment !== "any") search.set("assignment", params.assignment);
  if (params.page !== 1) search.set("page", String(params.page));
  if (params.perPage !== 10) search.set("perPage", String(params.perPage));
  const query = search.toString();
  return query.length > 0 ? `?${query}` : "";
}
