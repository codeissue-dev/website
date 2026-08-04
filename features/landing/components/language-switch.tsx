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
      className="language-switch"
      aria-label={label}
      onClick={() => changeLanguage(nextLocale)}
    >
      <GlobeIcon className="size-4" />
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
}
