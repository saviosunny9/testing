'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="display text-[1.2rem] tracking-[-0.03em]">{BRAND_NAME}</span>
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
      <div className="header-shade pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className="menu-overlay pointer-events-auto fixed inset-0 flex flex-col bg-white px-6 pb-10 pt-24 text-ink lg:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              onClick={close}
              className="display focus-ring border-b border-line py-4 text-[1.75rem] font-medium"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#buy" onClick={close} className="btn btn-dark mt-8 self-start">
          Buy {BRAND_NAME}
        </a>
      </div>

      <div className="header-bar intro-hide relative flex items-center px-5 py-5 lg:px-10 lg:py-6">
        <div className="flex flex-1 items-center">
          <a href="#top" className="focus-ring pointer-events-auto" aria-label={`${BRAND_NAME} home`}>
            <Logo />
          </a>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-7 whitespace-nowrap lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              className="focus-ring pointer-events-auto text-[0.8125rem] opacity-85 transition-opacity hover:opacity-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <a href="#buy" className="header-buy btn btn-sm focus-ring pointer-events-auto hidden !h-8 !px-4 !text-[0.8125rem] lg:inline-flex">
            Buy
          </a>
          <a
            href="#buy"
            className="focus-ring pointer-events-auto inline-flex items-center gap-1.5 text-[0.8125rem] opacity-85 hover:opacity-100"
            aria-label={`Cart, ${cart} ${cart === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={17} strokeWidth={1.6} />
            <span className="hidden lg:inline">Cart ({cart})</span>
            {cart > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white lg:hidden">{cart}</span>}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="focus-ring pointer-events-auto relative -mr-2 grid h-10 w-10 place-items-center lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-[9px] w-5">
              <span
                className="absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
                style={{ transform: open ? 'translateY(3.75px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
                style={{ transform: open ? 'translateY(-3.75px) rotate(-45deg)' : 'none' }}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
