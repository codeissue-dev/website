'use client';

import { useChangeLanguage } from 'next-i18next/client';
import type { ChangeEvent } from 'react';

import { ChevronDownIcon } from '@/components/icons';
import { siteConfig } from '@/lib/config/site';
import {
  getLocaleOption,
  localeOptions,
  type Locale,
} from '@/lib/i18n/locales';
import { cn } from '@/lib/utils';

export function LocaleSelect({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const changeLanguage = useChangeLanguage(siteConfig.localeCookie);
  const current = getLocaleOption(locale);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    changeLanguage(event.target.value as Locale);
  }

  return (
    <label
      className={cn(
        'relative inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-soft hover:text-foreground',
        className,
      )}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {current.flag}
      </span>
      <span className="sr-only">{label}</span>
      <select
        value={locale}
        onChange={handleChange}
        aria-label={label}
        className="min-w-[5.25rem] cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-current outline-none"
      >
        {localeOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-black text-white"
          >
            {option.flag} {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 size-3.5" />
    </label>
  );
}
