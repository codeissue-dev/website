import type { DefaultSession } from "next-auth";

import type { UserRole } from "@/lib/auth/roles";

/**
 * NextAuth module augmentation.
 *
 * `Session["user"]` always carries the database id and the role, so server code
 * can make coarse decisions without casting. Authoritative authorization still
 * re-reads the actor from Postgres (see `src/lib/auth/actor.ts`).
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
