'use client';

import { useChangeLanguage } from 'next-i18next/client';

import { GlobeIcon } from '@/components/icons';
import type { Dictionary, Locale } from '@/lib/i18n';

export function LanguageSwitch({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const changeLanguage = useChangeLanguage('codeissue-locale');
  const nextLocale: Locale = locale === 'en' ? 'ru' : 'en';

  return (
    <button
      type="button"
      className="language-switch"
      aria-label={copy.language.switchLabel}
      onClick={() => changeLanguage(nextLocale)}
    >
      <GlobeIcon className="size-4" />
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
}
