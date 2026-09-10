"use client";

import { useTranslations } from "next-intl";

import { MoonIcon, SunIcon } from "@/components/ui/icon";

/**
 * Theme switch.
 *
 * The pre-hydration script in the root layout resolves the initial theme
 * (stored preference, else the system setting) and writes `data-theme` on the
 * html element. This button only flips the attribute and persists it, so the
 * icons are driven by CSS and there is no state to hydrate.
 */
export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the switch still applies.
    }
  }

  return (
    <button
      type="button"
      className="pref-button"
      onClick={toggleTheme}
      aria-label={t("toggle")}
    >
      <SunIcon className="theme-icon-sun" />
      <MoonIcon className="theme-icon-moon" />
    </button>
  );
}
