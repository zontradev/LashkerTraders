import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { STORE_CONFIG } from '@/lib/constants';

export const viewport: Viewport = {
  themeColor: '#0284c7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${STORE_CONFIG.name} — ${STORE_CONFIG.tagline}`,
    template: `%s | ${STORE_CONFIG.name}`,
  },
  description:
    'Lashker Traders is Bangladesh’s trusted partner for authentic baby diapers, pull-up pants, and baby care essentials. Fast home delivery in Dhaka (৳60) and nationwide.',
  keywords: [
    'diaper bangladesh',
    'twinkle diaper price in bangladesh',
    'huggies diaper dhaka',
    'baby diaper pants',
    'lashker traders',
    'neocare diaper online',
    'molfix diaper bangladesh',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: `${STORE_CONFIG.name} — ${STORE_CONFIG.tagline}`,
    description:
      'Buy authentic baby diapers online in Bangladesh. Twinkle, Huggies, Molfix, NeoCare. Cash on delivery & WhatsApp ordering.',
    siteName: STORE_CONFIG.name,
    locale: 'en_BD',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
