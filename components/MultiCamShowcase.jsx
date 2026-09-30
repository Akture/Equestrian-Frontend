'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { feeds } from '@/lib/media';
import { multiCam } from '@/lib/copy';
import { formatClock } from '@/lib/clock';

// The player is a deliberately different, darker room than the rest of the site.
// No equestrian reference site has anything like a three-up synced scrubber, so
// rather than dress a video tool up as saddlery, this section lets the tool look
// like a tool and inherits the parent Akture brand's dark treatment.
export default function MultiCamShowcase() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % 600), 1000);
    return () => clearInterval(id);
  }, []);

  const pct = t / 600;
  const wall = 16 * 3600 + 14 * 60 + t;

  return (
    <section id="the-rig" className="py-24 bg-ink text-oat scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-20 items-center">
          <div>
            <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-light mb-4">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              {multiCam.eyebrow}
            </p>
            <h2 className="font-display text-[1.9rem] md:text-[2.5rem] leading-tight mb-5">
              {multiCam.heading}
            </h2>
            <p className="text-oat/65 leading-relaxed mb-10">{multiCam.sub}</p>

            <div className="space-y-7">
              {multiCam.bullets.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="w-9 h-9 shrink-0 rounded-lg border border-hermes/40 bg-hermes/10 text-hermes-light flex items-center justify-center">
                    <i className={`${b.icon} text-base`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg mb-1">{b.title}</h3>
                    <p className="text-oat/55 text-[0.88rem] leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/demo/covered/watch/demo-covered-0916-1600"
              className="mt-10 inline-flex items-center gap-2 btn-hermes px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
            >
              Open the player
              <i className="ph-bold ph-arrow-right text-sm" />
            </Link>
          </div>

          {/* The proof is that all three tiles carry the same clock. */}
          <div className="rounded-2xl border border-brass/20 bg-navy-panel/40 p-4 md:p-5">
            <div className="grid grid-cols-3 gap-3">
              {feeds.map((f) => (
                <div
                  key={f.id}
                  className="relative rounded-lg overflow-hidden border border-oat/10"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <img src={f.poster} alt="" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-ink/30" />
                  <span className="absolute top-1.5 left-2 font-label text-[0.52rem] uppercase tracking-[0.14em] text-oat/85">
                    {f.label}
                  </span>
                  <span className="absolute bottom-1.5 right-2 font-label text-[0.56rem] tabular-nums text-oat/80">
                    {formatClock(wall, true)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 relative h-1.5 rounded-full bg-oat/15">
              <div className="absolute inset-y-0 left-0 rounded-full bg-hermes/70" style={{ width: `${pct * 100}%` }} />
              <span
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-hermes border-2 border-oat"
                style={{ left: `${pct * 100}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-label text-[0.6rem] uppercase tracking-[0.18em] text-oat/55">
                One scrub bar · three feeds
              </span>
              <span className="inline-flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-pine-lit animate-pulse-dot"
                    style={{ animationDelay: `${i * 0.25}s` }}
                  />
                ))}
                <span className="font-label text-[0.6rem] uppercase tracking-[0.16em] text-pine-lit ml-1">
                  Synced
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
