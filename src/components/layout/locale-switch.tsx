"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { LOCALE_COOKIE, type Locale } from "@/i18n/config";

const OPTIONS: ReadonlyArray<{ value: Locale; label: string }> = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
];

/**
 * Locale switch. The choice is stored in the `NEXT_LOCALE` cookie and picked
 * up by the request-scoped intl config on the refresh that follows.
 */
export function LocaleSwitch() {
  const t = useTranslations("LocaleSwitch");
  const locale = useLocale();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="pref-switch" role="group" aria-label={t("label")}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="pref-option"
          aria-pressed={option.value === locale}
          onClick={() => switchTo(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
