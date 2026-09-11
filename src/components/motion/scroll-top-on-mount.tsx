"use client";

import { useEffect } from "react";

/**
 * Returning to the landing page keeps the browser's restored scroll position
 * on back-and-forward navigations, which reads as broken when the visitor
 * expected the top. Anchor links (/#...) keep their behaviour: they carry a
 * hash, and this stays out of the way.
 */
export function ScrollTopOnMount() {
  useEffect(() => {
    if (window.location.hash !== "") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
