'use client';

import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { MOMENT_SAVED_SCENE, SCENES } from './scenes';
import type { VideoClock } from './videoClock';

const RADIUS = 12;
const DRIFT = 0.6; // ± percent of the frame

function cornerPaths(x: number, y: number, w: number, h: number) {
  const r = Math.min(RADIUS, w / 4, h / 4);
  const a = Math.max(6, Math.min(26, w * 0.22, h * 0.22));
  const R = x + w;
  const B = y + h;
  return [
    `M${x} ${y + r + a}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}H${x + r + a}`,
    `M${R - r - a} ${y}H${R - r}A${r} ${r} 0 0 1 ${R} ${y + r}V${y + r + a}`,
    `M${R} ${B - r - a}V${B - r}A${r} ${r} 0 0 1 ${R - r} ${B}H${R - r - a}`,
    `M${x + r + a} ${B}H${x + r}A${r} ${r} 0 0 1 ${x} ${B - r}V${B - r - a}`,
  ];
}

type Props = {
  clock: VideoClock;
  /** false = no drift / no tweening (reduced motion). */
  animated?: boolean;
};

/**
 * AI bounding box that follows the subject of each scene (§6.3).
 * Coordinates are percentages of the frame; drawing happens in pixels in an
 * SVG so the 2px stroke and 14px radius stay crisp at any size.
 */
export default function DetectionBox({ clock, animated = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<SVGRectElement>(null);
  const cornerRefs = useRef<(SVGPathElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const momentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const label = labelRef.current!;
    const labelText = labelTextRef.current!;
    const moment = momentRef.current!;
    const box = { ...SCENES[clock.scene].box };
    let size = { w: root.clientWidth, h: root.clientHeight };
    const start = performance.now();

    const render = () => {
      const t = animated ? (performance.now() - start) / 1000 : 0;
      const dx = animated ? Math.sin((t * Math.PI * 2) / 4.2) * DRIFT : 0;
      const dy = animated ? Math.cos((t * Math.PI * 2) / 5.4) * DRIFT : 0;
      // The 16:9 box can be taller than the screen it sits in (cover crop); keep the
      // drawing inside the visible band.
      const screenH = root.closest('.hud')?.clientHeight ?? size.h;
      const visTop = Math.max(0, (size.h - screenH) / 2) + 10;
      const visBottom = size.h - Math.max(0, (size.h - screenH) / 2) - 10;
      const x = ((box.x + dx) / 100) * size.w;
      const rawY = ((box.y + dy) / 100) * size.h;
      const y = Math.max(rawY, visTop);
      const w = (box.w / 100) * size.w;
      const h = Math.min(rawY + (box.h / 100) * size.h, visBottom) - y;

      const glow = glowRef.current!;
      glow.setAttribute('x', `${x}`);
      glow.setAttribute('y', `${y}`);
      glow.setAttribute('width', `${w}`);
      glow.setAttribute('height', `${h}`);
      cornerPaths(x, y, w, h).forEach((d, i) => cornerRefs.current[i]?.setAttribute('d', d));

      const chipH = label.offsetHeight;
      // Keep both chips inside the frame, even when the box hugs an edge.
      const lx = Math.min(x + 12, size.w - label.offsetWidth - 8);
      const ly = Math.min(y + h - chipH / 2, visBottom - chipH);
      const mx = Math.max(8, Math.min(x + w - moment.offsetWidth - 12, size.w - moment.offsetWidth - 8));
      label.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      moment.style.transform = `translate3d(${mx}px, ${y + 10}px, 0)`;
    };

    const ro = new ResizeObserver(() => {
      size = { w: root.clientWidth, h: root.clientHeight };
      render();
    });
    ro.observe(root);

    let first = true;
    const offScene = clock.onScene((i) => {
      const scene = SCENES[i];
      const showMoment = i === MOMENT_SAVED_SCENE;
      if (first || !animated) {
        first = false;
        Object.assign(box, scene.box);
        labelText.textContent = scene.label;
        gsap.set(moment, { autoAlpha: showMoment ? 1 : 0, x: 0 });
        render();
        return;
      }
      gsap.to(box, { ...scene.box, duration: 0.45, ease: 'power2.inOut', overwrite: true });
      gsap
        .timeline({ overwrite: true })
        .to(labelText, { opacity: 0, duration: 0.12 })
        .call(() => {
          labelText.textContent = scene.label;
        })
        .to(labelText, { opacity: 1, duration: 0.2 });
      if (showMoment) {
        gsap.fromTo(moment, { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.5, delay: 0.45, ease: 'expo.out' });
      } else {
        gsap.to(moment, { autoAlpha: 0, duration: 0.2 });
      }
    });

    if (animated) gsap.ticker.add(render);
    render();

    return () => {
      offScene();
      ro.disconnect();
      gsap.ticker.remove(render);
      gsap.killTweensOf([box, labelText, moment]);
    };
  }, [clock, animated]);

  return (
    <div ref={rootRef} className="detection pointer-events-none absolute inset-0" aria-hidden>
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <rect ref={glowRef} rx={RADIUS} fill="rgba(255,255,255,0.04)" stroke="none" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            ref={(el) => {
              cornerRefs.current[i] = el;
            }}
            className="det-corner"
            pathLength={1}
            fill="none"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="1 1"
            strokeDashoffset={0}
          />
        ))}
      </svg>
      <div ref={labelRef} className="det-label absolute left-0 top-0 will-change-transform">
        <span
          className="inline-flex items-center rounded-full bg-white/90 font-medium text-ink shadow-[0_4px_14px_rgba(0,0,0,.18)]"
          style={{ fontSize: 'max(9px, 3.6cqh)', padding: '0.35em 0.8em' }}
        >
          <span ref={labelTextRef}>{SCENES[0].label}</span>
        </span>
      </div>
      <div ref={momentRef} className="absolute left-0 top-0 opacity-0">
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-black/45 font-medium text-white backdrop-blur-md"
          style={{ fontSize: 'max(9px, 3.6cqh)', padding: '0.4em 0.85em' }}
        >
          <Star size="1.1em" strokeWidth={1.5} className="fill-amber text-amber" /> Moment saved
        </span>
      </div>
    </div>
  );
}
