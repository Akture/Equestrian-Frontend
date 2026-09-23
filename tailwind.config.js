/** @type {import('tailwindcss').Config} */
//
// No colour literals live in this file. Every value references a CSS custom
// property defined once in app/globals.css — that file is the source of truth,
// and scripts/check-css.mjs fails the build if a hex sneaks back in here.
//
// The `<alpha-value>` placeholder is what keeps opacity modifiers working:
// `text-oat/55` becomes rgb(var(--oat) / 0.55). Without it, every one of those
// utilities silently stops applying.
//
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: token('ink'), soft: token('ink-soft') },
        pine: {
          DEFAULT: token('pine'),
          deep: token('pine-deep'),
          soft: token('pine-soft'),
          rolex: token('pine-rolex'),
          lit: token('pine-lit'),
        },
        navy: { DEFAULT: token('navy'), deep: token('navy-deep'), panel: token('navy-panel') },
        oat: { DEFAULT: token('oat'), dim: token('oat-dim'), deep: token('oat-deep') },
        brass: {
          DEFAULT: token('brass'),
          dark: token('brass-dark'),
          light: token('brass-light'),
          ink: token('brass-ink'),
        },
        hermes: {
          DEFAULT: token('hermes'),
          dark: token('hermes-dark'),
          light: token('hermes-light'),
          ink: token('hermes-ink'),
        },
        gold: token('gold'),
        clay: token('clay'),
        sage: token('sage'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        label: ['var(--font-label)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'hermes-sm': '0 0 14px rgb(var(--hermes) / 0.26)',
        'hermes-md': '0 10px 24px -12px rgb(var(--hermes) / 0.5)',
        rail: '0 18px 44px -28px rgb(var(--ink) / 0.7)',
      },
      borderRadius: {
        form: '14px',
      },
    },
  },
  plugins: [],
};
