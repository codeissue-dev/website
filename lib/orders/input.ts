const supportedCurrencies = ['USD', 'EUR', 'RUB'] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

function isSupportedCurrency(value: string): value is SupportedCurrency {
  return supportedCurrencies.includes(value as SupportedCurrency);
}

export type OrderDraft = {
  title: string;
  currency: SupportedCurrency;
  valueCents: number;
};

export function parseOrderDraft(input: {
  title: FormDataEntryValue | null;
  currency: FormDataEntryValue | null;
  value: FormDataEntryValue | null;
}): OrderDraft {
  const title = String(input.title ?? '').trim();
  const currency = String(input.currency ?? 'USD').toUpperCase();
  const value = Number(String(input.value ?? '').replace(',', '.'));

  if (title.length < 3 || title.length > 200) {
    throw new Error('Order title must contain 3-200 characters.');
  }
  if (!isSupportedCurrency(currency)) {
    throw new Error('Unsupported order currency.');
  }
  if (!Number.isFinite(value) || value < 0 || value > 100_000_000) {
    throw new Error('Order value is invalid.');
  }

  return { title, currency, valueCents: Math.round(value * 100) };
}
