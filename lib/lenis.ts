import type Lenis from 'lenis';

/**
 * Shared Lenis instance. The hero's intro can lock scrolling before the
 * provider effect has created Lenis, so the lock is recorded and applied on
 * registration.
 */
let instance: Lenis | null = null;
let locked = false;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locked) lenis.stop();
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  locked = true;
  instance?.stop();
}

export function unlockScroll() {
  locked = false;
  instance?.start();
}
