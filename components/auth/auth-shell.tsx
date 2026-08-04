import Link from 'next/link';
import type { ReactNode } from 'react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function AuthShell({
  copy,
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  copy: Dictionary;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-4 py-10 text-foreground sm:px-6">
      <div
        className={cn(
          subtleGrid,
          'pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_76%)] opacity-65',
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-signal/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-card shadow-[0_30px_100px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.05)_inset] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden border-r border-border bg-black/35 p-8 lg:flex lg:flex-col xl:p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo priority />
            <span className="text-sm font-semibold">Codeissue</span>
          </Link>

          <div className="my-auto py-14">
            <p className="font-mono text-sm text-signal-soft">
              {copy.auth.sideEyebrow}
            </p>
            <h1 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[1.02] tracking-[-0.055em] xl:text-5xl">
              {copy.auth.sideTitle}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              {copy.auth.sideDescription}
            </p>
          </div>

          <ul className="grid gap-3 border-t border-border pt-6">
            {copy.auth.sideItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="grid size-6 place-items-center rounded-md border border-border bg-surface text-positive">
                  <CheckIcon className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 sm:p-8 lg:p-10 xl:p-12">
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <BrandLogo priority />
            <span className="text-sm font-semibold">Codeissue</span>
          </Link>
          <p className="font-mono text-sm text-signal-soft">{eyebrow}</p>
          <h2 className="mt-4 max-w-[14ch] text-[clamp(2rem,5vw,3.35rem)] font-semibold leading-[1.02] tracking-[-0.055em]">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            {description}
          </p>
          {children}
          <div className="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
            {footer}
          </div>
        </section>
      </div>
    </main>
  );
}
