"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

/** Client-only to identify the current route. */
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
                  "inline-flex h-9 items-center rounded-lg px-2.5 text-sm whitespace-nowrap transition-[background-color,color,transform] duration-200",
                  active
                    ? "bg-ink font-medium text-inverse shadow-sm"
                    : "text-ink-muted hover:-translate-y-px hover:bg-surface-muted hover:text-ink",
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
