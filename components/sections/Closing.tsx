'use client';

import { useState } from 'react';
import { Logo } from '@/components/Header';
import { BRAND_NAME, PRICE } from '@/lib/brand';

export function ClosingCTA() {
  return (
    <section className="bg-white pb-24 md:pb-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[3px] bg-paper px-6 pt-20 text-center md:pt-24">
          <h2 data-reveal className="display h-section mx-auto max-w-[16ch] text-ink">
            Ready to bring {BRAND_NAME} into your space?
          </h2>
          <p data-reveal className="lede mx-auto mt-5">
            Wherever life takes you, home never feels far away.
          </p>
          <div data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href="#buy" className="btn btn-dark">
              Buy {BRAND_NAME} · from {PRICE}
            </a>
            <a href="#moments" className="link text-[15px]">
              See how it works
            </a>
          </div>
          <p data-reveal className="mt-5 text-[13px] text-muted">
            Free returns · 2-year warranty · No monthly fee
          </p>
          <div className="mx-auto mt-10 flex max-w-[900px] items-end justify-center gap-[2%]">
            {['graphite', 'white', 'red'].map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c}
                data-parallax={String([6, 0, 6][i])}
                src={`/media/product/front-${c}.webp`}
                width={1355}
                height={1258}
                alt=""
                loading="lazy"
                className={`h-auto w-[30%] object-contain ${i === 1 ? 'mb-0' : 'mb-[-2%] opacity-95'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const [done, setDone] = useState(false);
  return (
    <footer data-header-theme="dark" className="on-dark overflow-hidden bg-black pt-16 text-white">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 text-[14px] text-white/55">Stay close to what matters.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3 text-[14px] text-white/75">
            {[
              ['Moments', '#moments'],
              ['Design', '#design'],
              [`Ask ${BRAND_NAME}`, '#ask'],
              ['Colours', '#colours'],
              ['Support', '#faq'],
            ].map(([l, h]) => (
              <a key={l} href={h} className="focus-ring hover:text-white">
                {l}
              </a>
            ))}
          </nav>
        </div>

        <form
          className="mt-12 flex max-w-[560px] flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-email"
            type="email"
            required
            placeholder="Email for setup tips and updates"
            className="focus-ring h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-white/[.08] px-5 text-[15px] text-white placeholder:text-white/45"
          />
          <button type="submit" className="btn h-12 border border-white/40 text-white hover:bg-white hover:text-ink">
            {done ? 'You’re on the list' : 'Notify me'}
          </button>
        </form>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-[12px] text-white/45 sm:flex-row sm:justify-between">
          <span>© 2026 {BRAND_NAME}. All rights reserved.</span>
          <span>Made for the moments that matter.</span>
        </div>
      </div>
      <p aria-hidden className="h-mega mt-16 select-none overflow-hidden whitespace-nowrap text-center leading-[0.78] text-white/[.08]">
        alaro
      </p>
    </footer>
  );
}
