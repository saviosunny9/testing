import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        charcoal: 'var(--charcoal)',
        forest: 'var(--forest)',
        'forest-2': 'var(--forest-2)',
        fresh: 'var(--fresh)',
        rec: 'var(--rec)',
        // legacy aliases kept so older class names resolve to the new neutral system
        surface: 'var(--paper)',
        'surface-2': 'var(--paper-2)',
        night: 'var(--forest)',
        'night-2': 'var(--forest-2)',
      },
      fontFamily: {
        sans: ['var(--font-switzer)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
