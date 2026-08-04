import { signOut } from '@/auth';
import type { Dictionary } from '@/lib/i18n';

import type { AdminSessionUser } from './types';

export function AdminAccount({
  copy,
  user,
}: {
  copy: Dictionary['admin'];
  user: AdminSessionUser;
}) {
  const displayName = user.name ?? user.username ?? 'Codeissue';

  return (
    <div className="mt-auto hidden border-t border-border p-3 lg:grid lg:gap-3">
      <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-black/40 p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-black">
          {displayName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-sm">{displayName}</strong>
          <small className="block truncate text-sm text-muted-foreground">
            {copy.roles[user.role]}
          </small>
        </div>
      </div>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button
          type="submit"
          className="h-9 w-full rounded-md px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
        >
          {copy.signOut}
        </button>
      </form>
    </div>
  );
}
