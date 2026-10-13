'use client';

import { Check, ChevronDown, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BRAND_NAME, PRICE } from '@/lib/brand';
import { addToCart } from '@/lib/cart';
import ProductViewer from './ProductViewer';

const COLORS = [
  { id: 'graphite', name: 'Graphite', swatch: '#3a3b3e' },
  { id: 'white', name: 'Chalk White', swatch: '#eeedea' },
  { id: 'red', name: 'Nuuk Red', swatch: '#b8232b' },
] as const;

type ColorId = (typeof COLORS)[number]['id'];

const FEATURES = [
  { title: 'Live view, whenever you need it', body: 'Open the app and you’re there in under a second, in sharp 2K, day or night.' },
  { title: 'Smart alerts worth your attention', body: 'Know when the kids are home or Grandpa is up and about. Skip the passing cars and swaying curtains.' },
  { title: 'Meaningful moments, all in one place', body: 'Laughs, firsts and birthdays are clipped and kept in a timeline your family can share.' },
  { title: 'Answers, simply by asking', body: `Ask ${BRAND_NAME} “did the parcel arrive?” and get the clip, not a list of motion events.` },
];

function PhoneOverlay() {
  return (
    <div className="pointer-events-none absolute bottom-[-8%] right-[4%] w-[30%] min-w-[130px] max-w-[190px] rounded-[30px] bg-[#0b0b0c] p-[6px] shadow-[0_40px_60px_-30px_rgba(0,0,0,.5),0_0_0_2px_#c9c9cc] md:right-[-6%]">
      <div className="overflow-hidden rounded-[25px] bg-white">
        <div className="flex items-center justify-between px-3 pt-2.5 text-[9px] font-semibold text-ink">
          <span>{BRAND_NAME.toUpperCase()}.</span>
          <span className="text-muted">•••</span>
        </div>
        <div className="mx-2 mt-2 aspect-[4/3] overflow-hidden rounded-[14px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/stills/sofa.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="px-3 pb-3 pt-3">
          <p className="text-[8px] font-semibold tracking-[0.12em] text-muted">TODAY AT HOME</p>
          <p className="mt-1 text-[12px] font-semibold text-ink">Everyone’s home.</p>
          <p className="text-[9px] text-muted">3 moments to catch up on</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {['/media/stills/gamenight.jpg', '/media/stills/milo.jpg', '/media/stills/birthday.jpg'].map((s) => (
              <div key={s} className="aspect-square overflow-hidden rounded-[6px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const [color, setColor] = useState<ColorId>('graphite');
  const [openIdx, setOpenIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const current = COLORS.find((c) => c.id === color)!;

  // "Buy" links elsewhere on the page carry data-color to preselect a colour here.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-color]');
      const c = a?.dataset.color as ColorId | undefined;
      if (c && COLORS.some((x) => x.id === c)) setColor(c);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <section id="buy" className="section bg-white">
      <span id="plans" />
      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6">
          <div className="relative md:sticky md:top-24">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] transition-colors duration-700"
              style={{ background: `var(--tint-${color})` }}
            >
              <ProductViewer color={color} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" />
              <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-medium text-ink backdrop-blur-md">
                Drag to look around · {current.name}
              </span>
              <PhoneOverlay />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:pl-6 lg:pl-10">
          <p data-reveal className="eyebrow">
            The {BRAND_NAME} experience
          </p>
          <h2 data-reveal className="display h-section mt-4 text-ink">
            Everything you need, <span className="hl">right from your phone.</span>
          </h2>
          <p data-reveal className="lede mt-6 max-w-[38ch]">
            One beautiful, connected experience for everything that matters, right in your hand.
          </p>

          <ol data-reveal className="mt-10 border-t border-line">
            {FEATURES.map((f, i) => {
              const open = openIdx === i;
              return (
                <li key={f.title} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIdx(open ? -1 : i)}
                    className="focus-ring flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span className="tnum text-[13px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-[17px] font-medium text-ink">{f.title}</span>
                    <ChevronDown size={18} strokeWidth={1.6} className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <p className="overflow-hidden pl-10 text-[15px] text-muted">
                      <span className="block pb-5">{f.body}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div data-reveal className="mt-10 rounded-[28px] bg-surface p-7 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[19px] font-semibold text-ink">{BRAND_NAME} Smart Camera</h3>
              <p className="display text-[1.75rem] text-ink">{PRICE}</p>
            </div>
            <p className="mt-1 text-[13px] text-muted">or ₹625/mo. for 12 mo. with no-cost EMI</p>

            <fieldset className="mt-6">
              <legend className="text-[14px] text-ink">
                Colour · <span className="text-muted">{current.name}</span>
              </legend>
              <div className="mt-3 flex gap-3">
                {COLORS.map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={c.id}
                      checked={color === c.id}
                      onChange={() => setColor(c.id)}
                      className="peer sr-only"
                    />
                    <span
                      className="block h-8 w-8 rounded-full ring-1 ring-black/10 ring-offset-[3px] ring-offset-surface transition-shadow peer-checked:ring-2 peer-checked:ring-blue peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blue"
                      style={{ background: c.swatch }}
                    />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              In the box: camera, power adapter and cable, wall mount, quick-start card. The app is free, with no subscription
              needed for live view and alerts.
            </p>

            <button
              type="button"
              onClick={() => {
                addToCart();
                setAdded(true);
              }}
              className="btn btn-dark mt-6 h-12 w-full sm:w-auto sm:px-8"
            >
              {added ? <Check size={17} strokeWidth={2} /> : <ShoppingBag size={17} strokeWidth={1.6} />}
              {added ? 'Added to Bag' : 'Add to Bag'}
            </button>

            <ul className="mt-6 grid gap-x-6 gap-y-2 text-[13px] text-ink-2 sm:grid-cols-2">
              {['Free delivery in 2–4 days', '30-day free returns', '2-year warranty', 'UPI, cards and EMI'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={2} className="text-live" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-[13px] text-muted">
              Set up in 5 minutes: plug in, scan, name your people.{' '}
              <a href="#faq" className="link">
                Questions? Talk to us
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
