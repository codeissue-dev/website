'use client';

import { useChangeLanguage } from 'next-i18next/client';

import type { Locale } from '@/lib/i18n';

export function AdminLanguageSwitch({ locale }: { locale: Locale }) {
  const changeLanguage = useChangeLanguage('codeissue-locale');
  const nextLocale: Locale = locale === 'en' ? 'ru' : 'en';

  return (
    <button
      type="button"
      className="admin-language-switch"
      onClick={() => changeLanguage(nextLocale)}
      aria-label={`Switch language to ${nextLocale}`}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
