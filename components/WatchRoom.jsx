'use client';

import { useState } from 'react';
import MultiCamPlayer from './MultiCamPlayer';

// A bought folder, or a run of them in order. Nothing here is a preview —
// there is no way to reach this page for footage that has not been bought.
export default function WatchRoom({ folder, queue, markers }) {
  const [note, setNote] = useState('');

  function demoAction(what) {
    setNote(`${what} is not wired up in this mockup.`);
    setTimeout(() => setNote(''), 3200);
  }

  return (
    <div className="relative">
      <MultiCamPlayer session={folder} queue={queue} markers={markers} onDemoAction={demoAction} />

      {note && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-ink text-oat border border-brass/40 px-5 py-2.5 font-label text-[0.8rem] shadow-rail animate-rise"
        >
          <i className="ph-fill ph-flask text-hermes mr-2" />
          {note}
        </div>
      )}
    </div>
  );
}
