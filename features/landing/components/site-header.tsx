'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ArrowUpRightIcon, CodeIssueMark } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary, Locale } from '@/lib/i18n';
import { contactEmail, navigation } from '@/lib/site-data';
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-black/95">
      <div
        className={cn(
          pageFrame,
          'grid min-h-16 grid-cols-[1fr_auto] items-stretch border-x border-border lg:min-h-[4.5rem] lg:grid-cols-[1fr_auto_1fr]',
        )}
      >
        <a
          href="#top"
          className="flex min-w-0 items-center gap-3 px-3 sm:px-4"
          aria-label="Codeissue"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-8 shrink-0 place-items-center border border-signal text-signal">
            <CodeIssueMark className="size-[1.15rem]" />
          </span>
          <span className="flex min-w-0 flex-col">
            <strong className="text-sm font-semibold tracking-[-0.02em]">
              Codeissue
            </strong>
            <small className="hidden truncate font-mono text-[0.58rem] tracking-[0.1em] text-muted-foreground sm:block">
              {copy.brand.descriptor}
            </small>
          </span>
        </a>

        <nav
          className="hidden h-full items-center border-x border-border lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="inline-flex h-full items-center border-r border-border px-5 font-mono text-[0.64rem] tracking-[0.08em] text-muted-foreground transition-colors last:border-r-0 hover:bg-white hover:text-black"
            >
              {copy.nav[item.id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end px-2 sm:px-3">
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
            <Link
              href="/admin"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              {copy.nav.workspace}
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className={buttonVariants({ size: 'sm' })}
            >
              {copy.nav.contact}
              <ArrowUpRightIcon className="size-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
            <button
              type="button"
              className="grid size-10 place-items-center border border-border text-foreground transition-colors hover:border-signal hover:text-signal"
              aria-label={menuOpen ? copy.nav.close : copy.nav.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="relative block h-3.5 w-4" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-px w-4 bg-current transition-transform',
                    menuOpen && 'translate-y-[6px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[6px] h-px w-4 bg-current transition-opacity',
                    menuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-px w-4 bg-current transition-transform',
                    menuOpen && '-translate-y-[7px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          'absolute inset-x-0 top-full h-[calc(100dvh-4rem)] border-b border-border bg-black transition-[opacity,visibility] duration-200 lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div
          className={cn(
            pageFrame,
            'flex h-full flex-col border-x border-border',
          )}
        >
          <nav
            className="grid border-b border-border"
            aria-label="Mobile navigation"
          >
            {navigation.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                className="grid min-h-16 grid-cols-[3rem_1fr_auto] items-center border-b border-border px-4 text-lg font-medium last:border-b-0 hover:bg-white hover:text-black"
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-mono text-[0.62rem] text-signal">
                  0{index + 1}
                </span>
                <span>{copy.nav[item.id]}</span>
                <span aria-hidden="true">+</span>
              </a>
            ))}
          </nav>

          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <Link
              href="/admin"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              onClick={() => setMenuOpen(false)}
            >
              {copy.nav.workspace}
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className={buttonVariants({ size: 'lg' })}
              onClick={() => setMenuOpen(false)}
            >
              {copy.nav.contact}
              <ArrowUpRightIcon className="size-4" />
            </a>
          </div>

          <div className="mt-auto border-t border-border p-4 font-mono text-[0.62rem] leading-5 text-muted-foreground">
            codeissue.dev
            <br />
            codeissue@outlook.com
          </div>
        </div>
      </div>
    </header>
  );
}
