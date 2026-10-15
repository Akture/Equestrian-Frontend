'use client';

import { useState } from 'react';

// Contact Support. Submitting opens a real email to contact@akture.video — the
// parent site's address — with the subject and message filled in. Nothing is
// sent by the page itself, so nothing can be silently lost.
const TO = 'contact@akture.video';

const topics = [
  'My ride is missing from the barn footage page',
  'A purchase did not arrive',
  'A video will not play or download',
  'I cannot log in or access the barn',
  'Something else',
];

export default function SupportForm({ barn }) {
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState('');
  const [opened, setOpened] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const subject = `[Equestrian · ${barn.name}] ${topic}`;
    const body = `${message.trim()}\n\n—\nBarn: ${barn.name} (equestrian.akture.video/${barn.slug})`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  const field =
    'w-full rounded-form border border-ink/15 dark:border-oat/20 bg-white dark:bg-oat/[0.04] px-5 py-3.5 text-ink dark:text-oat focus:outline-none focus:border-hermes focus:ring-1 focus:ring-hermes/40 transition-colors';
  const label = 'block font-label text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-ink/65 dark:text-oat/55 mb-2.5';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="aq-topic" className={label}>
          What is it about
        </label>
        <select id="aq-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="aq-message" className={label}>
          What happened
        </label>
        <textarea
          id="aq-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="The arena, the day and the time help us find it quickly."
          className={`${field} resize-y`}
        />
      </div>

      <button type="submit" className="btn-hermes rounded-full px-7 py-3.5 font-label text-sm font-semibold shadow-hermes-md">
        <i className="ph-bold ph-envelope-simple mr-2" />
        Open an email to support
      </button>

      <p className="text-ink/65 dark:text-oat/55 text-[0.8rem] leading-relaxed">
        This opens your mail app with the message addressed to {TO}. You send it from there.
        {opened && ' If nothing opened, your browser has no mail app set — copy the address instead.'}
      </p>
    </form>
  );
}
