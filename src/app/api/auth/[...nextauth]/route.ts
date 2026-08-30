import { handlers } from "@/auth";

/**
 * Auth.js HTTP endpoints. The handlers come from the single `NextAuth()`
 * instance in `src/auth.ts`, so sessions, callbacks and the Drizzle adapter
 * behave identically here and in Server Components.
 */
export const runtime = "nodejs";

export const { GET, POST } = handlers;
