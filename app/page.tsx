import type { Metadata } from 'next';

import { LandingPage } from '@/features/landing';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t, lng } = await getT('common');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: { canonical: '/' },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: '/',
      siteName: 'Codeissue',
      locale: lng === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lng === 'ru' ? ['en_US'] : ['ru_RU'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      creator: '@codeissue_dev',
    },
  };
}

export default async function Home() {
  const { i18n, lng } = await getT('common');
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return <LandingPage locale={toLocale(lng)} copy={copy} />;
}
