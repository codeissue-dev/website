/**
 * Internationalization constants.
 *
 * The site ships two locales and switches them through the `NEXT_LOCALE`
 * cookie, read by `./request.ts` on every request. There are no locale URL
 * prefixes: every public page is rendered per request already, so a cookie
 * keeps links, canonicals and the sitemap unchanged.
 */
export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale === value);
}
