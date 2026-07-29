import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://streamvault.app'),
  title: 'StreamVault — Movies & TV Shows, Free & HD',
  description:
    'Stream thousands of movies and TV shows in HD. Trending, popular, Bollywood, Pakistani and more. No ads, multi-source playback, mini player and downloads.',
  keywords: ['movies', 'tv shows', 'streaming', 'free movies', 'hd', 'StreamVault'],
  themeColor: '#0a0a0a',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  openGraph: {
    title: 'StreamVault — Movies & TV Shows, Free & HD',
    description: 'Stream thousands of movies and TV shows in HD.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-vault-bg text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
