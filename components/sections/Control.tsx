'use client';

import { ChevronLeft, ChevronRight, Mic, Moon, Pause, ScanFace, Video } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BRAND_NAME } from '@/lib/brand';

/** Pans between three renders, like turning the head from the app. */
function PanDemo() {
  const views = ['/media/product/pan-left-white.webp', '/media/product/front-white.webp', '/media/product/pan-right-white.webp'];
  const [i, setI] = useState(1);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % views.length), 2200);
    return () => window.clearInterval(id);
  }, [views.length]);
  return (
    <div className="relative h-full w-full">
      {views.map((src, n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={n === 1 ? `${BRAND_NAME} camera turning its head` : ''}
          loading="lazy"
          className="absolute inset-0 m-auto h-[82%] w-auto object-contain transition-opacity duration-700"
          style={{ opacity: i === n ? 1 : 0 }}
        />
      ))}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-ink shadow-[0_2px_10px_rgba(0,0,0,.08)] backdrop-blur-md">
        <span className="tnum">{['−38°', '0°', '+34°'][i]}</span>
        <span className="text-muted">pan</span>
      </div>
    </div>
  );
}

function AppDemo() {
  return (
    <div className="relative mx-auto h-[88%] translate-y-[8%] rounded-[36px] bg-[#0b0b0c] p-[7px] shadow-[0_30px_60px_-30px_rgba(0,0,0,.45),0_0_0_2px_#c9c9cc] [aspect-ratio:9/19]">
      <div className="flex h-full flex-col overflow-hidden rounded-[30px] bg-black text-white">
        <div className="flex items-center justify-between px-4 pt-3 text-[10px] font-semibold">
          <span>9:41</span>
          <span className="h-[18px] w-16 rounded-full bg-[#0b0b0c] ring-1 ring-white/5" />
          <span>82%</span>
        </div>
        <p className="mt-3 px-4 text-[13px] font-semibold">Family Room</p>
        <div className="relative mx-3 mt-2 aspect-video overflow-hidden rounded-[12px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/stills/gamenight.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[8px] font-semibold backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-rec" /> LIVE
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 px-3 text-[8px] text-white/70">
          {[
            { i: Mic, l: 'Talk' },
            { i: Video, l: 'Record' },
            { i: ScanFace, l: 'People' },
            { i: Moon, l: 'Night' },
          ].map(({ i: Icon, l }) => (
            <span key={l} className="flex flex-col items-center gap-1">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <Icon size={13} strokeWidth={1.8} />
              </span>
              {l}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white/10">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink">
            <Mic size={18} strokeWidth={1.8} />
          </span>
        </div>
      </div>
    </div>
  );
}

function PhotoDemo({ src, children }: { src: string; children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {children}
    </div>
  );
}

const CARDS = [
  {
    title: 'Look around, remotely',
    body: 'Pan and tilt from the app to see more of what matters, without getting up.',
    media: <PanDemo />,
    bg: 'bg-gradient-to-b from-[#f5f5f7] to-[#e8e8ed]',
  },
  {
    title: 'Control the camera from the app',
    body: 'Check in, watch live and manage every camera without being tied to the room.',
    media: <AppDemo />,
    bg: 'bg-gradient-to-b from-[#f5f5f7] to-[#e8e8ed]',
  },
  {
    title: 'Talk, from anywhere',
    body: 'Two-way audio with noise reduction, so “I’m on my way” sounds like you’re in the room.',
    media: (
      <PhotoDemo src="/media/stills/kitchen.jpg">
        <span className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/45 px-4 py-2 text-[13px] text-white backdrop-blur-md">
          <span className="flex h-4 items-center gap-[3px]" aria-hidden>
            {[6, 12, 8, 16, 10, 14, 7].map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-white" style={{ height: h }} />
            ))}
          </span>
          Talking · <span className="tnum">0:12</span>
          <Pause size={13} className="fill-white" strokeWidth={0} />
        </span>
      </PhotoDemo>
    ),
    bg: 'bg-surface',
  },
  {
    title: 'Clear, even at night',
    body: 'Infrared night vision keeps faces readable in a dark room, with no glow to wake anyone.',
    media: (
      <PhotoDemo src="/media/stills/storytime-night.jpg">
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[12px] text-white backdrop-blur-md">
          <Moon size={12} strokeWidth={2} /> Night vision
        </span>
      </PhotoDemo>
    ),
    bg: 'bg-surface',
  },
  {
    title: 'Private by design',
    body: 'One tap pauses seeing, hearing and recording. Recognition happens on the camera, not in the cloud.',
    media: (
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/product/rear-red.webp" alt={`${BRAND_NAME} camera from behind, in Nuuk Red`} loading="lazy" className="absolute inset-0 m-auto h-[82%] w-auto object-contain" />
      </div>
    ),
    bg: 'bg-gradient-to-b from-[#f5f5f7] to-[#e8e8ed]',
  },
];

export default function Control() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = trackRef.current!;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 20), behavior: 'smooth' });
  };

  return (
    <section id="control" className="section overflow-hidden bg-white">
      <div className="container-x">
        <div className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p data-reveal className="eyebrow">
              All. Beautifully. Connected.
            </p>
            <h2 data-reveal className="display h-section mt-4 text-ink">
              Your space. Your control.
            </h2>
          </div>
          <div className="mt-8 hidden gap-3 md:mt-0 md:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                disabled={d === -1 ? edge.start : edge.end}
                aria-label={d === -1 ? 'Previous' : 'Next'}
                className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-surface text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
              >
                {d === -1 ? <ChevronLeft size={20} strokeWidth={1.8} /> : <ChevronRight size={20} strokeWidth={1.8} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={update}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 md:mt-14 md:px-[max(2.5rem,calc((100vw-1200px)/2+2.5rem))]"
        data-lenis-prevent-wheel
      >
        {CARDS.map((c) => (
          <article key={c.title} data-card className="w-[82vw] max-w-[540px] shrink-0 snap-start md:w-[46vw]">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-[28px] ${c.bg}`}>{c.media}</div>
            <h3 className="h-card display mt-6 text-ink">{c.title}</h3>
            <p className="mt-2 max-w-[44ch] text-[15px] text-muted">{c.body}</p>
          </article>
        ))}
        <span className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  );
}
