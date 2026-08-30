"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

/**
 * Signed-in navigation. A Client Component only because the active item is
 * derived from the current path.
 */
export function AppNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace" className="-mx-1 overflow-x-auto">
      <ul className="flex items-center gap-1 px-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-2.5 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "bg-surface-muted font-medium text-ink"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
