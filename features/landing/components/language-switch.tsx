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
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface/80 px-3 font-mono text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground transition-colors hover:border-signal hover:text-foreground"
      aria-label={label}
      onClick={() => changeLanguage(nextLocale)}
    >
      <GlobeIcon className="size-3.5" />
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
}
