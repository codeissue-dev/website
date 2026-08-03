export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolvePreferredLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  const normalized = acceptLanguage?.toLowerCase() ?? '';
  return normalized.split(',').some((value) => value.trim().startsWith('ru'))
    ? 'ru'
    : defaultLocale;
}
