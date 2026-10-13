'use client';

import { type RefObject, useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { setHeroProgress } from '@/lib/headerTheme';

export type HeroRefs = {
  track: RefObject<HTMLElement | null>;
  stage: RefObject<HTMLDivElement | null>;
  frameTarget: RefObject<HTMLDivElement | null>;
  camFrame: RefObject<HTMLDivElement | null>;
  camVideo: RefObject<HTMLVideoElement | null>;
};


const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * The scroll interaction (§5): one ScrollTrigger scrubbing a master timeline
 * that turns the full-bleed film into the framed live camera preview.
 */
export function useHeroTimeline({ track, stage, frameTarget, camFrame, camVideo }: HeroRefs, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const trackEl = track.current!;
    const stageEl = stage.current!;
    const targetEl = frameTarget.current!;
    const frameEl = camFrame.current!;
    const videoEl = camVideo.current!;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stageEl);

      /** The final rect as an inset() relative to the stage. */
      const clipTarget = () => {
        const s = stageEl.getBoundingClientRect();
        const f = targetEl.getBoundingClientRect();
        const r = parseFloat(getComputedStyle(targetEl).borderTopLeftRadius) || 28;
        return `inset(${f.top - s.top}px ${s.right - f.right}px ${s.bottom - f.bottom}px ${f.left - s.left}px round ${r}px)`;
      };

      /** Transform that makes the (16:9, cover-sized) video cover the phone screen exactly. */
      const fit = () => {
        const s = stageEl.getBoundingClientRect();
        const f = targetEl.getBoundingClientRect();
        const w = videoEl.offsetWidth;
        const h = videoEl.offsetHeight;
        return {
          scale: Math.max(f.width / w, f.height / h),
          x: f.left - s.left + f.width / 2 - (videoEl.offsetLeft + w / 2),
          y: f.top - s.top + f.height / 2 - (videoEl.offsetTop + h / 2),
        };
      };

      const media = q('.cam-media');
      const tiles = q('.moment-tile');
      /** Offset that pulls a tile toward the stage centre (it starts hidden under the big film). */
      const pull = (axis: 'x' | 'y') => (_i: number, el: HTMLElement) => {
        const c = axis === 'x' ? el.offsetLeft + el.offsetWidth / 2 - stageEl.clientWidth / 2 : el.offsetTop + el.offsetHeight / 2 - stageEl.clientHeight / 2;
        return -c * 0.42;
      };

      gsap.set(frameEl, { clipPath: 'inset(0px 0px 0px 0px round 0px)' });
      // Explicit start states: invalidateOnRefresh re-records staggered fromTo children,
      // so they must already be at their "from" values before the timeline exists.
      gsap.set(videoEl, { scale: 1.06, x: 0, y: 0 });
      gsap.set(media, { filter: 'grayscale(1) contrast(1.12) brightness(0.9)' });
      gsap.set(q('.film-grain'), { opacity: 0.55 });
      gsap.set(q('.phone-body'), { opacity: 0 });
      gsap.set(tiles, { opacity: 0, scale: 1.18, x: pull('x'), y: pull('y') });
      gsap.set(q('.hud-item'), { opacity: 0, y: 6 });
      gsap.set(q('.preview-item'), { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: trackEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setHeroProgress(self.progress),
          onToggle: (self) => {
            frameEl.style.willChange = self.isActive ? 'clip-path' : '';
            videoEl.style.willChange = self.isActive ? 'transform' : '';
          },
        },
      });

      tl.fromTo(
        q('.hero-copy'),
        { opacity: 1, y: 0, filter: 'blur(0px)' },
        {
          opacity: 0,
          y: () => -0.05 * window.innerHeight,
          filter: 'blur(6px)',
          duration: 0.18,
          immediateRender: false,
          // A filter on an ancestor disables the glass button's backdrop-filter, so drop it at rest.
          onReverseComplete: () => gsap.set(q('.hero-copy'), { clearProps: 'filter' }),
        },
        0,
      )
        .to(q('.hero-gradient'), { opacity: 0, duration: 0.18 }, 0)
        // Grainy black-and-white film clears up and takes on colour early in the scroll.
        .fromTo(
          media,
          { filter: 'grayscale(1) contrast(1.12) brightness(0.9)' },
          { filter: 'grayscale(0) contrast(1) brightness(1)', duration: 0.2, ease: 'power2.out' },
          0.03,
        )
        .fromTo(q('.film-grain'), { opacity: 0.55 }, { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0.03)
        // The film shrinks into the phone screen...
        .to(frameEl, { clipPath: clipTarget, duration: 0.46, ease: 'power2.inOut' }, 0.06)
        .fromTo(
          videoEl,
          { scale: 1.06, x: 0, y: 0 },
          { scale: () => fit().scale, x: () => fit().x, y: () => fit().y, duration: 0.46, ease: 'power2.inOut' },
          0.06,
        )
        // ...uncovering the moments around it, which settle into place as it lands.
        .fromTo(
          tiles,
          { opacity: 0, scale: 1.18, x: pull('x'), y: pull('y') },
          { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.34, ease: 'power3.out', stagger: 0.025 },
          0.16,
        )
        .fromTo(q('.phone-body'), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.44)
        .fromTo(q('.hud-item'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.08, ease: 'power2.out' }, 0.5)
        .fromTo(q('.preview-item'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.14, ease: 'power2.out' }, 0.56)
        .to({}, { duration: 0.2 });

      stageEl.classList.add('is-armed');
      setHeroProgress(tl.scrollTrigger?.progress ?? 0);

      // Pause the video while the hero is out of view.
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) void videoEl.play().catch(() => {});
        else videoEl.pause();
      });
      io.observe(trackEl);

      const refresh = () => ScrollTrigger.refresh();
      videoEl.addEventListener('loadedmetadata', refresh);
      void document.fonts?.ready.then(refresh);

      return () => {
        io.disconnect();
        videoEl.removeEventListener('loadedmetadata', refresh);
      };
    }, stageEl);

    return () => {
      ctx.revert();
      stageEl.classList.remove('is-armed');
      setHeroProgress(null);
    };
  }, [enabled, track, stage, frameTarget, camFrame, camVideo]);
}

/**
 * Load-in sequence. Runs once fonts are ready and the video is playing (each capped so a
 * stalled network never holds the page), and never locks scrolling.
 */
export function useHeroIntro({ stage, camVideo }: Pick<HeroRefs, 'stage' | 'camVideo'>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const stageEl = stage.current!;
    const videoEl = camVideo.current!;
    const root = document.documentElement;
    let cancelled = false;
    let split: SplitText | null = null;

    // The page stays scrollable during the intro; it only plays when we're at the very top.
    if (window.scrollY > 10) {
      root.classList.remove('intro-pending');
      return;
    }

    const ctx = gsap.context(() => {});

    const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(1500)]);
    const videoPlaying = new Promise<void>((resolve) => {
      if (!videoEl.paused && videoEl.readyState >= 3) return resolve();
      videoEl.addEventListener('playing', () => resolve(), { once: true });
      // Autoplay can be blocked (low-power mode); start anyway over the poster.
      wait(1200).then(resolve);
    });

    Promise.all([fontsReady, videoPlaying]).then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const h1 = stageEl.querySelector<HTMLElement>('.hero-h1')!;
        const header = document.querySelector<HTMLElement>('.site-header .header-bar');
        const reveal = stageEl.querySelectorAll('.hero-reveal');

        split = SplitText.create(h1, { type: 'words,chars', charsClass: 'split-char' });

        gsap.set(videoEl, { opacity: 0 });
        gsap.set(split.chars, { opacity: 0, filter: 'blur(8px)' });
        if (header) gsap.set(header, { opacity: 0, y: -0.16 * window.innerHeight });
        gsap.set(reveal, { opacity: 0, y: 0.08 * window.innerHeight });
        root.classList.remove('intro-pending');

        gsap
          .timeline()
          .to(videoEl, { opacity: 1, duration: 1.2, ease: 'power1.out' }, 0)
          .to(
            split.chars,
            { opacity: 1, filter: 'blur(0px)', stagger: 0.02, duration: 0.9, ease: 'power2.out' },
            0.15,
          )
          .addLabel('charsEnd')
          .to(header ?? {}, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.inOut', clearProps: 'transform' }, 'charsEnd-=0.5')
          .to(reveal, { opacity: 1, y: 0, duration: 1.0, stagger: 0.08, ease: 'power2.inOut', clearProps: 'transform' }, '<');
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
      split?.revert();
      root.classList.remove('intro-pending');
    };
  }, [enabled, stage, camVideo]);
}
