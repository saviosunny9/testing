'use client';

import { ScanFace, Star } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { LogoMark } from '@/components/Header';
import { gsap } from '@/lib/gsap';
import DetectionBox from './DetectionBox';
import { SCENES } from './scenes';
import type { VideoClock } from './videoClock';

const pad = (n: number) => String(n).padStart(2, '0');

/** Live wall-clock time in the viewer's timezone. */
function Clock({ live }: { live: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (!live) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [live]);
  return <span suppressHydrationWarning>{now ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : '00:00:00'}</span>;
}

/** Text that crossfades whenever the scene changes. */
function SceneText({ clock, pick }: { clock: VideoClock; pick: (i: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const pickRef = useRef(pick);
  useEffect(() => {
    const el = ref.current!;
    let first = true;
    return clock.onScene((i) => {
      const text = pickRef.current(i);
      if (first) {
        first = false;
        el.textContent = text;
        return;
      }
      gsap
        .timeline({ overwrite: true })
        .to(el, { opacity: 0, duration: 0.12 })
        .call(() => {
          el.textContent = text;
        })
        .to(el, { opacity: 1, duration: 0.18 });
    });
  }, [clock]);
  return <span ref={ref}>{pick(0)}</span>;
}

function LoopProgress({ clock }: { clock: VideoClock }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      clock.onFrame((t, d) => {
        const p = Math.min(1, Math.max(0, t / d));
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
        if (knobRef.current) knobRef.current.style.transform = `translate3d(${p * 100}%, 0, 0)`;
      }),
    [clock],
  );
  return (
      <div className="hud-item hud-extra relative mt-[3.2cqh] h-[0.8cqh] min-h-[2px] rounded-full bg-white/25">
        <div ref={fillRef} className="absolute inset-0 origin-left rounded-full bg-white/80" style={{ transform: 'scaleX(0)' }} />
        <div ref={knobRef} className="absolute inset-0">
          <span className="absolute left-0 top-1/2 grid h-[4.6cqh] w-[4.6cqh] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,.3)]">
            <span className="h-[1.6cqh] w-[1.6cqh] rounded-full bg-rec" />
          </span>
        </div>
      </div>
  );
}

/** Top-right status ring: fills once per loop of the feed. */
function StatusRing({ clock }: { clock: VideoClock }) {
  const ringRef = useRef<SVGCircleElement>(null);
  useEffect(
    () =>
      clock.onFrame((t, d) => {
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - Math.min(1, t / d));
      }),
    [clock],
  );
  return (
      <div className="hud-item absolute right-[4.2cqw] top-[6cqh] grid h-[15cqh] w-[15cqh] place-items-center" aria-hidden>
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="20" cy="20" r="17" fill="rgba(0,0,0,.28)" stroke="rgba(255,255,255,.18)" strokeWidth="4" />
          <circle ref={ringRef} cx="20" cy="20" r="17" fill="none" stroke="var(--live)" strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
        </svg>
        <span className="relative text-white" style={{ width: '42%', height: '42%' }}>
          <LogoMark size="100%" />
        </span>
      </div>
  );
}

type Props = { clock: VideoClock; live?: boolean; className?: string };

/**
 * Clean live view drawn inside the phone screen: one glass panel (room, time,
 * who's there, moments) and a status ring, after Apple's Fitness+ overlay.
 * Children marked `.hud-item` are faded in by the hero timeline.
 */
const CameraHUD = forwardRef<HTMLDivElement, Props>(function CameraHUD({ clock, live = true, className = '' }, ref) {
  return (
    <div ref={ref} className={`frame-rect hud pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {/* Detection box lives in a 16:9 box matching the video's cover crop */}
      <div className="detection-wrap absolute left-0 top-1/2 aspect-video w-full -translate-y-1/2">
        <DetectionBox clock={clock} animated={live} />
      </div>

      <span className="hud-item hud-island" />
      <StatusRing clock={clock} />

      <div className="hud-item hud-panel absolute left-[6.5cqw] top-[6cqh] w-[27cqw] px-[3.2cqh] py-[3.4cqh]">
        <div className="flex items-center gap-[1.6cqh] font-semibold text-rec" style={{ fontSize: 'max(9px, 4.6cqh)' }}>
          <span className="rec-dot inline-block h-[2.4cqh] w-[2.4cqh] min-h-[5px] min-w-[5px]" />
          LIVE
          <span className="ml-auto rounded-[1cqh] border border-white/40 px-[1.1cqh] text-white/85" style={{ fontSize: 'max(8px, 3cqh)' }}>
            HD
          </span>
        </div>
        <p className="display mt-[1.6cqh] truncate font-semibold leading-[1.05]" style={{ fontSize: 'max(12px, 8.6cqh)', fontStretch: '105%' }}>
          <SceneText clock={clock} pick={(i) => SCENES[i].cam} />
        </p>
        <p className="hud-extra mt-[0.6cqh] truncate text-white/70" style={{ fontSize: 'max(9px, 4.2cqh)' }}>
          <SceneText clock={clock} pick={(i) => SCENES[i].activity} />
        </p>
        <div className="hud-extra my-[2.6cqh] h-px bg-white/20" />
        <p className="tnum hud-extra font-medium leading-none" style={{ fontSize: 'max(11px, 9cqh)', letterSpacing: '-0.02em' }}>
          <Clock live={live} />
        </p>
        <p className="hud-extra mt-[2cqh] flex items-center gap-[1.4cqh]" style={{ fontSize: 'max(9px, 5cqh)' }}>
          <ScanFace size="1em" strokeWidth={2} className="text-live" />
          <SceneText clock={clock} pick={(i) => SCENES[i].label} />
          <span className="text-white/55" style={{ fontSize: '0.75em' }}>
            <SceneText clock={clock} pick={(i) => (SCENES[i].type === 'pet' ? 'pet' : 'family')} />
          </span>
        </p>
        <p className="hud-extra mt-[1.2cqh] flex items-center gap-[1.4cqh]" style={{ fontSize: 'max(9px, 5cqh)' }}>
          <Star size="1em" strokeWidth={2} className="fill-amber text-amber" />3
          <span className="text-amber" style={{ fontSize: '0.75em' }}>
            MOMENTS
          </span>
        </p>
        <LoopProgress clock={clock} />
      </div>
    </div>
  );
});

export default CameraHUD;
