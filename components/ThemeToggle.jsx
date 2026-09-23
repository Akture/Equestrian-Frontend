'use client';

import { useEffect, useState } from 'react';

// The parent Akture site follows the system scheme with no switch. This mockup
// keeps that as the default and adds a switch so the palette can be reviewed
// both ways in one sitting.
export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('aq-theme', next ? 'dark' : 'light');
    } catch (e) {
      /* private browsing — the choice just does not persist */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to the light ground' : 'Switch to the dark ground'}
      className={`w-9 h-9 rounded-full flex items-center justify-center border border-pine/15 dark:border-oat/15 text-pine/70 dark:text-oat/70 hover:text-hermes-ink dark:hover:text-hermes hover:border-hermes/40 transition-colors ${className}`}
    >
      <i className={dark ? 'ph-fill ph-sun text-base' : 'ph-fill ph-moon text-base'} />
    </button>
  );
}
