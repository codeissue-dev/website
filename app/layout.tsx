import type { Metadata, Viewport } from 'next';
import { I18nProvider } from 'next-i18next/client';
import type { ReactNode } from 'react';

import { getResources, getT } from '@/lib/i18n/server';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://codeissue.dev'),
  title: {
    default: 'Codeissue - From idea to working product',
    template: '%s - Codeissue',
  },
  description:
    'Codeissue designs and builds digital products using AI-assisted workflows, custom systems, and human review.',
  keywords: [
    'codeissue',
    'product design',
    'product engineering',
    'digital products',
    'AI-assisted development',
  ],
  authors: [{ name: 'Codeissue', url: 'https://codeissue.dev' }],
  creator: 'Codeissue',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { i18n, lng } = await getT('common');
  const resources = getResources(i18n);

  return (
    <html lang={lng} className="h-full scroll-smooth bg-black antialiased">
      <body className="min-h-full bg-black font-sans text-foreground">
        <I18nProvider language={lng} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
