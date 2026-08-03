import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://codeissue.dev'),
  title: {
    default: 'Codeissue — Build. Break. Ship.',
    template: '%s — Codeissue',
  },
  description:
    'Codeissue is an independent developer network for engineering, open source, and the people building what comes next.',
  keywords: [
    'codeissue',
    'developer community',
    'software engineering',
    'open source',
    'debugging',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Codeissue — Build. Break. Ship.',
    description:
      'A digital lab and community for people who build, break, debug, and ship what comes next.',
    url: 'https://codeissue.dev',
    siteName: 'Codeissue',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codeissue — Build. Break. Ship.',
    description:
      'A digital lab and community for people who build, break, debug, and ship what comes next.',
    creator: '@codeissue_dev',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
