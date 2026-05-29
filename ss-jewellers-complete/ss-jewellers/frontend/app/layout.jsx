import { Cinzel, Cormorant_Garamond, Raleway } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import ScrollTop from '@/components/ui/ScrollTop';
import '@/styles/globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: { template: '%s | S.S. Jewellers', default: 'S.S. Jewellers – Timeless Gold & Bridal Jewellery' },
  description: 'S.S. Jewellers – India\'s premium gold jewellery brand since 1987. Shop 22K & 24K BIS-certified gold rings, necklaces, bridal sets & more. Free hallmarking on all orders above ₹25,000.',
  keywords: ['gold jewellery', 'bridal jewellery', '22k gold', '24k gold', 'SS Jewellers', 'Hyderabad jewellery', 'BIS hallmarked'],
  openGraph: {
    title: 'S.S. Jewellers – Timeless Gold & Bridal Jewellery',
    description: 'Crafted in pure gold since 1987.',
    siteName: 'S.S. Jewellers',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  themeColor: '#C9A84C',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${raleway.variable}`}>
      <body className="bg-obsidian text-cream font-serif overflow-x-hidden">
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ScrollTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#FAF6EE',
              border: '1px solid rgba(201,168,76,0.3)',
              fontFamily: 'Raleway, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.5px',
            },
          }}
        />
      </body>
    </html>
  );
}
