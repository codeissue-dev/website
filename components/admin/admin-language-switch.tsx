'use client';

import { useChangeLanguage } from 'next-i18next/client';

import type { Locale } from '@/lib/i18n';

export function AdminLanguageSwitch({ locale }: { locale: Locale }) {
  const changeLanguage = useChangeLanguage('codeissue-locale');
  const nextLocale: Locale = locale === 'en' ? 'ru' : 'en';

  return (
    <button
      type="button"
      className="inline-flex h-8 items-center border border-border px-3 font-mono text-sm font-semibold tracking-[0.12em] text-muted-foreground transition-colors hover:border-signal hover:text-foreground"
      onClick={() => changeLanguage(nextLocale)}
      aria-label={`Switch language to ${nextLocale}`}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
