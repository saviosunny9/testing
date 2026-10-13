import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import { BRAND_NAME, COPY } from '@/lib/brand';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap', preload: false });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: `${BRAND_NAME} · The intelligence behind your space`,
  description: COPY.hero.description,
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

// Hide the intro-animated elements only when JS is running, and never for longer than 4s.
const introScript = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},4000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/media/hero-poster.jpg" fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="bg-white text-ink">
        <SmoothScroll />
        <Header />
        {children}
      </body>
    </html>
  );
}
