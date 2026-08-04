'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary, Locale } from '@/lib/i18n';
import { navigation } from '@/lib/site-data';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { LanguageSwitch } from './language-switch';

export function SiteHeader({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/70">
      <div className={cn(pageFrame, 'flex h-16 items-center justify-between')}>
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="Codeissue"
          onClick={() => setMenuOpen(false)}
        >
          <BrandLogo className="size-8" priority />
          <span className="text-sm font-semibold tracking-[-0.02em]">
            Codeissue
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden truncate text-sm text-muted-foreground sm:block">
            {copy.brand.descriptor}
          </span>
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              {copy.nav[item.id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
            <Link
              href="/admin"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              {copy.nav.workspace}
            </Link>
            <Link href="/issues/new" className={buttonVariants({ size: 'sm' })}>
              {copy.nav.contact}
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-border-strong hover:bg-surface-soft"
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
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          'absolute inset-x-0 top-full h-[calc(100dvh-4rem)] border-b border-border bg-black transition-[opacity,visibility,transform] duration-200 lg:hidden',
          menuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0',
        )}
      >
        <div className={cn(pageFrame, 'flex h-full flex-col py-5')}>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                className="flex min-h-14 items-center justify-between rounded-lg px-4 text-lg font-medium transition-colors hover:bg-white/[0.06]"
                onClick={() => setMenuOpen(false)}
              >
                <span>{copy.nav[item.id]}</span>
                <span className="font-mono text-sm text-muted-foreground">
                  0{index + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-5 grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
            <Link
              href="/admin"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              onClick={() => setMenuOpen(false)}
            >
              {copy.nav.workspace}
            </Link>
            <Link
              href="/issues/new"
              className={buttonVariants({ size: 'lg' })}
              onClick={() => setMenuOpen(false)}
            >
              {copy.nav.contact}
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>

          <div className="mt-auto border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
            <p>codeissue.dev</p>
            <p>codeissue@outlook.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
