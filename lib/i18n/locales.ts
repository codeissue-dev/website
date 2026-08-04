export const localeOptions = [
  { value: 'en', label: 'English', flag: '🇬🇧', htmlLang: 'en' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺', htmlLang: 'ru' },
] as const;

export type Locale = (typeof localeOptions)[number]['value'];

export const locales = localeOptions.map((locale) => locale.value) as Locale[];
export const defaultLocale: Locale = 'en';

export function hasLocale(value: string): value is Locale {
  return localeOptions.some((locale) => locale.value === value);
}

export function toLocale(value: string): Locale {
  return hasLocale(value) ? value : defaultLocale;
}

export function getLocaleOption(locale: Locale) {
  return (
    localeOptions.find((option) => option.value === locale) ?? localeOptions[0]
  );
}

export function resolvePreferredLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (cookieLocale && hasLocale(cookieLocale)) return cookieLocale;

  const normalized = acceptLanguage?.toLowerCase() ?? '';
  return normalized.split(',').some((value) => value.trim().startsWith('ru'))
    ? 'ru'
    : defaultLocale;
}
