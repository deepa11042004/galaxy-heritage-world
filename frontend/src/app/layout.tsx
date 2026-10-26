import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TravelDeskFloat } from '@/components/layout/TravelDeskFloat';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://galaxyheritageworld.com'),
  title: {
    default: 'Galaxy Heritage World | Luxury Holidays & 1000+ Associated Resorts',
    template: '%s | Galaxy Heritage World',
  },
  description:
    'Experience bespoke vacations, 1000+ handpicked 4-star and 5-star partner resorts, and 100% transparent holiday memberships across Goa, Rajasthan, Himachal, Uttarakhand, and South India.',
  keywords: [
    'Galaxy Heritage World',
    'luxury holidays India',
    'resort membership',
    'Goa vacation packages',
    'Rajasthan heritage holidays',
    'associated resorts',
    'travel desk',
    'redeem holiday voucher',
  ],
  authors: [{ name: 'Galaxy Heritage World' }],
  openGraph: {
    title: 'Galaxy Heritage World | Luxury Holidays & 1000+ Associated Resorts',
    description:
      'Discover handpicked luxury resorts, bespoke holiday packages, and dedicated travel desk concierge support.',
    url: 'https://galaxyheritageworld.com',
    siteName: 'Galaxy Heritage World',
    images: [
      {
        url: '/media/galaxy-heritage-world/homepage/images/gettyimages-149353949_wide-5bf3b36fc9e77c005175cfc2.jpg',
        width: 1200,
        height: 630,
        alt: 'Galaxy Heritage World Luxury Vacations',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galaxy Heritage World | Luxury Holidays & 1000+ Associated Resorts',
    description:
      'Discover handpicked luxury resorts, bespoke holiday packages, and dedicated travel desk concierge support.',
    images: ['/media/galaxy-heritage-world/homepage/images/gettyimages-149353949_wide-5bf3b36fc9e77c005175cfc2.jpg'],
  },
  icons: {
    icon: '/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased selection:bg-accent selection:text-ink">
        <QueryProvider>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <main className="flex-1">{children}</main>
          <SiteChrome>
            <TravelDeskFloat />
            <Footer />
          </SiteChrome>
        </QueryProvider>
      </body>
    </html>
  );
}
