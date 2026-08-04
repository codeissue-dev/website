import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { BrandLogo } from '@/components/brand/brand-logo';
import type { Dictionary } from '@/lib/i18n';

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
    <main className="grid min-h-screen bg-black lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.62fr)]">
      <section className="relative hidden overflow-hidden border-r border-border bg-black p-10 lg:flex lg:flex-col">
        <Image
          src="/images/banner.png"
          alt=""
          fill
          priority
          sizes="62vw"
          className="object-cover opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,transparent_45%,#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,transparent_38%,#000_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:4.5rem_4.5rem]"
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between font-mono text-sm tracking-[0.08em] text-muted-foreground">
          <span className="text-signal">CODEISSUE / ACCESS</span>
          <span>AUTH 01</span>
        </div>

        <div className="relative my-auto max-w-3xl py-16">
          <p className="font-mono text-sm tracking-[0.08em] text-signal">
            {copy.auth.sideEyebrow}
          </p>
          <h1 className="mt-6 max-w-[12ch] text-[clamp(2.65rem,4.5vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.05em]">
            {copy.auth.sideTitle}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">
            {copy.auth.sideDescription}
          </p>
        </div>

        <div className="relative grid grid-cols-3 border-t border-l border-border bg-black/60 backdrop-blur-sm">
          {copy.auth.sideItems.map((item, index) => (
            <div key={item} className="border-r border-b border-border p-4">
              <span className="font-mono text-sm text-signal">
                0{index + 1}
              </span>
              <strong className="mt-4 block text-sm">{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-w-0 flex-col justify-center border-t border-border bg-black px-5 py-10 sm:px-10 lg:border-t-0 lg:px-[clamp(2.5rem,5vw,5rem)]">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-14 flex items-center gap-3">
            <BrandLogo priority />
            <span className="text-sm font-semibold">Codeissue OS</span>
          </Link>
          <p className="font-mono text-sm font-semibold tracking-[0.08em] text-signal">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-[13ch] text-[clamp(2.15rem,4vw,3.5rem)] font-medium leading-[1] tracking-[-0.045em]">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            {description}
          </p>
          {children}
          <div className="mt-10 border-t border-border pt-5 font-mono text-sm leading-5 text-muted-foreground">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
