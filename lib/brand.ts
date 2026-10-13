/** Working brand name. Change it here and everywhere picks it up. */
export const BRAND_NAME = 'Alaro';
export const BRAND_WORDMARK = BRAND_NAME.toLowerCase();

export const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Plans', href: '#plans' },
  { label: 'Stories', href: '#stories' },
] as const;

/** Hero H1. `lead` is set in Plus Jakarta Sans; `accent` in Instrument Serif Italic. */
export type Headline = { lead: string; accent: string };

export const HERO_HEADLINES: readonly Headline[] = [
  { lead: 'Every moment,', accent: 'watched over.' },
  { lead: 'Home,', accent: 'held close.' },
  { lead: 'See them, even when', accent: "you're away." },
  { lead: 'The little moments,', accent: 'kept.' },
];

export const COPY = {
  hero: {
    headline: HERO_HEADLINES[0],
    description:
      'A smart home camera that captures the little moments and quietly keeps an eye on the ones you love: kids, pets, and grandparents.',
    watchFilm: 'Watch the film',
    primaryCta: `Get ${BRAND_NAME}`,
    shopCta: 'Shop the camera',
  },
  preview: {
    headline: { lead: 'Always there,', accent: "even when you're not." } satisfies Headline,
    sub: 'Live HD view, smart alerts for the people and pets you love, and moments saved automatically. All from one app.',
  },
  toasts: [
    { title: "Grandma's home", line: 'Front door · arrived safely', time: 'now' },
    { title: 'Milo is up to something', line: 'Pet detected in Living Room', time: '2m ago' },
    { title: 'Bedtime ✓', line: "Kids' room is quiet · Night vision on", time: '9:14 PM' },
  ],
} as const;
