import { eq } from 'drizzle-orm';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { db } from '@/db/client';
import { users } from '@/db/schema';
import { normalizeUsername } from '@/lib/auth/credentials';
import { brandConfig } from '@/lib/brand/config';
import { verifyPassword } from '@/lib/auth/password';

const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: `${brandConfig.name} account`,
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const username = normalizeUsername(credentials.username);
      const password = String(credentials.password ?? '');

      if (!username || !password) return null;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (!user?.passwordHash) return null;

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? user.username,
        image: user.image,
        role: user.role,
        username: user.username,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? '');
        session.user.role = token.role ?? 'user';
        session.user.username = String(token.username ?? '');
      }
      return session;
    },
  },
});
