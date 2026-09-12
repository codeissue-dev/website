"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { MenuIcon } from "@/components/ui/icon";

/**
 * The mobile disclosure.
 *
 * Icon-only trigger, and it closes itself on any link or button press inside
 * and on a press anywhere outside - a native `details` element does neither
 * on its own.
 */
export function MobileMenu({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement | null>(null);
  const t = useTranslations("Header");

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const details = ref.current;
      if (details === null || !details.open) return;
      if (!details.contains(event.target as Node)) details.open = false;
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <details ref={ref} className="relative md:hidden">
      <summary
        className="menu-trigger menu-trigger-icon"
        aria-label={t("menu")}
        aria-haspopup="menu"
      >
        <MenuIcon />
      </summary>
      <div
        onClick={(event) => {
          const details = ref.current;
          if (details === null || !details.open) return;
          if ((event.target as HTMLElement).closest("a, button") !== null) {
            details.open = false;
          }
        }}
      >
        {children}
      </div>
    </details>
  );
}
