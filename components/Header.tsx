'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SoundToggle from '@/components/SoundToggle';
import { BRAND_NAME, NAV_LINKS } from '@/lib/brand';
import { getCartCount, subscribeCart } from '@/lib/cart';
import { getHeaderTheme, subscribeHeaderTheme } from '@/lib/headerTheme';
import { lockScroll, unlockScroll } from '@/lib/lenis';

/** Four slanted petals, as on the wireframe's logo. */
export function LogoMark({ size = 20 }: { size?: number | string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <rect x="4.4" y="1.6" width="4.6" height="10" rx="2.3" transform="rotate(35 6.7 6.6)" />
      <rect x="14.6" y="1.6" width="4.6" height="10" rx="2.3" transform="rotate(35 16.9 6.6)" />
      <rect x="4.4" y="12.4" width="4.6" height="10" rx="2.3" transform="rotate(35 6.7 17.4)" />
      <rect x="14.6" y="12.4" width="4.6" height="10" rx="2.3" transform="rotate(35 16.9 17.4)" />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={22} />
      <span className="text-[1.15rem] font-normal tracking-[-0.03em]">{BRAND_NAME.toLowerCase()}</span>
    </span>
  );
}

/** Viewer's local time, e.g. "IST 11:07 am", like the reference header. */
function LocalClock() {
  const [text, setText] = useState('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const tz =
        new Intl.DateTimeFormat('en', { timeZoneName: 'short' }).formatToParts(d).find((p) => p.type === 'timeZoneName')?.value ?? '';
      const h = d.getHours();
      const t = `${((h + 11) % 12) + 1}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
      setText(`${tz} ${t}`.trim());
    };
    fmt();
    const id = window.setInterval(fmt, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="tnum" suppressHydrationWarning>
      {text}
    </span>
  );
}

export default function Header() {
  const [theme, setTheme] = useState(getHeaderTheme);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState(getCartCount);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => subscribeHeaderTheme(setTheme), []);
  useEffect(() => subscribeCart(setCart), []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
      toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className="site-header pointer-events-none fixed inset-x-0 top-0 z-[60]"
      data-theme={theme}
      data-menu={open ? 'open' : 'closed'}
    >
      <div className="header-shade pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Full-screen menu */}
      <div
        id="site-menu"
        className="menu-overlay pointer-events-auto fixed inset-0 flex flex-col bg-[var(--bg)] px-5 pb-10 pt-24 text-ink md:px-8"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="grid flex-1 gap-10 md:grid-cols-2">
          <nav aria-label="Menu" className="flex flex-col">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href + l.label}
                href={l.href}
                onClick={close}
                className="display focus-ring flex items-baseline gap-5 border-b border-line py-3 text-[clamp(2.25rem,5vw,4.25rem)] transition-colors hover:text-muted"
              >
                <span className="label">{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col justify-end gap-6 md:items-end">
            <p className="body-lg max-w-[22ch] text-muted md:text-right">The intelligence behind your space.</p>
            <a href="#buy" onClick={close} className="btn btn-dark">
              Buy {BRAND_NAME}
            </a>
          </div>
        </div>
      </div>

      <div className="header-bar intro-hide relative grid grid-cols-[1fr_auto] items-center px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-8 md:py-5">
        <div className="flex items-center gap-4">
          <a href="#top" className="focus-ring pointer-events-auto" aria-label={`${BRAND_NAME} home`}>
            <Logo />
          </a>
          <span className="header-muted hidden items-center gap-4 text-[15px] lg:inline-flex">
            <span className="h-[5px] w-[5px] bg-current opacity-60" aria-hidden />
            Smart home camera
          </span>
        </div>

        <div className="header-muted hidden text-[15px] md:block">
          <LocalClock />
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <SoundToggle />
          <a
            href="#buy"
            className="focus-ring pointer-events-auto inline-flex items-center gap-1.5 px-2 text-[15px]"
            aria-label={`Bag, ${cart} ${cart === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={16} strokeWidth={1.4} />
            <span className="tnum">({cart})</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="header-menu btn btn-sm focus-ring pointer-events-auto min-w-[5rem]"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'close' : 'menu'}
          </button>
        </div>
      </div>
    </header>
  );
}
