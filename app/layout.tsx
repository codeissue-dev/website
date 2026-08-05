import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { I18nProvider } from 'next-i18next/client';
import type { ReactNode } from 'react';

import { brandConfig } from '@/lib/brand/config';
import { getResources, getT } from '@/lib/i18n/server';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.url),
  title: {
    default: `${brandConfig.name} - From idea to working product`,
    template: `%s - ${brandConfig.name}`,
  },
  description: brandConfig.description,
  keywords: [
    brandConfig.name,
    'product design',
    'product engineering',
    'digital products',
    'AI-assisted development',
  ],
  authors: [{ name: brandConfig.name, url: brandConfig.url }],
  creator: brandConfig.name,
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
    <html
      lang={lng}
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth bg-black antialiased`}
    >
      <body className="min-h-full bg-black font-sans text-foreground">
        <I18nProvider language={lng} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
