import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "./config";
import en from "./messages/en.json";
import ru from "./messages/ru.json";

/**
 * Per-request intl configuration: pick the locale from the cookie (falling
 * back to English), then load its dictionary. No network, no database.
 */
const dictionaries = { en, ru } as Record<Locale, Record<string, unknown>>;

export default getRequestConfig(async () => {
  const store = await cookies();
  const requested = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return { locale, messages: dictionaries[locale] };
});
