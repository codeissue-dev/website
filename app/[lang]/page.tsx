import { redirect } from 'next/navigation';

type LegacyLocalePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function LegacyLocalePage({
  params,
}: LegacyLocalePageProps) {
  const { lang } = await params;

  if (lang === 'en' || lang === 'ru') {
    redirect('/');
  }

  redirect('/');
}
