import '@/index.css';
import type { Metadata } from 'next';
import Providers from './providers';

const SITE_URL = process.env.SITE_URL || 'https://www.musichen.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mu SiChen — Luxury Real Estate Negotiator & Advisor, Kuala Lumpur',
    template: '%s | Mu SiChen',
  },
  description:
    'Luxury real estate advisory in Kuala Lumpur. Exclusive properties, new-launch developments, market insights and white-glove service.',
  manifest: '/site.webmanifest',
  openGraph: { type: 'website', siteName: 'Mu SiChen', images: ['/images/imperial-0.jpg'] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
