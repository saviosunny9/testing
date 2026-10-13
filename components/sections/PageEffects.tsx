'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { refreshHeaderTheme } from '@/lib/headerTheme';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

/**
 * Page-wide scroll behaviour below the hero:
 * - The fixed header's text colour follows whatever sits under it (see lib/headerTheme).
 * - `[data-reveal]` elements fade up once as they enter.
 */
export default function PageEffects() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Past the hero, give the header a frosted bar so it stays legible over content.
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
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      gsap.set(items, { opacity: 0, y: 32 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      });
    });
    return () => {
      ScrollTrigger.removeEventListener('refresh', refreshHeaderTheme);
      ctx.revert();
    };
  }, []);

  return null;
}
