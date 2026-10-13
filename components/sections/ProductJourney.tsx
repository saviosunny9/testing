'use client';

import { Cpu, KeyRound, Lock } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { BRAND_NAME } from '@/lib/brand';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

/** Product pose at a point in the journey. sx is the model's horizontal position as a fraction of the viewport. */
type Pose = { sx: number; rot: number; pan: number; tilt: number; scale: number };

const POSES: Record<'design' | 'see' | 'private', Pose> = {
  design: { sx: 0.7, rot: -0.55, pan: 0, tilt: 0.06, scale: 1 },
  see: { sx: 0.3, rot: -0.1, pan: 0, tilt: 0.04, scale: 1 },
  private: { sx: 0.7, rot: -0.35, pan: 0, tilt: -0.8, scale: 1 },
};

function Still({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={1355} height={1258} loading="lazy" className="journey-still mx-auto mt-12 hidden h-auto w-[78%] max-w-[420px] translate-x-[20%] max-md:block" />
  );
}

/**
 * One sticky WebGL canvas behind three sections. The camera moves from section to section
 * (right → left → right) and acts out each idea: its form, its pan/tilt, and privacy mode.
 * Copy always sits on the opposite half from the product.
 */
export default function ProductJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const canvas = canvasRef.current!;
    const narrow = window.matchMedia('(max-width: 767px)');
    if (prefersReducedMotion() || narrow.matches) {
      root.dataset.fallback = 'true';
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      let THREE: typeof import('three');
      let mod: typeof import('@/lib/three/stage');
      try {
        THREE = await import('three');
        mod = await import('@/lib/three/stage');
      } catch {
        root.dataset.fallback = 'true';
        return;
      }
      if (disposed) return;

      let stage: ReturnType<typeof mod.createStage>;
      try {
        stage = mod.createStage(canvas, { color: 'white', fov: 24 });
      } catch {
        // no WebGL: show the still renders instead
        root.dataset.fallback = 'true';
        return;
      }
      stage.scene.add(mod.contactShadow(8.5, 0.38));
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.14 }));
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      stage.scene.add(ground);
      stage.key.position.set(-18, 34, 22);

      const DIST = 66;
      const s = { ...POSES.design };
      const apply = () => {
        const v = stage.view;
        // world x that puts the model's centre at s.sx of the viewport width
        const halfW = Math.tan(THREE.MathUtils.degToRad(v.fov / 2)) * DIST * v.aspect;
        const x = (s.sx - 0.5) * 2 * halfW;
        stage.product.group.position.x = x;
        stage.product.group.rotation.y = s.rot;
        stage.product.group.scale.setScalar(s.scale);
        stage.product.pan.rotation.y = s.pan;
        stage.product.tilt.rotation.x = -s.tilt;
        ground.position.x = x;
        v.position.set(0, 12, DIST);
        v.lookAt(0, 7.4, 0);
        stage.render();
      };

      const ctx = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
          })
          // Each section is 200svh with sticky copy, so the journey splits into five equal
          // beats: hold (A), travel, hold (B), travel, hold (C). The camera only moves sideways
          // while one block of copy has left and the next is arriving, and dips in scale so it
          // clears both.
          .to(s, { rot: 0.32, duration: 0.2 }, 0)
          .to(s, { sx: POSES.see.sx, rot: POSES.see.rot, duration: 0.2 }, 0.2)
          .to(s, { scale: 0.8, duration: 0.1, ease: 'power1.out' }, 0.2)
          .to(s, { scale: 1, duration: 0.1, ease: 'power1.in' }, 0.3)
          .to(s, { pan: -0.95, duration: 0.07 }, 0.4)
          .to(s, { pan: 0.95, duration: 0.09 }, 0.47)
          .to(s, { pan: 0, duration: 0.04 }, 0.56)
          .to(s, { sx: POSES.private.sx, rot: POSES.private.rot, duration: 0.2 }, 0.6)
          .to(s, { scale: 0.8, duration: 0.1, ease: 'power1.out' }, 0.6)
          .to(s, { scale: 1, duration: 0.1, ease: 'power1.in' }, 0.7)
          .to(s, { tilt: POSES.private.tilt, duration: 0.12 }, 0.84);
      }, root);

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
      io.observe(root);
      const onResize = () => {
        stage.resize();
        apply();
      };
      window.addEventListener('resize', onResize);
      apply();
      ScrollTrigger.refresh();

      cleanup = () => {
        io.disconnect();
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', onResize);
        ctx.revert();
        stage.dispose();
      };
    };

    // Load three.js shortly before the journey scrolls into view.
    const preload = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        preload.disconnect();
        void start();
      },
      { rootMargin: '120% 0px' },
    );
    preload.observe(root);

    return () => {
      disposed = true;
      preload.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div ref={rootRef} className="journey relative" data-fallback="false">
      <div className="journey-stage max-md:hidden" aria-hidden>
        <div className="journey-sticky">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </div>

      {/* 1 */}
      <section id="design" className="journey-section relative bg-paper">
        <div className="journey-copy container-x relative z-10 grid md:grid-cols-12">
          <div className="md:col-span-5">
            <p data-reveal className="eyebrow">
              Design
            </p>
            <h2 data-reveal className="display h-section mt-4">
              Designed to disappear <span className="hl">into your home.</span>
            </h2>
            <p data-reveal className="lede mt-6 max-w-[34ch]">
              A soft-touch shell in three quiet finishes, small enough for any shelf. No blinking lights, nothing that looks like a
              security camera.
            </p>
            <dl data-reveal className="mt-10 grid max-w-[420px] grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ['14 cm', 'tall'],
                ['7.4 cm', 'base'],
                ['3', 'finishes'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="h-small tnum">{v}</dt>
                  <dd className="mt-1 text-[13px] text-muted">{l}</dd>
                </div>
              ))}
            </dl>
            <Still src="/media/product/front-white.webp" alt={`${BRAND_NAME} camera in Chalk White`} />
          </div>
        </div>
      </section>

      {/* 2 */}
      <section id="see" className="journey-section relative bg-white">
        <div className="journey-copy container-x relative z-10 grid md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-8">
            <p data-reveal className="eyebrow">
              Pan and tilt
            </p>
            <h2 data-reveal className="display h-section mt-4">
              Turns to see <span className="hl">the whole room.</span>
            </h2>
            <p data-reveal className="lede mt-6 max-w-[34ch]">
              Look around from your phone, or let {BRAND_NAME} quietly follow the action on its own. One camera covers what used to
              take three.
            </p>
            <ul data-reveal className="mt-10 max-w-[420px] divide-y divide-line border-y border-line">
              {[
                ['350°', 'pan, edge to edge'],
                ['75°', 'tilt, floor to ceiling'],
                ['2K HDR', 'sharp in bright windows and dim corners'],
              ].map(([v, l]) => (
                <li key={v} className="flex items-baseline gap-4 py-3.5">
                  <span className="h-small tnum w-[5.5rem] shrink-0">{v}</span>
                  <span className="text-[15px] text-muted">{l}</span>
                </li>
              ))}
            </ul>
            <Still src="/media/product/pan-right-white.webp" alt={`${BRAND_NAME} camera turning its head`} />
          </div>
        </div>
      </section>

      {/* 3 */}
      <section id="private" data-header-theme="dark" className="journey-section on-dark relative bg-forest text-white">
        <div className="journey-copy container-x relative z-10 grid md:grid-cols-12">
          <div className="md:col-span-5">
            <p data-reveal className="eyebrow">
              Privacy
            </p>
            <h2 data-reveal className="display h-section mt-4">
              Private <span className="hl">by design.</span>
            </h2>
            <p data-reveal className="lede mt-6 max-w-[34ch]">
              Turn on privacy mode and the lens tips down and stops recording. What it learns about your home stays in your home.
            </p>
            <ul data-reveal className="mt-10 grid max-w-[440px] gap-5">
              {[
                { icon: Cpu, t: 'Recognition on the camera', d: 'Faces and pets are recognised on the device, not in the cloud.' },
                { icon: KeyRound, t: 'End-to-end encrypted', d: 'Only your family’s phones hold the keys.' },
                { icon: Lock, t: 'Privacy mode', d: 'One tap, and it looks away.' },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="h-small">{t}</p>
                    <p className="mt-1 text-[15px] text-white/65">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Still src="/media/product/pan-left-white.webp" alt={`${BRAND_NAME} camera with its head turned`} />
          </div>
        </div>
      </section>
    </div>
  );
}
