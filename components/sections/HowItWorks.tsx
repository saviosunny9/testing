'use client';

import { Lock, Moon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { MeshBasicMaterial } from 'three';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { BRAND_NAME } from '@/lib/brand';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

const CHAPTERS = [
  { title: `Meet ${BRAND_NAME}.`, body: 'A small camera with one job: noticing the moments that matter at home.' },
  { title: 'Turns to see the whole room.', body: `Pan and tilt from your phone, or let ${BRAND_NAME} follow the action on its own.` },
  { title: 'Knows who’s who.', body: `Add your people and pets once. ${BRAND_NAME} recognises them on the camera, so alerts say “Mira’s home”, not “motion detected”.` },
  { title: 'Sees in the dark.', body: 'Infrared night vision keeps the nursery clear at 2 AM, with no light to wake anyone.' },
  { title: 'Looks away when you ask.', body: 'Privacy mode tips the lens down and stops recording. Recognition runs on the camera, never in the cloud.' },
];

const PEOPLE = [
  { label: 'Mira', kind: 'family', dot: 'bg-blue', pos: 'left-[8%] top-[24%] md:left-[44%] md:top-[18%]' },
  { label: 'Milo', kind: 'pet', dot: 'bg-coral', pos: 'right-[6%] top-[30%] md:right-[6%] md:top-[30%]' },
  { label: 'Parcel', kind: 'delivery', dot: 'bg-gold', pos: 'left-[12%] top-[50%] md:left-[48%] md:top-[56%]' },
];

/** Pinned, scroll-driven 3D story on a natural shelf scene. */
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panDotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const reduced = prefersReducedMotion();
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      const { createStage, shelfScene } = await import('@/lib/three/stage');
      if (disposed) return;

      const stage = createStage(canvas, { color: 'white', fov: 28 });
      const shelf = shelfScene();
      stage.scene.add(shelf);
      const moon = new THREE.DirectionalLight(0x8fb4ff, 0);
      moon.position.set(20, 20, 30);
      stage.scene.add(moon);

      // animated state, written by the scroll timeline and read every frame
      const s = { rot: -0.75, pan: 0, tilt: 0.08, night: 0, ir: 0, camZ: 104, camY: 17, lookY: 8.5, x: 0 };
      const isNarrow = () => window.innerWidth < 768;

      const apply = () => {
        const narrow = isNarrow();
        const shift = narrow ? 0 : 13;
        stage.product.group.position.x = shift;
        stage.product.group.rotation.y = s.rot;
        shelf.position.x = shift;
        stage.product.pan.rotation.y = s.pan;
        stage.product.tilt.rotation.x = -s.tilt;
        const k = narrow ? 1.45 : 1;
        stage.view.position.set(shift * 0.35, s.camY, s.camZ * k);
        stage.view.lookAt(shift * 0.35, narrow ? s.lookY - 4 : s.lookY, 0);
        stage.key.intensity = 2.3 * (1 - s.night * 0.88);
        stage.fill.intensity = 0.6 * (1 - s.night);
        stage.hemi.intensity = 0.35 * (1 - s.night * 0.8);
        stage.scene.environmentIntensity = 0.85 * (1 - s.night * 0.75);
        moon.intensity = s.night * 0.9;
        (stage.product.irRing.material as MeshBasicMaterial).opacity = s.ir * 0.4;
        section.style.setProperty('--night', String(s.night));
        // pan gauge dot: map -1..1 rad onto the arc
        if (panDotRef.current) {
          const a = Math.PI + ((s.pan + 1.1) / 2.2) * Math.PI;
          panDotRef.current.setAttribute('cx', String(60 + Math.cos(a) * 48));
          panDotRef.current.setAttribute('cy', String(60 + Math.sin(a) * 48));
        }
        stage.render();
      };

      const onResize = () => {
        stage.resize();
        apply();
      };
      window.addEventListener('resize', onResize);

      if (reduced) {
        s.rot = -0.35;
        s.camZ = 88;
        apply();
        cleanup = () => {
          window.removeEventListener('resize', onResize);
          stage.dispose();
        };
        return;
      }

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              const i = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length * 0.999));
              section.dataset.active = String(i);
            },
          },
        });
        tl.to(s, { rot: 0.18, camZ: 88, camY: 15, duration: 0.18 }, 0)
          .to(s, { pan: -1.0, duration: 0.07 }, 0.2)
          .to(s, { pan: 1.0, duration: 0.09 }, 0.27)
          .to(s, { pan: 0, rot: 0, duration: 0.05 }, 0.36)
          .to(s, { camZ: 74, camY: 13, lookY: 8.2, duration: 0.15 }, 0.42)
          .to(s, { night: 1, duration: 0.07 }, 0.6)
          .to(s, { ir: 1, duration: 0.04 }, 0.64)
          .to(s, { night: 0, ir: 0, duration: 0.05 }, 0.78)
          .to(s, { tilt: -0.85, camZ: 86, camY: 16, rot: -0.3, duration: 0.12 }, 0.83)
          .to({}, { duration: 0.05 });
        section.dataset.active = '0';
      }, section);

      // render only while the section is on screen
      let running = false;
      const tick = () => apply();
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) {
          gsap.ticker.add(tick);
          running = true;
        } else if (!e.isIntersecting && running) {
          gsap.ticker.remove(tick);
          running = false;
        }
      });
      io.observe(section);
      apply();
      ScrollTrigger.refresh();

      cleanup = () => {
        io.disconnect();
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', onResize);
        ctx.revert();
        stage.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <section id="how" ref={sectionRef} className="how relative motion-safe:h-[520vh]" data-active="0" aria-label="How it works">
      <div className="relative h-[100svh] overflow-hidden motion-safe:sticky motion-safe:top-0">
        {/* natural backdrop: warm wall with window light; fades to night */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_18%_12%,#fffaf2_0%,rgba(255,250,242,0)_60%),linear-gradient(180deg,#f3ebe0_0%,#ecdfcf_70%,#e3d3c0_100%)]" />
        <div
          className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_20%,#1b3a63_0%,rgba(11,29,51,0)_70%),linear-gradient(180deg,#0b1d33,#071426)]"
          style={{ opacity: 'var(--night, 0)' }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label={`3D model of the ${BRAND_NAME} camera`} role="img" />

        {/* chapter copy */}
        <div className="container-x pointer-events-none relative flex h-full items-end pb-[9vh] md:items-center md:pb-0">
          <div className="relative h-[200px] w-full max-w-[440px] md:h-[260px]">
            {CHAPTERS.map((c, i) => (
              <div key={c.title} className={`how-ch how-ch-${i} absolute inset-0 flex flex-col justify-end md:justify-center`}>
                <p className="eyebrow how-eyebrow">How it works · {String(i + 1).padStart(2, '0')}</p>
                <h2 className="display how-title mt-3 text-[clamp(2.1rem,4vw,3.6rem)]">{c.title}</h2>
                <p className="how-body mt-4 max-w-[38ch] text-[16px] leading-[1.45] md:text-[17px]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* chapter UI */}
        <div className="how-ui how-ui-1 pointer-events-none absolute right-[6%] top-[16%] flex flex-col items-center gap-2 md:right-[8%] md:top-[14%]">
          <svg viewBox="0 0 120 70" className="w-[120px]" aria-hidden>
            <path d="M12 60 A48 48 0 0 1 108 60" fill="none" stroke="rgba(11,53,88,.18)" strokeWidth="3" strokeLinecap="round" />
            <circle ref={panDotRef} cx="60" cy="12" r="6" fill="var(--blue)" stroke="#fff" strokeWidth="2.5" />
          </svg>
          <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-ink shadow-[0_8px_24px_-12px_rgba(11,53,88,.35)]">
            350° pan · 75° tilt
          </span>
        </div>

        {PEOPLE.map((p) => (
          <span
            key={p.label}
            className={`how-ui how-ui-2 pointer-events-none absolute ${p.pos} inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[14px] font-medium text-ink shadow-[0_12px_30px_-14px_rgba(11,53,88,.45)]`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${p.dot}`} />
            {p.label}
            <span className="font-normal text-muted">{p.kind}</span>
          </span>
        ))}

        <div className="how-ui how-ui-3 pointer-events-none absolute right-[6%] top-[12%] w-[180px] overflow-hidden rounded-[18px] bg-white/10 ring-1 ring-white/20 backdrop-blur-md md:right-[8%] md:w-[230px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/stills/storytime-night.jpg" alt="" className="aspect-video w-full object-cover" loading="lazy" />
          <p className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-white">
            <Moon size={13} strokeWidth={2} /> Bedroom · 2:04 AM
          </p>
        </div>

        <span className="how-ui how-ui-4 pointer-events-none absolute right-[8%] top-[18%] inline-flex items-center gap-2 rounded-full bg-green px-4 py-2 text-[14px] font-semibold text-white shadow-[0_12px_30px_-14px_rgba(17,163,127,.6)] md:right-[12%]">
          <Lock size={14} strokeWidth={2.2} /> Privacy mode on
        </span>

        {/* progress rail */}
        <ol className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 md:flex" aria-hidden>
          {CHAPTERS.map((c, i) => (
            <li key={c.title} className={`how-dot how-dot-${i} h-1.5 w-1.5 rounded-full`} />
          ))}
        </ol>
      </div>
    </section>
  );
}
