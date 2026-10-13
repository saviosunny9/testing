'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { refreshHeaderTheme } from '@/lib/headerTheme';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

/**
 * Page-wide scroll behaviour below the hero:
 * - The fixed header's text colour follows whatever sits under it (see lib/headerTheme).
 * - Past the hero, the header gets a frosted bar.
 * - `[data-reveal]` elements fade up once as they enter.
 * - `[data-parallax="n"]` elements drift n% of their height while in view.
 */
export default function PageEffects() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = document.querySelector<HTMLElement>('.site-header');
      const hero = document.getElementById('hero-wrap');
      if (header && hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'bottom 80px',
          onEnter: () => {
            header.dataset.solid = 'true';
          },
          onLeaveBack: () => {
            header.dataset.solid = 'false';
          },
        });
      }

      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: refreshHeaderTheme });
      ScrollTrigger.addEventListener('refresh', refreshHeaderTheme);
      refreshHeaderTheme();

      if (prefersReducedMotion()) return;

      // Elements inside a hidden tab panel are skipped: they have no position to trigger on.
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => !el.closest('[hidden]'));
      gsap.set(items, { opacity: 0, y: 28 });
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || '0');
        if (!amount) return;
        gsap.fromTo(
          el,
          { yPercent: amount },
          { yPercent: -amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    });
    // Lazy images can still nudge layout; re-measure (debounced) whenever one finishes loading.
    let t = 0;
    const onImg = (e: Event) => {
      if (!(e.target instanceof HTMLImageElement)) return;
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    document.addEventListener('load', onImg, true);

    return () => {
      document.removeEventListener('load', onImg, true);
      window.clearTimeout(t);
      ScrollTrigger.removeEventListener('refresh', refreshHeaderTheme);
      ctx.revert();
    };
  }, []);

  return null;
}
