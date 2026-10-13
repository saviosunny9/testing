import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import { BRAND_NAME, COPY } from '@/lib/brand';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: false,
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
  preload: false,
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} · Smart home camera for the ones you love`,
  description: COPY.hero.description,
};

export const viewport: Viewport = {
  themeColor: '#0F3B28',
};

// Hide the intro-animated elements only when JS is running, and never for longer than 4s.
const introScript = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},4000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/media/hero-poster.jpg" fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="bg-cream text-ink">
        <SmoothScroll />
        <Header />
        {children}
      </body>
    </html>
  );
}
