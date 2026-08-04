import type { DefaultSession } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

import type { UserRole } from '@/db/schema';

declare module 'next-auth' {
  interface User {
    role?: UserRole;
    username?: string;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      username: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
    username?: string;
  }
}
