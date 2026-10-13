'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BRAND_WORDMARK, COPY, NAV_LINKS } from '@/lib/brand';
import { getHeaderTheme, subscribeHeaderTheme } from '@/lib/headerTheme';
import { lockScroll, unlockScroll } from '@/lib/lenis';

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-sans text-[1.65rem] font-bold leading-none tracking-[-0.055em] ${className}`}>
      {BRAND_WORDMARK}
      <span className="ml-[0.06em] inline-block h-[0.2em] w-[0.2em] rounded-full bg-leaf align-baseline" aria-hidden />
    </span>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" strokeLinecap="round" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [theme, setTheme] = useState(getHeaderTheme);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => subscribeHeaderTheme(setTheme), []);

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
      <div className="header-shade pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className="menu-overlay pointer-events-auto fixed inset-0 flex flex-col bg-forest px-6 pb-10 pt-28 text-white lg:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close} className="focus-ring text-4xl font-light tracking-[-0.03em]">
              {l.label}
            </a>
          ))}
          <a href="#product" onClick={close} className="pill pill-md focus-ring mt-6 self-start bg-leaf text-ink">
            {COPY.hero.shopCta} <ArrowRight size={18} strokeWidth={1.5} />
          </a>
        </nav>
        <div className="mt-auto flex gap-5 text-white/80">
          <a href="#" aria-label="Instagram" className="focus-ring">
            <InstagramIcon />
          </a>
          <a href="#" aria-label="YouTube" className="focus-ring">
            <YoutubeIcon />
          </a>
          <a href="#" aria-label="TikTok" className="focus-ring">
            <TiktokIcon />
          </a>
        </div>
      </div>

      <div className="header-bar intro-hide relative flex items-center p-6 lg:p-10">
        <div className="flex flex-1 items-center">
          <a href="#top" className="focus-ring pointer-events-auto" aria-label="Home">
            <Wordmark />
          </a>
        </div>

        <nav aria-label="Primary" className="hidden flex-1 justify-center gap-6 whitespace-nowrap lg:flex xl:gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring pointer-events-auto text-[0.9375rem] font-medium opacity-90 transition-opacity hover:opacity-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 justify-end">
          <a href="#product" className="header-cta pill pill-md focus-ring pointer-events-auto hidden lg:inline-flex">
            {COPY.hero.shopCta} <ArrowRight size={18} strokeWidth={1.5} />
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
                className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
                style={{ transform: open ? 'translateY(3.5px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute bottom-0 left-0 h-[2px] w-5 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
                style={{ transform: open ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
