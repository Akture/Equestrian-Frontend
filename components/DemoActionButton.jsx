'use client';

import { useState } from 'react';

// A control whose real effect is not wired in the mockup. It says so on press
// instead of pretending — data may be fake, actions never are.
export default function DemoActionButton({ label, icon, className = '', tone = 'hermes' }) {
  const [note, setNote] = useState('');

  function press() {
    setNote(`${label} is not wired up in this mockup.`);
    setTimeout(() => setNote(''), 3000);
  }

  const base =
    tone === 'hermes'
      ? 'btn-hermes shadow-hermes-md'
      : 'border border-ink/15 dark:border-oat/20 text-ink/75 dark:text-oat/75 hover:border-hermes hover:text-hermes-ink dark:hover:text-hermes-light';

  return (
    <div className={className}>
      <button
        type="button"
        onClick={press}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-label text-[0.82rem] font-semibold transition-colors ${base}`}
      >
        {icon && <i className={`${icon} text-sm`} />}
        {label}
      </button>
      {note && (
        <p className="mt-2 font-label text-[0.74rem] text-hermes-ink dark:text-hermes-light animate-rise" role="status">
          <i className="ph-fill ph-flask mr-1" />
          {note}
        </p>
      )}
    </div>
  );
}
