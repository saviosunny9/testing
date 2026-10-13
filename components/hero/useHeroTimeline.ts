'use client';

import { type RefObject, useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { setHeroProgress } from '@/lib/headerTheme';
import { lockScroll, unlockScroll } from '@/lib/lenis';

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
      gsap.set(frameEl, { clipPath: 'inset(0px 0px 0px 0px round 0px)' });
      // Explicit start states: invalidateOnRefresh re-records staggered fromTo children,
      // so they must already be at their "from" values before the timeline exists.
      gsap.set(videoEl, { scale: 1.08, x: 0, y: 0 });
      gsap.set(media, { filter: 'grayscale(1)' });
      gsap.set(q('.phone-body'), { opacity: 0 });
      gsap.set(q('.detection'), { opacity: 0 });
      gsap.set(q('.hud-item'), { opacity: 0, y: 8 });
      gsap.set(q('.det-corner'), { strokeDashoffset: 1 });
      gsap.set(q('.det-label > span'), { opacity: 0, y: 8 });
      gsap.set(q('.preview-item'), { opacity: 0, y: 24 });

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
          duration: 0.2,
          immediateRender: false,
          // A filter on an ancestor disables the glass button's backdrop-filter, so drop it at rest.
          onReverseComplete: () => gsap.set(q('.hero-copy'), { clearProps: 'filter' }),
        },
        0,
      )
        .to(q('.hero-gradient'), { opacity: 0, duration: 0.2 }, 0)
        // Black and white film slowly takes on colour as it becomes the live feed.
        .fromTo(media, { filter: 'grayscale(1)' }, { filter: 'grayscale(0)', duration: 0.44, ease: 'power1.inOut' }, 0.08)
        .to(frameEl, { clipPath: clipTarget, duration: 0.46, ease: 'power2.inOut' }, 0.08)
        .fromTo(
          videoEl,
          { scale: 1.08, x: 0, y: 0 },
          { scale: () => fit().scale, x: () => fit().x, y: () => fit().y, duration: 0.46, ease: 'power2.inOut' },
          0.08,
        )
        .fromTo(q('.phone-body'), { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.42)
        .fromTo(q('.hud-item'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.1, ease: 'power2.out' }, 0.52)
        .fromTo(q('.detection'), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.6)
        .fromTo(q('.det-corner'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.08 }, 0.6)
        .fromTo(q('.det-label > span'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.06 }, 0.64)
        .fromTo(q('.preview-item'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.15, ease: 'power2.out' }, 0.6)
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
 * Load-in sequence copied from Sequel (§4.3). Runs once fonts are ready and the
 * video is playing (each capped so a stalled network never blocks the page).
 */
export function useHeroIntro({ stage, camVideo }: Pick<HeroRefs, 'stage' | 'camVideo'>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const stageEl = stage.current!;
    const videoEl = camVideo.current!;
    const root = document.documentElement;
    let cancelled = false;
    let split: SplitText | null = null;
    let unlockTimer = 0;
    let locked = false;

    const unlock = () => {
      if (!locked) return;
      locked = false;
      window.clearTimeout(unlockTimer);
      unlockScroll();
    };

    if (window.scrollY < 10) {
      locked = true;
      lockScroll();
      unlockTimer = window.setTimeout(unlock, 2500);
    }

    const ctx = gsap.context(() => {});

    const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(3000)]);
    const videoPlaying = new Promise<void>((resolve) => {
      if (!videoEl.paused && videoEl.readyState >= 3) return resolve();
      videoEl.addEventListener('playing', () => resolve(), { once: true });
      // Autoplay can be blocked (low-power mode); start anyway over the poster.
      wait(2500).then(resolve);
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
            { opacity: 1, filter: 'blur(0px)', stagger: 0.02, duration: 0.9, ease: 'power2.out', onComplete: unlock },
            0.15,
          )
          .addLabel('charsEnd')
          .to(header ?? {}, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.inOut', clearProps: 'transform' }, 'charsEnd-=0.5')
          .to(reveal, { opacity: 1, y: 0, duration: 1.0, stagger: 0.08, ease: 'power2.inOut', clearProps: 'transform' }, '<');
      });
    });

    return () => {
      cancelled = true;
      unlock();
      ctx.revert();
      split?.revert();
      root.classList.remove('intro-pending');
    };
  }, [enabled, stage, camVideo]);
}
