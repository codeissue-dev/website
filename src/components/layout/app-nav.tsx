"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavLink } from "@/content/navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

/** Client-only so the current route can be marked. Uses the site-wide nav link style. */
export function AppNav({ items }: { items: readonly NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace" className="-mx-1 overflow-x-auto">
      <ul className="flex items-center gap-0.5 px-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="nav-link"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
