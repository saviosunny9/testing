/** Tiny client-side bag count shared by the header and the buy box (demo only). */
type Listener = (count: number) => void;
const listeners = new Set<Listener>();
let count = 0;

export function addToCart() {
  count += 1;
  listeners.forEach((l) => l(count));
}

export function getCartCount() {
  return count;
}

export function subscribeCart(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
