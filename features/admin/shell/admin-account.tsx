import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
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
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start hover:bg-danger/10 hover:text-danger"
        >
          {copy.signOut}
        </Button>
      </form>
    </div>
  );
}
