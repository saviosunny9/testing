/** Working brand name. Change it here and everywhere picks it up. */
export const BRAND_NAME = 'Alaro';

export const NAV_LINKS = [
  { label: 'Products', href: '#buy' },
  { label: 'For Home', href: '#moments' },
  { label: 'For Business', href: '#choose' },
  { label: 'Our Story', href: '#care' },
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
    eyebrow: 'Live view in the Alaro app',
    headline: 'Always there, even when you’re not.',
    sub: 'Live HD, smart alerts for the people and pets you love, and the moments that matter, saved automatically.',
  },
} as const;
