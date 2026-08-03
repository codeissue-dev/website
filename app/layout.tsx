import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://codeissue.dev'),
  title: {
    default: 'Codeissue — From idea to working product',
    template: '%s — Codeissue',
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
  const requestHeaders = await headers();
  const locale =
    requestHeaders.get('x-codeissue-locale') === 'ru' ? 'ru' : 'en';

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
