'use client';

import { BatteryMedium, Camera, Circle, Maximize, Mic, Wifi } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import DetectionBox from './DetectionBox';
import { SCENE_COLORS, SCENES } from './scenes';
import type { VideoClock } from './videoClock';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const pad = (n: number) => String(n).padStart(2, '0');

/** `EEE dd MMM yyyy · HH:mm:ss` in the viewer's local time. */
function formatStamp(d: Date) {
  return `${DAYS[d.getDay()]} ${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function Timestamp({ live }: { live: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (!live) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [live]);
  return (
    <span className="mono whitespace-nowrap text-[10px] sm:text-[12px]" suppressHydrationWarning>
      {now ? formatStamp(now) : ' '}
    </span>
  );
}

function CamLabel({ clock }: { clock: VideoClock }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let first = true;
    return clock.onScene((i) => {
      const text = SCENES[i].cam;
      if (first) {
        first = false;
        el.textContent = text;
        return;
      }
      gsap
        .timeline({ overwrite: true })
        .to(el, { opacity: 0, duration: 0.1 })
        .call(() => {
          el.textContent = text;
        })
        .to(el, { opacity: 1, duration: 0.1 });
    });
  }, [clock]);
  return (
    <span ref={ref} className="truncate">
      {SCENES[0].cam}
    </span>
  );
}

function ActivityTimeline({ clock, duration }: { clock: VideoClock; duration: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return clock.onFrame((t, d) => {
      const p = Math.min(1, Math.max(0, t / d));
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (headRef.current) headRef.current.style.transform = `translate3d(${p * 100}%, 0, 0)`;
    });
  }, [clock]);

  return (
    <div className="hud-item relative mt-3 h-[3px] w-full rounded-full bg-white/25">
      <div ref={fillRef} className="absolute inset-0 origin-left rounded-full bg-white/60" style={{ transform: 'scaleX(0)' }} />
      {SCENES.map((s) => (
        <span
          key={s.start}
          className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-black/20"
          style={{ left: `${(s.start / duration) * 100}%`, background: SCENE_COLORS[s.type] }}
        />
      ))}
      <div ref={headRef} className="absolute inset-0">
        <span className="absolute left-0 top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,.25)]" />
      </div>
    </div>
  );
}

type Props = {
  clock: VideoClock;
  live?: boolean;
  className?: string;
};

/**
 * Live-feed overlay drawn inside the final frame rectangle (§6).
 * Children marked `.hud-corner` / `.hud-item` are animated by the hero timeline.
 */
const CameraHUD = forwardRef<HTMLDivElement, Props>(function CameraHUD({ clock, live = true, className = '' }, ref) {
  const duration = SCENES[SCENES.length - 1].end;
  return (
    <div ref={ref} className={`frame-rect hud pointer-events-none overflow-hidden ${className}`}>
      <div className="hud-item absolute inset-0" aria-hidden>
        <div className="frame-grain absolute inset-0" />
      </div>
      <div className="hud-item frame-vignette absolute inset-0 rounded-[inherit]" aria-hidden />

      <div aria-hidden className="absolute inset-0">
        <DetectionBox clock={clock} animated={live} />
      </div>

      {/* Viewfinder corners */}
      <div className="absolute inset-3 sm:inset-[14px]" aria-hidden>
        <span className="hud-corner tl" />
        <span className="hud-corner tr" />
        <span className="hud-corner bl" />
        <span className="hud-corner br" />
      </div>

      <div className="absolute inset-3 flex flex-col px-2 pt-2 sm:inset-[18px] sm:px-3 sm:pt-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3" aria-hidden>
          <div className="hud-item hud-chip mono min-w-0">
            <span className="rec-dot shrink-0" />
            <span className="font-medium">REC</span>
            <span className="rounded-full bg-leaf px-1.5 py-[2px] text-[10px] font-medium leading-none text-ink [text-shadow:none]">
              LIVE
            </span>
            <span className="h-3.5 w-px shrink-0 bg-white/35" />
            <span className="min-w-0 normal-case tracking-[0.02em]">
              <CamLabel clock={clock} />
            </span>
          </div>
          <div className="hud-item hud-chip mono hidden md:inline-flex">
            <Wifi size={14} strokeWidth={1.5} />
            <span className="inline-flex items-center gap-1">
              <BatteryMedium size={16} strokeWidth={1.5} /> 82%
            </span>
            <span className="font-medium">HD</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-3">
          <div className="hud-item hud-chip" aria-hidden>
            <Timestamp live={live} />
          </div>
          <div className="pointer-events-auto flex gap-2">
            <button type="button" className="hud-item hud-btn hidden md:grid" aria-label="Talk back">
              <Mic size={17} strokeWidth={1.5} />
            </button>
            <button type="button" className="hud-item hud-btn" aria-label="Take snapshot">
              <Camera size={17} strokeWidth={1.5} />
            </button>
            <button type="button" className="hud-item hud-btn hidden md:grid" aria-label="Record clip">
              <Circle size={17} strokeWidth={1.5} />
            </button>
            <button type="button" className="hud-item hud-btn" aria-label="Full screen">
              <Maximize size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div aria-hidden>
          <ActivityTimeline clock={clock} duration={duration} />
        </div>
      </div>
    </div>
  );
});

export default CameraHUD;
