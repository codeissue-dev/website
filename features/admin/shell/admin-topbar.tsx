import Link from 'next/link';

import { AdminLanguageSwitch } from '@/components/admin/admin-language-switch';
import { ArrowUpRightIcon } from '@/components/icons';
import { siteConfig } from '@/lib/config/site';
import type { Dictionary, Locale } from '@/lib/i18n';

export function AdminTopbar({
  copy,
  locale,
}: {
  copy: Dictionary;
  locale: Locale;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-black/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2.5 text-sm">
        <span className="size-1.5 rounded-full bg-positive" />
        <strong>{siteConfig.name}</strong>
        <span className="text-muted-foreground">/</span>
        <span className="hidden truncate text-muted-foreground sm:block">
          {copy.admin.topbar}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={siteConfig.routes.dashboard}
          className="inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
        >
          {copy.admin.userAccount}
        </Link>
        <AdminLanguageSwitch
          locale={locale}
          label={copy.language.switchLabel}
        />
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
        >
          <span className="hidden sm:inline">{copy.admin.openWebsite}</span>
          <ArrowUpRightIcon className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}
