'use client';

import { useState } from 'react';

const STEPS = [
  {
    title: 'Thoughtful design',
    body: 'Every intelligent feature is designed to make everyday life simpler, safer and more connected.',
    chips: ['Soft-touch finish', 'Quiet motors', 'Fits any shelf'],
    img: '/media/product/detail-dark.webp',
    pos: '60% 50%',
  },
  {
    title: 'Private by design',
    body: 'Recognition runs on the camera. Footage is encrypted end to end, and only your family holds the keys.',
    chips: ['You control who sees your footage', 'Delete anytime', 'On-device AI'],
    img: '/media/product/macro-graphite.webp',
    pos: '55% 45%',
  },
  {
    title: 'Made to last',
    body: 'Two-year warranty, free software updates, and real people on the other end when you need them.',
    chips: ['2-year warranty', 'Free updates', 'Real support 24/7'],
    img: '/media/product/detail-dark.webp',
    pos: '35% 60%',
  },
];

export default function BuiltWithCare() {
  const [active, setActive] = useState(0);
  return (
    <section id="care" data-header-theme="dark" className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 md:left-[38%]" aria-hidden>
        {STEPS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.title}
            src={s.img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)]"
            style={{ objectPosition: s.pos, opacity: active === i ? 1 : 0, transform: active === i ? 'scale(1)' : 'scale(1.04)' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent md:via-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
      </div>

      <div className="container-x relative flex min-h-[720px] flex-col justify-center py-24 md:min-h-[760px]">
        <h2 data-reveal className="display h-section max-w-[10ch]">
          Built with care.
        </h2>
        <ol className="mt-14 max-w-[440px]">
          {STEPS.map((s, i) => {
            const open = active === i;
            return (
              <li key={s.title} className="border-t border-white/15 first:border-t-0">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`focus-ring flex w-full items-baseline gap-4 py-5 text-left transition-colors ${open ? 'text-white' : 'text-white/45 hover:text-white/80'}`}
                >
                  <span className="tnum text-[13px]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[1.35rem]">{s.title}</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden pl-9">
                    <p className="text-[15px] text-white/75">{s.body}</p>
                    <div className="flex flex-wrap gap-2 pb-6 pt-4">
                      {s.chips.map((c) => (
                        <span key={c} className="rounded-full border border-white/20 bg-white/[.06] px-3 py-1.5 text-[12px] text-white/85">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
