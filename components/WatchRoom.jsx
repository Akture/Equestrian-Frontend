'use client';

import { useState } from 'react';
import Link from 'next/link';
import MultiCamPlayer from './MultiCamPlayer';

// A bought folder, or a run of them in order. Nothing here is a preview —
// there is no way to reach this page for footage that has not been bought.
export default function WatchRoom({ folder, queue, recentlyPurchased = [], markers }) {
  const [note, setNote] = useState('');
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  function demoAction(what) {
    setNote(`${what} is not wired up in this mockup.`);
    setTimeout(() => setNote(''), 3200);
  }

  return (
    <div className="relative">
      <MultiCamPlayer
        session={folder}
        queue={queue}
        recentlyPurchased={recentlyPurchased}
        autoPlayNext={autoPlayNext}
        markers={markers}
        onDemoAction={demoAction}
      />

      <section className="mt-8 rounded-2xl border border-ink/15 bg-white/50 p-6 dark:border-oat/15 dark:bg-oat/[0.03] md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label text-[0.62rem] uppercase tracking-[0.2em] text-hermes-ink dark:text-hermes-light">
              Your library
            </p>
            <h2 className="mt-1 font-display text-2xl">Recently Purchased Videos</h2>
            <p className="mt-2 text-[0.82rem] text-ink/60 dark:text-oat/55">
              {autoPlayNext
                ? 'The next purchased video will play automatically when this purchase finishes.'
                : 'Choose a video to watch, or enable autoplay to continue through your purchases.'}
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-ink/15 px-4 py-2.5 font-label text-[0.78rem] text-ink/75 dark:border-oat/20 dark:text-oat/75">
            <input
              type="checkbox"
              checked={autoPlayNext}
              onChange={(event) => setAutoPlayNext(event.target.checked)}
              className="accent-hermes"
            />
            Autoplay next video
          </label>
        </div>

        {recentlyPurchased.length ? (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recentlyPurchased.map((video) => (
              <li key={video.id}>
                <Link
                  href={`/${video.barn}/${video.arena}/watch/${video.id}`}
                  className="group flex h-full items-center gap-4 rounded-xl border border-ink/10 p-3 transition-colors hover:border-hermes/50 dark:border-oat/10"
                >
                  <img
                    src={video.thumb}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[0.98rem] group-hover:text-hermes-ink dark:group-hover:text-hermes-light">
                      {video.arenaName}
                    </span>
                    <span className="mt-1 block truncate text-[0.75rem] text-ink/60 dark:text-oat/55">
                      {video.dateLabel} · {video.start}–{video.end}
                    </span>
                    <span className="mt-1 block font-label text-[0.62rem] uppercase tracking-[0.14em] text-hermes-ink dark:text-hermes-light">
                      {video.horse}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-[0.84rem] text-ink/60 dark:text-oat/55">Your purchased folders will appear here.</p>
        )}
      </section>

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
