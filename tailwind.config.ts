import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        night: 'var(--night)',
        brand: 'var(--red)',
        live: 'var(--live)',
        rec: 'var(--rec)',
        amber: 'var(--amber)',
        blue: 'var(--blue)',
        sky: 'var(--sky)',
        lilac: 'var(--lilac)',
        violet: 'var(--violet)',
        mint: 'var(--mint)',
        green: 'var(--green)',
        peach: 'var(--peach)',
        coral: 'var(--coral)',
        sun: 'var(--sun)',
        gold: 'var(--gold)',
        'night-2': 'var(--night-2)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
