/** Working brand name. Change it here and everywhere picks it up. */
export const BRAND_NAME = 'Alaro';

export const NAV_LINKS = [
  { label: 'Products', href: '#buy' },
  { label: 'For Home', href: '#moments' },
  { label: 'For Business', href: '#choose' },
  { label: 'Design', href: '#design' },
  { label: 'Support', href: '#faq' },
] as const;

/** Placeholder until pricing is final. */
export const PRICE = '₹7,499';

export const COPY = {
  hero: {
    eyebrow: `Meet ${BRAND_NAME}`,
    headline: { lead: 'The intelligence', trail: 'behind your space.' },
    description: `${BRAND_NAME} is a smart camera that understands what's happening at home, not just records it. Ask what you missed and see only what matters.`,
    watchFilm: 'Watch the film',
    buy: `Buy ${BRAND_NAME}`,
  },
  preview: {
    eyebrow: 'The Alaro app',
    headline: 'Every moment, right in your pocket.',
    sub: 'Live view, gentle alerts for the people and pets you love, and the moments worth keeping, saved automatically.',
  },
} as const;
