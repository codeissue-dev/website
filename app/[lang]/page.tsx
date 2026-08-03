import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LandingPage } from '@/components/landing-page';
import { getDictionary } from '@/lib/i18n';
import { hasLocale, locales } from '@/lib/locales';

type LocalizedPageProps = {
  params: Promise<{ lang: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LocalizedPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const copy = getDictionary(lang);
  const canonical = `/${lang}`;

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical,
      languages: {
        en: '/en',
        ru: '/ru',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      url: canonical,
      siteName: 'Codeissue',
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? ['en_US'] : ['ru_RU'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.meta.title,
      description: copy.meta.description,
      creator: '@codeissue_dev',
    },
  };
}

export default async function LocalizedHome({ params }: LocalizedPageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return <LandingPage locale={lang} copy={getDictionary(lang)} />;
}
