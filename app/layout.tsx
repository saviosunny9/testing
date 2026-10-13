import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import { BRAND_NAME, COPY } from '@/lib/brand';
import './globals.css';

// Switzer by the Indian Type Foundry, self-hosted (ITF Free Font License, see app/fonts/switzer/LICENSE.md).
const switzer = localFont({
  // Light and regular only: the site never uses bold. 500 is kept for tiny UI labels.
  src: [
    { path: './fonts/switzer/switzer-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/switzer/switzer-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/switzer/switzer-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/switzer/switzer-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-switzer',
  display: 'swap',
  preload: false,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

// Small uppercase technical labels ("[ RANGE ]").
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: `${BRAND_NAME} · The intelligence behind your space`,
  description: COPY.hero.description,
};

export const viewport: Viewport = {
  themeColor: '#fafafa',
};

// Hide the intro-animated elements only when JS is running, and never for longer than 3s.
const introScript = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},3000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${switzer.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/media/hero-poster.jpg" fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <SmoothScroll />
        <Header />
        {children}
      </body>
    </html>
  );
}
