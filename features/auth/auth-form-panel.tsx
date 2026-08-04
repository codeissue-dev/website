import type { ReactNode } from 'react';

import { LocaleSelect } from '@/components/i18n/locale-select';
import { BrandLink } from '@/components/layout/brand-link';
import type { Locale } from '@/lib/i18n';

export function AuthFormPanel({
  eyebrow,
  title,
  description,
  children,
  footer,
  locale,
  languageLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  locale: Locale;
  languageLabel: string;
}) {
  return (
    <section className="p-5 sm:p-8 lg:p-10 xl:p-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <BrandLink className="lg:hidden" />
        <LocaleSelect
          locale={locale}
          label={languageLabel}
          className="ml-auto"
        />
      </div>
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
  );
}
