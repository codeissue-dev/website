import { z } from "zod";

import { USER_ROLES } from "@/lib/auth/roles";

export const setUserRoleSchema = z.object({
  userId: z.uuid("Unknown user"),
  role: z.enum(USER_ROLES, "Unknown role"),
});

export type SetUserRoleInput = z.infer<typeof setUserRoleSchema>;

export const userListParamsSchema = z.object({
  q: z.string().trim().max(120).default(""),
  role: z.union([z.enum(USER_ROLES), z.literal("ALL")]).default("ALL"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  perPage: z.coerce.number().int().min(5).max(50).default(20),
});

export type UserListParams = z.infer<typeof userListParamsSchema>;

export function parseUserListParams(
  searchParams: Record<string, string | string[] | undefined>,
): UserListParams {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      normalized[key] = value;
      continue;
    }
    const first = Array.isArray(value) ? value[0] : undefined;
    if (typeof first === "string") normalized[key] = first;
  }

  const parsed = userListParamsSchema.safeParse(normalized);
  return parsed.success ? parsed.data : userListParamsSchema.parse({});
}

export function buildUserListQueryString(params: UserListParams): string {
  const search = new URLSearchParams();
  if (params.q.length > 0) search.set("q", params.q);
  if (params.role !== "ALL") search.set("role", params.role);
  if (params.page !== 1) search.set("page", String(params.page));
  if (params.perPage !== 20) search.set("perPage", String(params.perPage));
  const query = search.toString();
  return query.length > 0 ? `?${query}` : "";
}
