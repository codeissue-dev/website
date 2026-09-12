"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type NavMenuLink = { href: string; label: string };

export type NavMenuItem = {
  id: string;
  /** Accessible name; doubles as the visible label for text triggers. */
  label: string;
  /** Navigation target for a plain click; icon triggers may omit it. */
  href?: string;
  icon?: ReactNode;
  panel?: {
    description?: string;
    links?: NavMenuLink[];
    /** Fully custom body (controls, forms) rendered after the links. */
    content?: ReactNode;
  };
};

const PANEL_WIDTH = 304;
const CLOSE_DELAY_MS = 160;

/** Centers the fixed panel under its trigger, clamped to the window. */
function panelLeft(trigger: HTMLElement): { left: number } {
  const rect = trigger.getBoundingClientRect();
  const centered = rect.left + rect.width / 2 - PANEL_WIDTH / 2;
  const left = Math.min(
    Math.max(8, centered),
    Math.max(8, window.innerWidth - PANEL_WIDTH - 8),
  );
  return { left };
}

/**
 * The sliding navigation.
 *
 * Hovering a trigger opens its panel; moving to another trigger slides the
 * same viewport sideways and resizes it to the new content instead of closing
 * and reopening. The viewport is measured after every render, so the height
 * always matches the panel that is actually shown.
 */
export function NavMenu({
  items,
  ariaLabel,
  className,
}: {
  items: NavMenuItem[];
  ariaLabel: string;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [box, setBox] = useState({ left: 0, width: PANEL_WIDTH, height: 0 });
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });

  const navRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<Array<HTMLLIElement | null>>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openIndex = items.findIndex((item) => item.id === openId);
  const openItem = openIndex >= 0 ? items[openIndex] : undefined;

  function cancelClose() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  }

  function open(id: string) {
    cancelClose();
    setOpenId(id);
  }

  useLayoutEffect(() => {
    if (openIndex < 0 || openItem === undefined) {
      setIndicator((current) => ({ ...current, width: 0 }));
      return;
    }

    const trigger = triggerRefs.current[openIndex];
    if (trigger === undefined || trigger === null) return;

    setIndicator({
      x: trigger.offsetLeft,
      width: trigger.offsetWidth,
    });

    const content = contentRef.current;
    setBox({
      ...panelLeft(trigger),
      width: PANEL_WIDTH,
      height: content === null ? 0 : content.scrollHeight,
    });
  }, [openIndex, openItem]);

  useEffect(() => {
    if (openId === null) return;
    const content = contentRef.current;
    if (content === null) return;

    function update() {
      const trigger = triggerRefs.current[openIndex];
      const panel = contentRef.current;
      if (trigger === undefined || trigger === null || panel === null) return;
      setBox((current) => ({
        ...current,
        ...panelLeft(trigger),
        height: panel.scrollHeight,
      }));
    }

    // The first measurement can land before fonts and children have settled;
    // the observer keeps the viewport glued to the real content size after that.
    update();
    const observer = new ResizeObserver(update);
    observer.observe(content);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [openId, openIndex]);

  useEffect(() => () => cancelClose(), []);

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cn("relative hidden h-14 items-center md:flex", className)}
      onMouseLeave={scheduleClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenId(null);
      }}
    >
      <ul className="flex items-center gap-0.5">
        {items.map((item, index) => (
          <li
            key={item.id}
            ref={(node) => {
              triggerRefs.current[index] = node;
            }}
            onMouseEnter={() => open(item.id)}
          >
            {item.icon !== undefined && item.href === undefined ? (
              <button
                type="button"
                className="nav-link"
                aria-label={item.label}
                aria-expanded={item.panel ? openId === item.id : undefined}
                onFocus={() => open(item.id)}
              >
                {item.icon}
              </button>
            ) : (
              <Link
                href={item.href ?? "#"}
                className="nav-link"
                aria-label={item.icon !== undefined ? item.label : undefined}
                aria-expanded={item.panel ? openId === item.id : undefined}
                onFocus={() => open(item.id)}
              >
                {item.icon ?? item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <span
        aria-hidden="true"
        className="navmenu-indicator"
        data-open={openItem !== undefined}
        style={{ transform: `translateX(${indicator.x}px)`, width: indicator.width }}
      />

      {openItem?.panel !== undefined ? (
        <div
          className="navmenu-viewport"
          style={{ left: box.left, width: box.width, height: box.height }}
        >
          <div ref={contentRef} key={openItem.id} className="navmenu-content">
            {openItem.panel.description ? (
              <p className="mb-3 max-w-xs text-sm leading-relaxed text-ink-muted">
                {openItem.panel.description}
              </p>
            ) : null}
            {openItem.panel.links !== undefined && openItem.panel.links.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {openItem.panel.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="navmenu-link"
                      onClick={() => setOpenId(null)}
                    >
                      {link.label}
                      <ChevronRight size={14} strokeWidth={1.5} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {openItem.panel.content !== undefined ? (
              <div className={openItem.panel.links?.length ? "mt-1.5" : undefined}>
                {openItem.panel.content}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export function MobileNavLinks({
  links,
  className,
}: {
  links: NavMenuLink[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link href={link.href} className="menu-link">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
