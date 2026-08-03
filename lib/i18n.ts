import en from '@/dictionaries/en.json';
import ru from '@/dictionaries/ru.json';

import type { Locale } from './locales';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
