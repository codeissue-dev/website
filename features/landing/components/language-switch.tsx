'use client';

import { useChangeLanguage } from 'next-i18next/client';

import { GlobeIcon } from '@/components/icons';
import type { Locale } from '@/lib/i18n';

export function LanguageSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const changeLanguage = useChangeLanguage('codeissue-locale');
  const nextLocale: Locale = locale === 'en' ? 'ru' : 'en';

  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 font-mono text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-soft hover:text-foreground"
      aria-label={label}
      onClick={() => changeLanguage(nextLocale)}
    >
      <GlobeIcon className="size-3.5" />
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
}
