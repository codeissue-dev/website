'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type NavigationItem = {
  href: string;
  label: string;
  icon: 'overview' | 'inbox' | 'orders' | 'integrations' | 'events';
};

function NavIcon({ name }: { name: NavigationItem['icon'] }) {
  const paths = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    inbox: (
      <>
        <path d="M4 5h16v12H8l-4 4V5Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    orders: (
      <>
        <path d="M7 3h10l3 3v15H4V3h3Z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </>
    ),
    integrations: (
      <>
        <path d="M9 7V5a3 3 0 0 1 6 0v2M9 17v2a3 3 0 0 0 6 0v-2" />
        <path d="M7 9H5a3 3 0 0 0 0 6h2M17 9h2a3 3 0 0 1 0 6h-2" />
        <rect x="7" y="7" width="10" height="10" rx="3" />
      </>
    ),
    events: (
      <>
        <path d="M4 12h3l2-6 4 12 2-6h5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[name]}
      </g>
    </svg>
  );
}

export function AdminNav({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {items.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(active && 'is-active')}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
