'use client';

import { type RefObject, useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { setHeroProgress } from '@/lib/headerTheme';
import { HEAD_DOTS, headFrame } from './HeroCamera';

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
 * that closes the full-bleed film into the Alaro camera's glass face.
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

      /** The camera's glass face (an ellipse), in the film frame's own coordinates (the frame is inset from the stage). */
      const face = () => {
        const s = stageEl.getBoundingClientRect();
        const f = targetEl.getBoundingClientRect();
        const ox = frameEl.offsetLeft;
        const oy = frameEl.offsetTop;
        return { x: f.left - s.left + f.width / 2 - ox, y: f.top - s.top + f.height / 2 - oy, rx: f.width / 2, ry: f.height / 2 };
      };

      /**
       * The aperture: one value k (0 → 1) drives both the ellipse the film is clipped to and the film's own
       * transform, so the film always covers whatever part of the ellipse is on screen (no letterboxing).
       */
      const ap = { k: 0 };
      let geo = { W: 0, H: 0, x: 0, y: 0, rx: 0, ry: 0, r0: 0, vl: 0, vt: 0, vw: 1, vh: 1 };
      const measure = () => {
        const f = face();
        const W = frameEl.clientWidth;
        const H = frameEl.clientHeight;
        geo = {
          W,
          H,
          ...f,
          r0: Math.hypot(Math.max(f.x, W - f.x), Math.max(f.y, H - f.y)) * 1.02,
          vl: videoEl.offsetLeft,
          vt: videoEl.offsetTop,
          vw: videoEl.offsetWidth || 1,
          vh: videoEl.offsetHeight || 1,
        };
      };
      const aperture = () => {
        const { k } = ap;
        const g = geo;
        const rx = g.r0 + (g.rx - g.r0) * k;
        const ry = g.r0 + (g.ry - g.r0) * k;
        frameEl.style.clipPath = `ellipse(${rx}px ${ry}px at ${g.x}px ${g.y}px)`;
        // the visible part of the ellipse: its box, cut to the stage
        const l = Math.max(0, g.x - rx), r = Math.min(g.W, g.x + rx);
        const t = Math.max(0, g.y - ry), b = Math.min(g.H, g.y + ry);
        const scale = Math.max((r - l) / g.vw, (b - t) / g.vh) * (1.06 - 0.06 * k);
        gsap.set(videoEl, {
          scale,
          x: (l + r) / 2 - (g.vl + g.vw / 2),
          y: (t + b) / 2 - (g.vt + g.vh / 2),
        });
      };
      measure();

      const media = q('.cam-media');
      const tiles = q('.moment-tile');
      /** Offset that pulls a tile toward the stage centre (it starts hidden under the big film). */
      const pull = (axis: 'x' | 'y') => (_i: number, el: HTMLElement) => {
        // offsets (not rects) so transforms already applied don't skew it; tiles sit inside a zone
        const zone = el.parentElement!;
        const c =
          axis === 'x'
            ? zone.offsetLeft + el.offsetLeft + el.offsetWidth / 2 - stageEl.clientWidth / 2
            : zone.offsetTop + el.offsetTop + el.offsetHeight / 2 - stageEl.clientHeight / 2;
        return -c * 0.42;
      };

      // The tiles' clips load on first play and only run while the tiles are showing.
      const clips = q('.moment-video') as HTMLVideoElement[];
      let clipsOn = false;
      const setClips = (on: boolean) => {
        if (on === clipsOn) return;
        clipsOn = on;
        clips.forEach((v) => {
          if (on) void v.play().catch(() => {});
          else v.pause();
        });
      };

      // Explicit start states: invalidateOnRefresh re-records staggered fromTo children,
      // so they must already be at their "from" values before the timeline exists.
      aperture();
      gsap.set(q('.hero-word'), { opacity: 0, yPercent: 12 });
      gsap.set(q('.hero-cam-img'), { scale: 1.25 });
      gsap.set(q('.hero-cam-dot'), { opacity: 0 });
      // the film dissolves into the glass from the face's centre
      const setOrigin = () => {
        const f = face();
        gsap.set(media, { transformOrigin: `${f.x}px ${f.y}px` });
      };
      setOrigin();
      gsap.set(tiles, { opacity: 0, scale: 1.18, x: pull('x'), y: pull('y') });
      gsap.set(q('.preview-item'), { opacity: 0, y: 20 });

      /**
       * Once the camera is revealed, scrolling on turns its head a little: right, back past centre to the left, and
       * home again, using the journey's rendered frames (same crop as the hero render; frame 9 is the hero's own view).
       * The status light follows the head.
       */
      const move = stageEl.querySelector<HTMLImageElement>('.hero-cam-move')!;
      const dot = stageEl.querySelector<HTMLElement>('.hero-cam-dot')!;
      const head = { t: 0 };
      let shownFrame = 9;
      const turnHead = () => {
        const f = Math.round(9 + 2 * Math.sin(head.t * Math.PI * 2));
        if (f === shownFrame) return;
        shownFrame = f;
        if (f === 9) {
          move.style.visibility = 'hidden';
        } else {
          move.src = headFrame(f);
          move.style.visibility = 'visible';
        }
        const [x, y] = HEAD_DOTS[f];
        dot.style.left = `${x * 100}%`;
        dot.style.top = `${y * 100}%`;
      };
      [7, 8, 10, 11].forEach((f) => {
        const pre = new Image();
        pre.src = headFrame(f);
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: trackEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setHeroProgress(self.progress);
            setClips(self.progress > 0.12);
          },
          onToggle: (self) => {
            setClips(self.progress > 0.12);
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
        // The film closes like an aperture into the camera's glass face, while the camera settles back...
        .fromTo(ap, { k: 0 }, { k: 1, duration: 0.46, ease: 'power3.inOut', onUpdate: aperture }, 0.06)
        .fromTo(q('.hero-cam-img'), { scale: 1.25 }, { scale: 1, duration: 0.46, ease: 'power3.inOut' }, 0.06)
        // ...uncovering the moments around it, which settle into place as it lands.
        .fromTo(
          tiles,
          { opacity: 0, scale: 1.18, x: pull('x'), y: pull('y') },
          { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.34, ease: 'power3.out', stagger: 0.025 },
          0.16,
        )
        .fromTo(q('.hero-word'), { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 0.36, ease: 'power3.out' }, 0.2)
        // As the film lands in the glass face it fades away, leaving the lens.
        .fromTo(media, { scale: 1 }, { scale: 0.92, duration: 0.08, ease: 'power1.in' }, 0.48)
        .fromTo(frameEl, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.48)
        // the white margin gives way to the stage's ground once the film has closed
        .fromTo(q('.hero-canvas'), { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.inOut' }, 0.46)
        .fromTo(q('.hero-cam-dot'), { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'power1.out' }, 0.56)
        .fromTo(q('.preview-item'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.14, ease: 'power2.out' }, 0.52)
        // scrolling on: a small look around before the next section
        .fromTo(head, { t: 0 }, { t: 1, duration: 0.34, ease: 'sine.inOut', onUpdate: turnHead }, 0.62)
        .to({}, { duration: 0.04 });

      stageEl.classList.add('is-armed');
      setHeroProgress(tl.scrollTrigger?.progress ?? 0);

      // Pause the video while the hero is out of view.
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          void videoEl.play().catch(() => {});
          setClips((tl.scrollTrigger?.progress ?? 0) > 0.12);
        } else {
          videoEl.pause();
          setClips(false);
        }
      });
      io.observe(trackEl);

      const onRefresh = () => {
        measure();
        aperture();
        setOrigin();
      };
      ScrollTrigger.addEventListener('refresh', onRefresh);
      const refresh = () => ScrollTrigger.refresh();
      videoEl.addEventListener('loadedmetadata', refresh);
      void document.fonts?.ready.then(refresh);

      return () => {
        io.disconnect();
        ScrollTrigger.removeEventListener('refresh', onRefresh);
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
