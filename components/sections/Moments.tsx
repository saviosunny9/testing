'use client';

import { ArrowRight, DoorOpen, Package, Store, Users } from 'lucide-react';
import { useState } from 'react';
import { BRAND_NAME } from '@/lib/brand';

type Mode = 'family' | 'business';

function Photo({ src, alt, className = '', children }: { src: string; alt: string; className?: string; children?: React.ReactNode }) {
  return (
    <figure data-reveal className={`group relative overflow-hidden rounded-[24px] bg-surface ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
      />
      {children}
    </figure>
  );
}

function Caption({ quote, meta }: { quote: string; meta: string }) {
  return (
    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent p-5 pt-16 text-white md:p-6 md:pt-20">
      <p className="display text-[1.35rem] leading-[1.1] md:text-[1.6rem]">“{quote}”</p>
      <p className="mt-2 text-[12px] text-white/75">{meta}</p>
    </figcaption>
  );
}

function FamilyGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:grid-rows-[300px_300px] lg:grid-rows-[340px_340px]">
      <Photo src="/media/stills/birthday-portrait.jpg" alt="Grandpa leaning in to blow out his birthday candles" className="aspect-[3/4] md:row-span-2 md:aspect-auto">
        <Caption quote="Grandpa’s 70th" meta={`7:42 PM · ${BRAND_NAME} saved this moment`} />
      </Photo>
      <Photo src="/media/stills/storytime.jpg" alt="A toddler reading a picture book on the bed with her mum" className="aspect-[4/3] md:aspect-auto">
        <Caption quote="Zoe read to Mum tonight" meta="8:15 PM · Bedroom" />
      </Photo>
      <Photo src="/media/stills/gamenight.jpg" alt="A dad and son playing a block-stacking game" className="aspect-[4/3] md:aspect-auto">
        <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
          Game night · Family Room
        </span>
      </Photo>
      <Photo src="/media/stills/milo.jpg" alt="A ginger cat sitting on a wooden floor by the plants" className="aspect-[4/3] md:aspect-auto">
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-ink">Milo waited by the door</span>
      </Photo>
      <div
        data-reveal
        className="flex flex-col items-center justify-center gap-6 rounded-[24px] bg-gradient-to-b from-[#f5f5f7] to-[#e3e3e8] p-8 text-center"
      >
        <p className="max-w-[26ch] text-[1.125rem] font-medium leading-snug text-ink">
          The moments you’d never want to miss, captured, remembered and shared just for you.
        </p>
        <a href="#ask" className="btn btn-dark btn-sm">
          See a day with {BRAND_NAME}
        </a>
      </div>
    </div>
  );
}

const BARS = [12, 18, 26, 34, 30, 44, 38, 52, 66, 88, 72, 40];

function BusinessGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:grid-rows-[300px_300px] lg:grid-rows-[340px_340px]">
      <div data-reveal className="relative flex flex-col overflow-hidden rounded-[24px] bg-surface p-7 md:row-span-2">
        <p className="eyebrow">For Business</p>
        <p className="display mt-3 max-w-[14ch] text-[1.75rem] text-ink">Keep an eye on the shop floor.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/product/front-red.webp" alt={`${BRAND_NAME} camera in Nuuk Red`} width={1355} height={1258} loading="lazy" className="mx-auto mt-auto h-auto w-[78%] max-w-[360px] object-contain" />
      </div>
      <div data-reveal className="rounded-[24px] bg-[#1d1d1f] p-6 text-white">
        <p className="text-[13px] text-white/60">Today at the shop</p>
        <ul className="mt-4 space-y-3 text-[15px]">
          {[
            { t: '9:02 AM', l: 'Shop opened', i: Store },
            { t: '11:40 AM', l: 'Delivery arrived', i: Package },
            { t: '6:30 PM', l: 'Busiest hour', i: Users },
            { t: '9:12 PM', l: 'Shutter down', i: DoorOpen },
          ].map(({ t, l, i: Icon }) => (
            <li key={l} className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <Icon size={15} strokeWidth={1.6} />
              </span>
              <span className="flex-1">{l}</span>
              <span className="tnum text-[13px] text-white/55">{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div data-reveal className="flex flex-col rounded-[24px] bg-surface p-6">
        <p className="text-[13px] text-muted">Footfall today</p>
        <p className="display mt-1 text-[2.25rem] text-ink">
          142 <span className="text-[1rem] font-medium text-muted">visitors</span>
        </p>
        <div className="mt-auto flex h-24 items-end gap-1.5" aria-label="Hourly footfall, busiest at 6 to 7 PM">
          {BARS.map((h, i) => (
            <span key={i} className={`flex-1 rounded-[3px] ${i === 9 ? 'bg-ink' : 'bg-[#c7c7cc]'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <Photo src="/media/stills/kitchen.jpg" alt="A mum lifting her toddler in a bright kitchen" className="aspect-[4/3] md:aspect-auto">
        <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
          And home, after closing
        </span>
      </Photo>
      <div
        data-reveal
        className="flex flex-col items-center justify-center gap-6 rounded-[24px] bg-gradient-to-b from-[#f5f5f7] to-[#e3e3e8] p-8 text-center"
      >
        <p className="max-w-[24ch] text-[1.125rem] font-medium leading-snug text-ink">
          Openings, deliveries and quiet hours, summed up before you ask.
        </p>
        <a href="#choose" className="btn btn-dark btn-sm">
          {BRAND_NAME} for Business <ArrowRight size={15} strokeWidth={1.8} />
        </a>
      </div>
    </div>
  );
}

export default function Moments() {
  const [mode, setMode] = useState<Mode>('family');
  return (
    <section id="moments" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p data-reveal className="eyebrow">
            A day, beautifully understood
          </p>
          <h2 data-reveal className="display h-section mt-4 text-ink">
            You can’t be everywhere. <span className="text-[#86868b]">But you can still be part of it.</span>
          </h2>
          <div data-reveal role="tablist" aria-label="Show moments for" className="mt-9 inline-flex rounded-full bg-surface p-1">
            {(['family', 'business'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={mode === m}
                aria-controls={`moments-${m}`}
                onClick={() => setMode(m)}
                className={`focus-ring rounded-full px-5 py-2 text-[14px] font-medium transition-all duration-300 ${
                  mode === m ? 'bg-white text-ink shadow-[0_1px_4px_rgba(0,0,0,.12)]' : 'text-muted hover:text-ink'
                }`}
              >
                {m === 'family' ? 'For Family' : 'For Business'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <div id="moments-family" role="tabpanel" hidden={mode !== 'family'} className="animate-[fadeUp_.6s_ease]">
            <FamilyGrid />
          </div>
          <div id="moments-business" role="tabpanel" hidden={mode !== 'business'} className="animate-[fadeUp_.6s_ease]">
            <BusinessGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
