'use client';

import { Camera, Mic, Video } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
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
 * Minimal live view on the portrait phone screen: the Dynamic Island, a LIVE + room
 * pill, the time, and the three controls the app has (talk, snapshot, record).
 * Children marked `.hud-item` are faded in by the hero timeline.
 */
const CameraHUD = forwardRef<HTMLDivElement, Props>(function CameraHUD({ clock, live = true, className = '' }, ref) {
  const chip = 'rounded-full bg-black/35 text-white backdrop-blur-md';
  const size = { fontSize: 'max(8px, 2.05cqh)' };
  return (
    <div ref={ref} className={`frame-rect hud pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <span className="hud-item hud-island" />

      <div className="hud-item absolute inset-x-[5cqw] top-[7.6cqh] flex items-center justify-between gap-2">
        <span className={`inline-flex min-w-0 items-center gap-[0.45em] font-medium ${chip}`} style={{ ...size, padding: '0.5em 0.9em 0.5em 0.75em' }}>
          <span className="rec-dot inline-block h-[0.55em] w-[0.55em] shrink-0" />
          <span className="font-semibold">LIVE</span>
          <span className="truncate text-white/70">
            <SceneText clock={clock} pick={(i) => SCENES[i].cam} />
          </span>
        </span>
        <span className={`tnum shrink-0 font-medium ${chip}`} style={{ ...size, padding: '0.5em 0.85em' }}>
          <Clock live={live} />
        </span>
      </div>

      <div className="hud-item absolute inset-x-0 bottom-[3.6cqh] flex justify-center gap-[5cqw]">
        {[
          { Icon: Mic, label: 'Talk' },
          { Icon: Camera, label: 'Snapshot' },
          { Icon: Video, label: 'Record' },
        ].map(({ Icon, label }) => (
          <span key={label} className={`grid place-items-center ${chip}`} style={{ width: 'max(22px, 5.6cqh)', height: 'max(22px, 5.6cqh)' }} title={label}>
            <Icon size="44%" strokeWidth={2} />
          </span>
        ))}
      </div>
    </div>
  );
});

export default CameraHUD;
