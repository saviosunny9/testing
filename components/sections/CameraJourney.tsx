'use client';

import { Cpu, KeyRound, Lock } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BRAND_NAME } from '@/lib/brand';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * The camera in the right-hand column, from rendered frames (tools/camera-render/sequence.js, cropped to the hero
 * camera's frame). Frames 0–22 turn the head by pan (-61° → +49° in 5° steps); frame 9 is the hero's view (-16°);
 * frames 23–32 tip the head down-to-up (7.5° → 75°).
 */
const FRAMES = 33;
const frame = (i: number) => `/media/camera/f${String(i).padStart(2, '0')}.webp`;
const CENTRE = 9;
const RIGHT = 22;
const LEFT = 0;
const TILT0 = 23;

/** Which frame to show at a point (0–1) through the pinned section. */
export function frameAt(p: number): number {
  if (p < 1 / 3) return Math.round(CENTRE + p * 3 * (RIGHT - CENTRE)); // design: turns to the right
  if (p < 2 / 3) return Math.round(RIGHT + (p * 3 - 1) * (LEFT - RIGHT)); // pan and tilt: sweeps across to the left
  const u = p * 3 - 2; // privacy: back to centre, then tips up
  if (u < 0.4) return Math.round(LEFT + (u / 0.4) * CENTRE);
  const t = (u - 0.4) / 0.6;
  if (t < 0.1) return CENTRE;
  return TILT0 + Math.round(((t - 0.1) / 0.9) * 9);
}

/* ----------------------------------------------------------------- copy */

function Eyebrow({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="eyebrow">
      {n} · {children}
    </p>
  );
}

function DesignCopy() {
  return (
    <>
      <Eyebrow n="01">Design</Eyebrow>
      <h2 className="display h-section mt-4">
        Designed to disappear <span className="hl">into your home.</span>
      </h2>
      <p className="body-lg mt-7 max-w-[30ch]">
        A soft-touch shell in three quiet finishes, small enough for any shelf. No blinking lights, nothing that looks like a security
        camera.
      </p>
      <dl className="stat-row mt-12 max-w-[460px]">
        {[
          ['14', 'cm', 'Height'],
          ['7.4', 'cm', 'Base'],
          ['3', '', 'Finishes'],
        ].map(([v, u, l]) => (
          <div key={l}>
            <dt className="label label-br">{l}</dt>
            <dd className="stat tnum mt-5">
              {v}
              {u && <span className="ml-1 text-[0.42em] tracking-[-0.02em] text-muted">{u}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function SeeCopy() {
  return (
    <>
      <Eyebrow n="02">Pan and tilt</Eyebrow>
      <h2 className="display h-section mt-4">
        Turns to see <span className="hl">the whole room.</span>
      </h2>
      <p className="body-lg mt-7 max-w-[30ch]">
        Look around from your phone, or let {BRAND_NAME} quietly follow the action on its own. One camera covers what used to take three.
      </p>
      <dl className="stat-row mt-12 max-w-[460px]">
        {[
          ['350', '°', 'Pan'],
          ['75', '°', 'Tilt'],
          ['2K', 'HDR', 'Video'],
        ].map(([v, u, l]) => (
          <div key={l}>
            <dt className="label label-br">{l}</dt>
            <dd className="stat tnum mt-5">
              {v}
              <span className="ml-0.5 text-[0.42em] tracking-[-0.02em] text-muted">{u}</span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function PrivacyCopy() {
  return (
    <>
      <Eyebrow n="03">Privacy</Eyebrow>
      <h2 className="display h-section mt-4">
        Private <span className="hl">by design.</span>
      </h2>
      <p className="body-lg mt-7 max-w-[30ch]">
        Turn on privacy mode and the lens tips down and stops recording. What it learns about your home stays in your home.
      </p>
      <ul className="mt-12 max-w-[460px] border-t border-white/15">
        {[
          { icon: Cpu, t: 'Recognition on the camera', d: 'Faces and pets are recognised on the device, not in the cloud.' },
          { icon: KeyRound, t: 'End-to-end encrypted', d: 'Only your family’s phones hold the keys.' },
          { icon: Lock, t: 'Privacy mode', d: 'One tap, and it looks away.' },
        ].map(({ icon: Icon, t, d }, i) => (
          <li key={t} className="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 border-b border-white/15 py-4">
            <span className="label pt-1">0{i + 1}</span>
            <div>
              <p className="text-[17px] font-normal tracking-[-0.02em]">{t}</p>
              <p className="mt-1 text-[14px] text-white/60">{d}</p>
            </div>
            <Icon size={16} strokeWidth={1.4} className="mt-1 text-white/55" aria-hidden />
          </li>
        ))}
      </ul>
    </>
  );
}

const PANELS = [DesignCopy, SeeCopy, PrivacyCopy];

/* ----------------------------------------------------------------- pinned (desktop) */

function Pinned() {
  const root = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const r = root.current!;
    const s = sticky.current!;
    const im = img.current!;
    const shown = { f: CENTRE, a: 0 };

    // fetch the sequence once the section is close, so scrolling never waits on a frame
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        for (let i = 0; i < FRAMES; i++) {
          const pre = new Image();
          pre.src = frame(i);
        }
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(r);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: r,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          const f = frameAt(p);
          if (f !== shown.f) {
            shown.f = f;
            im.src = frame(f);
          }
          const a = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
          if (a !== shown.a) {
            shown.a = a;
            setActive(a);
            // the privacy panel is dark, so the header switches to light type over it
            if (a === 2) s.dataset.headerTheme = 'dark';
            else delete s.dataset.headerTheme;
          }
        },
      });

      // the camera arrives from the hero: it starts off to the left and settles into its column
      gsap.fromTo(
        visual.current,
        { x: () => -window.innerWidth * 0.3, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: r, start: 'top bottom', end: 'top top', scrub: true } },
      );
    }, r);

    return () => {
      io.disconnect();
      ctx.revert();
      delete s.dataset.headerTheme;
    };
  }, []);

  const surface = active === 2 ? 'bg-forest on-dark text-white' : active === 1 ? 'bg-white text-ink' : 'bg-paper text-ink';

  return (
    <section ref={root} id="design" className="relative h-[300svh]" aria-label="Camera features">
      <div ref={sticky} className={`sticky top-0 h-[100svh] overflow-hidden transition-colors duration-700 ${surface}`}>
        <div className="container-x grid h-full items-center gap-10 md:grid-cols-12">
          <div className="grid md:col-span-5">
            {PANELS.map((Panel, i) => (
              <div
                key={i}
                className={`col-start-1 row-start-1 transition-opacity duration-700 ease-out ${
                  active === i ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={active !== i}
              >
                <Panel />
              </div>
            ))}
          </div>

          <div ref={visual} className="flex justify-center md:col-span-6 md:col-start-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={img}
              src={frame(CENTRE)}
              width={1119}
              height={1300}
              alt={`The ${BRAND_NAME} camera`}
              decoding="async"
              className="block h-auto max-h-[min(78svh,760px)] w-auto max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- stacked (mobile, reduced motion) */

const STILLS = [CENTRE, RIGHT, FRAMES - 1];

function Stacked() {
  return (
    <>
      {PANELS.map((Panel, i) => (
        <section
          key={i}
          id={i === 0 ? 'design' : undefined}
          className={`section ${i === 2 ? 'on-dark bg-forest text-white' : i === 1 ? 'bg-white' : 'bg-paper'}`}
        >
          <div className="container-x grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Panel />
            </div>
            <div className="flex justify-center md:col-span-6 md:col-start-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frame(STILLS[i])}
                width={1119}
                height={1300}
                alt={`The ${BRAND_NAME} camera`}
                loading="lazy"
                className="block h-auto w-[80%] max-w-[420px]"
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

/* ----------------------------------------------------------------- switch on the screen and motion setting */

export default function CameraJourney() {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return pinned ? <Pinned /> : <Stacked />;
}
