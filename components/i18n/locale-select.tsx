'use client';

import { useChangeLanguage } from 'next-i18next/client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  return (
    <Select
      value={locale}
      onValueChange={(value) => changeLanguage(value as Locale)}
      className={className}
    >
      <SelectTrigger aria-label={label} className={cn('min-w-36', className)}>
        <SelectValue>
          <span aria-hidden="true" className="text-base leading-none">
            {current.flag}
          </span>
          <span className="truncate">{current.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {localeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span aria-hidden="true" className="text-base leading-none">
              {option.flag}
            </span>
            <span>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
