export function formatRelativeTime(value: string, locale: string) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];

  for (const [unit, amount] of ranges) {
    if (Math.abs(seconds) >= amount) {
      return formatter.format(Math.round(seconds / amount), unit);
    }
  }

  return formatter.format(seconds, 'second');
}

export function formatMoney(
  valueCents: number | null,
  currency: string,
  locale: string,
) {
  if (valueCents === null) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(valueCents / 100);
}
