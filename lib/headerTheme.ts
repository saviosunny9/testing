/** Header text colour: `dark` = over video/dark sections (white text), `light` = over cream (ink text). */
export type HeaderTheme = 'dark' | 'light';

type Listener = (theme: HeaderTheme) => void;
const listeners = new Set<Listener>();
let current: HeaderTheme = 'dark';

export function setHeaderTheme(theme: HeaderTheme) {
  if (theme === current) return;
  current = theme;
  listeners.forEach((l) => l(theme));
}

export function getHeaderTheme() {
  return current;
}

export function subscribeHeaderTheme(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/* ---------------------------------------------------------------------------
 * The theme is derived from what sits under the header, rather than from
 * enter/leave callbacks (those can fire out of order on large scroll jumps).
 * ------------------------------------------------------------------------- */

const HEADER_LINE = 48; // px from the top of the viewport
const HERO_LIGHT_AT = 0.25;

/** Progress of the animated hero timeline, or null when there is none (reduced motion). */
let heroProgress: number | null = null;

export function setHeroProgress(progress: number | null) {
  heroProgress = progress;
  refreshHeaderTheme();
}

export function refreshHeaderTheme() {
  if (typeof document === 'undefined') return;
  const under = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.top <= HEADER_LINE && r.bottom > HEADER_LINE;
  };
  for (const el of document.querySelectorAll('[data-header-theme="dark"]')) {
    if (under(el)) return setHeaderTheme('dark');
  }
  const hero = document.querySelector('.hero-track');
  if (hero && heroProgress !== null && under(hero)) {
    return setHeaderTheme(heroProgress > HERO_LIGHT_AT ? 'light' : 'dark');
  }
  setHeaderTheme('light');
}
