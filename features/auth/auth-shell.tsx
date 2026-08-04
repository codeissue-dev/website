import type { ReactNode } from 'react';

import type { Dictionary, Locale } from '@/lib/i18n';
import { subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { AuthFormPanel } from './auth-form-panel';
import { AuthSidePanel } from './auth-side-panel';

export function AuthShell({
  copy,
  eyebrow,
  title,
  description,
  children,
  footer,
  locale,
}: {
  copy: Dictionary;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  locale: Locale;
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
        <AuthSidePanel copy={copy.auth} />
        <AuthFormPanel
          eyebrow={eyebrow}
          title={title}
          description={description}
          footer={footer}
          locale={locale}
          languageLabel={copy.language.switchLabel}
        >
          {children}
        </AuthFormPanel>
      </div>
    </main>
  );
}
