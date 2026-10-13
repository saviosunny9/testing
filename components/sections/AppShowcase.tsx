'use client';

import { Bell, Clock3, Play, Radio, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LogoMark } from '@/components/Header';
import { BRAND_NAME } from '@/lib/brand';

const MOMENTS = [
  { src: '/media/stills/gamenight.jpg', t: 'Game night', m: 'Family Room · 6:40 PM' },
  { src: '/media/stills/milo.jpg', t: 'Milo waited by the door', m: 'Living Room · 5:30 PM' },
  { src: '/media/stills/birthday.jpg', t: 'Grandpa’s candles', m: 'Dining Room · 7:42 PM' },
];

const POINTS = [
  { icon: Radio, t: 'Live in a second', d: 'Open the app and you’re in the room, in sharp 2K, day or night.' },
  { icon: Bell, t: 'Alerts that name names', d: '“Zoe is home” and “Milo is on the sofa again”, not “motion detected”.' },
  { icon: Sparkles, t: 'Moments, kept for you', d: 'Laughs, firsts and birthdays are clipped and saved to one timeline your family shares.' },
];

/** The screen of the showcase phone: a credible "Today" view of the Alaro app. */
function AppScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current!;
    v.muted = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = '/media/hero-720.mp4';
        void v.play().catch(() => {});
      } else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#0f100f] text-white">
      <div className="flex items-center justify-between px-[7%] pt-[5.5%] text-[10px] font-medium">
        <span>9:41</span>
        <span className="opacity-80">5G</span>
      </div>
      <div className="mt-[9%] flex items-center gap-2 px-[7%]">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
          <LogoMark size={13} />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-medium">Home</p>
          <p className="text-[10px] text-white/55">3 cameras · everyone’s in</p>
        </div>
      </div>

      <div className="relative mx-[5%] mt-[6%] aspect-[4/5] overflow-hidden rounded-[18px] bg-black">
        <video ref={videoRef} className="h-full w-full object-cover" muted loop playsInline preload="none" poster="/media/hero-poster.jpg" aria-hidden />
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[9px] font-medium backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-rec" /> LIVE · Living Room
        </span>
        <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[9px] backdrop-blur">
          <Clock3 size={10} strokeWidth={2} /> Watching since 4:02 PM
        </span>
      </div>

      <div className="mt-[6%] flex items-baseline justify-between px-[7%]">
        <p className="text-[12px] font-medium">Today’s moments</p>
        <p className="text-[10px] text-white/50">See all</p>
      </div>
      <ul className="mt-2 space-y-1.5 px-[5%]">
        {MOMENTS.map((m) => (
          <li key={m.t} className="flex items-center gap-2.5 rounded-[12px] bg-white/[.06] p-1.5">
            <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-[8px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              <Play size={10} className="absolute inset-0 m-auto fill-white text-white" strokeWidth={0} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[10.5px] font-medium">{m.t}</span>
              <span className="block truncate text-[9px] text-white/50">{m.m}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Realistic phone at an angle, showing what the Alaro app is for. */
export default function AppShowcase() {
  return (
    <section id="app" className="section overflow-hidden bg-white">
      <div className="container-x grid items-center gap-16 md:grid-cols-12 md:gap-10">
        <div className="device-scene relative flex justify-center py-10 md:col-span-6 md:py-16" data-reveal>
          <div className="relative">
            <div className="device-shadow" aria-hidden />
            <div className="device" role="img" aria-label={`The ${BRAND_NAME} app on a phone, showing a live view and today’s moments`}>
              <div className="shell" />
              <div className="bezel" />
              <div className="screen">
                <AppScreen />
              </div>
              <div className="island" />
              <div className="glare" />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:pl-6 lg:pl-12">
          <p data-reveal className="eyebrow">
            The {BRAND_NAME} app
          </p>
          <h2 data-reveal className="display h-section mt-4">
            Your home, <span className="hl">at a glance.</span>
          </h2>
          <p data-read className="body-lg mt-7 max-w-[30ch] text-ink">
            Everything the camera understands, organised so you can catch up in seconds, not scrub through hours.
          </p>
          <ul className="mt-12 max-w-[520px] border-t border-line">
            {POINTS.map(({ icon: Icon, t, d }, i) => (
              <li data-reveal key={t} className="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 border-b border-line py-5">
                <span className="label pt-1">0{i + 1}</span>
                <div>
                  <p className="text-[17px] tracking-[-0.02em] text-ink">{t}</p>
                  <p className="mt-1 max-w-[40ch] text-[14px] text-muted">{d}</p>
                </div>
                <Icon size={16} strokeWidth={1.4} className="mt-1 text-muted" aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
