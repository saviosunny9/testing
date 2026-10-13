'use client';

import { Camera, Maximize2, Mic } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import DetectionBox from './DetectionBox';
import { SCENES } from './scenes';
import type { VideoClock } from './videoClock';

const pad = (n: number) => String(n).padStart(2, '0');

/** Live wall-clock time (HH:MM) in the viewer's timezone. */
function Clock({ live }: { live: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (!live) return;
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, [live]);
  return <span suppressHydrationWarning>{now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : '00:00'}</span>;
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

type Props = { clock: VideoClock; live?: boolean; className?: string };

/**
 * Minimal live view on the phone screen: a small LIVE + room pill, the time,
 * and three quiet controls. The video stays the hero.
 * Children marked `.hud-item` are faded in by the hero timeline.
 */
const CameraHUD = forwardRef<HTMLDivElement, Props>(function CameraHUD({ clock, live = true, className = '' }, ref) {
  const chip = 'rounded-full bg-black/35 text-white backdrop-blur-md';
  return (
    <div ref={ref} className={`frame-rect hud pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <div className="detection-wrap absolute left-0 top-1/2 aspect-video w-full -translate-y-1/2">
        <DetectionBox clock={clock} animated={live} />
      </div>

      <span className="hud-item hud-island" />

      <div
        className={`hud-item absolute left-[7cqw] top-[6cqh] inline-flex items-center gap-[0.5em] font-medium ${chip}`}
        style={{ fontSize: 'max(8px, 3.6cqh)', padding: '0.45em 0.9em 0.45em 0.75em', letterSpacing: '-0.01em' }}
      >
        <span className="rec-dot inline-block h-[0.55em] w-[0.55em]" />
        <span className="font-semibold">LIVE</span>
        <span className="text-white/50">·</span>
        <SceneText clock={clock} pick={(i) => SCENES[i].cam} />
      </div>

      <div
        className={`hud-item tnum absolute right-[4cqw] top-[6cqh] font-medium ${chip}`}
        style={{ fontSize: 'max(8px, 3.6cqh)', padding: '0.45em 0.85em' }}
      >
        <Clock live={live} />
      </div>

      <div className="hud-item absolute bottom-[6cqh] right-[4cqw] flex gap-[1.6cqh]">
        {[Mic, Camera, Maximize2].map((Icon, i) => (
          <span key={i} className={`grid place-items-center ${chip}`} style={{ width: 'max(18px, 9cqh)', height: 'max(18px, 9cqh)' }}>
            <Icon size="45%" strokeWidth={2} />
          </span>
        ))}
      </div>
    </div>
  );
});

export default CameraHUD;
