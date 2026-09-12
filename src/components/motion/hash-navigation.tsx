"use client";

import { useEffect } from "react";

/**
 * Same-page anchor handling.
 *
 * `next/link` intercepts every click, so a hash link that points at the
 * current page (header, footer, burger menu) updates the URL but never
 * triggers the browser's native scroll - and after the router settles it
 * resets the scroll to the top. This capture-phase listener runs before
 * Link's own handler, scrolls smoothly and keeps the URL in sync.
 */
export function HashNavigation() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;

      // Any link click closes an open mobile disclosure.
      const details = anchor.closest("details");
      if (details?.open) details.open = false;

      const url = new URL(anchor.href);
      if (url.pathname !== window.location.pathname || url.hash === "") return;

      const section = document.getElementById(url.hash.slice(1));
      if (section === null) return;

      // Take over before next/link sees the click: no router navigation, no
      // scroll reset - just the jump the visitor asked for. Instant rather
      // than smooth: programmatic smooth scrolling is dropped by some
      // browsers' reduced-motion and emulation modes. The extra frame keeps
      // the scroll if the panel that hosted the link unmounts right away.
      event.preventDefault();
      event.stopPropagation();
      section.scrollIntoView({ behavior: "instant" });
      requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: "instant" });
      });
      history.replaceState(null, "", url.hash);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
