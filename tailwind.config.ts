import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        sand: 'var(--sand)',
        linen: 'var(--linen)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        line: 'var(--line)',
        forest: 'var(--forest)',
        leaf: 'var(--leaf)',
        'leaf-soft': 'var(--leaf-soft)',
        ember: 'var(--ember)',
        apricot: 'var(--apricot)',
        peach: 'var(--peach)',
        rec: 'var(--rec)',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: { container: '1280px' },
      borderRadius: { card: '24px' },
    },
  },
  plugins: [],
};

export default config;
