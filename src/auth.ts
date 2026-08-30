import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getDb } from "@/lib/db/client";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { burnEquivalentWork, verifyPassword } from "@/lib/auth/password";
import { toUserRoleOrDefault } from "@/lib/auth/roles";
import { findUserByEmailForCredentials } from "@/lib/users/queries";
import { credentialsSchema } from "@/lib/validation/auth";

/**
 * Auth.js configuration.
 *
 * Built lazily: `NextAuth(() => config)` defers construction to the first
 * request, so importing this module (for example during `next build`) never
 * creates a database client and never reads `AUTH_SECRET`.
 *
 * The adapter receives the *instance* returned by `getDb()` together with the
 * project's custom table objects. It must be `DrizzleAdapter(getDb(), schema)`:
 * passing `getDb` (the function) or a separate Drizzle client would break the
 * adapter and duplicate the connection pool.
 */
function buildAuthConfig(): NextAuthConfig {
  return {
    adapter: DrizzleAdapter(getDb(), {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    // The Credentials provider requires stateless sessions.
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
    pages: { signIn: "/sign-in" },
    trustHost: true,
    providers: [
      Credentials({
        name: "Email and password",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (rawCredentials) => {
          const parsed = credentialsSchema.safeParse(rawCredentials);
          if (!parsed.success) return null;

          const user = await findUserByEmailForCredentials(parsed.data.email);
          if (!user) {
            // Equalize timing so a missing account is indistinguishable from a
            // wrong password.
            await burnEquivalentWork(parsed.data.password);
            return null;
          }

          const passwordMatches = await verifyPassword(
            parsed.data.password,
            user.passwordHash,
          );
          if (!passwordMatches) return null;

          // Only what the session needs. The password hash stays in this scope.
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        },
      }),
    ],
    callbacks: {
      jwt: ({ token, user }) => {
        if (user) {
          if (typeof user.id === "string") token.sub = user.id;
          token.role = toUserRoleOrDefault(user.role);
        }
        return token;
      },
      session: ({ session, token }) => {
        if (typeof token.sub === "string") session.user.id = token.sub;
        // Least privilege if the claim is missing or unrecognized. Privileged
        // operations re-read the role from Postgres (see lib/auth/actor.ts).
        session.user.role = toUserRoleOrDefault(token.role);
        return session;
      },
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => buildAuthConfig());
