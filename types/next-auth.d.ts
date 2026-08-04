import type { DefaultSession } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

import type { UserRole } from '@/db/schema';

declare module 'next-auth' {
  interface User {
    role?: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
  }
}
