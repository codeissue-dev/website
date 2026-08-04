'use client';

import { useCallback, useEffect, useState } from 'react';

import { CloseIcon, MenuIcon } from '@/components/icons';
import { BrandLink } from '@/components/layout/brand-link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { MobileNavigation } from './mobile-navigation';
import { SiteHeaderActions } from './site-header-actions';
import { SiteNavLinks } from './site-nav-links';

export function SiteHeader({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [closeMenu, menuOpen]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/70">
      <div className={cn(pageFrame, 'flex h-16 items-center justify-between')}>
        <BrandLink
          href="#top"
          descriptor={copy.brand.descriptor}
          onClick={closeMenu}
        />

        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <SiteNavLinks copy={copy} />
        </div>

        <div className="hidden lg:block">
          <SiteHeaderActions locale={locale} copy={copy} />
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-border-strong hover:bg-surface-soft lg:hidden"
          aria-label={menuOpen ? copy.nav.close : copy.nav.menu}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <CloseIcon className="size-4" />
          ) : (
            <MenuIcon className="size-4" />
          )}
        </button>
      </div>

      <MobileNavigation
        open={menuOpen}
        locale={locale}
        copy={copy}
        onNavigate={closeMenu}
      />
    </header>
  );
}
