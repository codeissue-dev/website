import Link from 'next/link';
import type { ReactNode } from 'react';

import { signOut } from '@/auth';
import { BrandLink } from '@/components/layout/brand-link';
import { LocaleSelect } from '@/components/i18n/locale-select';
import { Button, buttonVariants } from '@/components/ui/button';
import type { UserRole } from '@/db/schema';
import { isAdminRole } from '@/lib/auth/roles';
import { dashboardNavigation, siteConfig } from '@/lib/config/site';
import type { Dictionary, Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function DashboardShell({
  children,
  copy,
  locale,
  user,
}: {
  children: ReactNode;
  copy: Dictionary;
  locale: Locale;
  user: {
    name?: string | null;
    username?: string | null;
    role: UserRole;
  };
}) {
  const displayName = user.name ?? user.username ?? copy.dashboard.member;
  const admin = isAdminRole(user.role);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[92rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <BrandLink href={siteConfig.routes.dashboard} />
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {dashboardNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                {copy.dashboard.navigation[item.key]}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LocaleSelect
              locale={locale}
              label={copy.language.switchLabel}
              className="hidden sm:block"
            />
            {admin ? (
              <Link
                href={siteConfig.routes.admin}
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                {copy.dashboard.adminArea}
              </Link>
            ) : null}
            <Link
              href={siteConfig.routes.newIssue}
              className={buttonVariants({ size: 'sm' })}
            >
              {copy.dashboard.newProject}
            </Link>
          </div>
        </div>
      </header>

      <nav className="border-b border-border lg:hidden">
        <div className="mx-auto flex w-full max-w-[92rem] gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {dashboardNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              {copy.dashboard.navigation[item.key]}
            </Link>
          ))}
          {admin ? (
            <Link
              href={siteConfig.routes.admin}
              className="shrink-0 rounded-md px-3 py-2 text-sm text-signal-soft transition-colors hover:bg-signal/10"
            >
              {copy.dashboard.adminArea}
            </Link>
          ) : null}
        </div>
      </nav>

      <div className="mx-auto grid w-full max-w-[92rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <nav className="grid gap-1">
              {dashboardNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                >
                  {copy.dashboard.navigation[item.key]}
                </Link>
              ))}
              {admin ? (
                <Link
                  href={siteConfig.routes.admin}
                  className="mt-2 rounded-lg border border-signal/20 bg-signal/[0.06] px-3 py-2.5 text-sm text-signal-soft transition-colors hover:bg-signal/10"
                >
                  {copy.dashboard.adminArea}
                </Link>
              ) : null}
            </nav>
            <div className="border-t border-border pt-5">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                @{user.username ?? 'member'}
              </p>
              <form
                className="mt-3"
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'w-full justify-start px-0 text-muted-foreground',
                    'hover:bg-transparent hover:text-foreground',
                  )}
                >
                  {copy.dashboard.signOut}
                </Button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
