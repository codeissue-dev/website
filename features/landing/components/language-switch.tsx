import { LocaleSelect } from '@/components/i18n/locale-select';
import type { Locale } from '@/lib/i18n';

export function LanguageSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return <LocaleSelect locale={locale} label={label} />;
}
