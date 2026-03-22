import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EARTHGANG O.G. Tattoo Studio | Chiang Mai',
    template: '%s | EARTHGANG O.G. Tattoo',
  },
  description: 'Premium tattoo studio in Chiang Mai specializing in Blackwork, Fineline & Traditional. Online booking, membership benefits, and loyalty rewards.',
  keywords: ['tattoo', 'chiang mai', 'รอยสัก', 'เชียงใหม่', 'blackwork', 'fineline', 'traditional', '纹身', '清迈'],
  openGraph: {
    type: 'website',
    url: 'https://www.earthgangtattoo.com',
    siteName: 'EARTHGANG O.G. Tattoo Studio',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#D70000" />
      </head>
      <body className="bg-brand-black text-brand-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer locale={locale} />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid #D70000',
              },
              success: { iconTheme: { primary: '#D70000', secondary: '#fff' } },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
