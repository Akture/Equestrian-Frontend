'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { heroSlides } from '@/lib/copy';
import { media } from '@/lib/media';

// Same skeleton as the parent akture.video hero — full bleed, left-weighted
// text, dot pager. The departures are deliberate: title case instead of caps,
// a serif display face, and a heading scale roughly half the parent's, which
// is the single cheapest way to read as saddlery rather than broadcast sport.
export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const total = heroSlides.length;

  const restart = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setI((p) => (p + 1) % total), 7000);
  }, [total]);

  useEffect(() => {
    restart();
    return () => clearInterval(timer.current);
  }, [restart]);

  function go(n) {
    setI(((n % total) + total) % total);
    restart();
  }

  return (
    <section className="relative w-full overflow-hidden bg-ink" style={{ height: '88vh', minHeight: '620px' }}>
      {heroSlides.map((slide, idx) => (
        <div
          key={slide.badge}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: idx === i ? 1 : 0, zIndex: idx === i ? 10 : 0 }}
          aria-hidden={idx !== i}
        >
          <img
            src={media[slide.image]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Pine scrim rather than black — the ground colour carries through. */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(8,17,13,0.96) 0%, rgba(8,17,13,0.90) 34%, rgba(8,17,13,0.62) 64%, rgba(8,17,13,0.18) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(8,17,13,0.80) 0%, rgba(8,17,13,0.25) 45%, rgba(8,17,13,0.10) 100%)' }} />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 font-label text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-brass mb-6">
                  <span className="w-6 h-px bg-brass/70" aria-hidden="true" />
                  {slide.badge}
                </span>

                <h1 className="font-display text-oat text-[2.6rem] leading-[1.06] md:text-[3.6rem] md:leading-[1.05] mb-6">
                  {slide.line1}
                  <br />
                  <span className="italic text-brass-light">{slide.line2}</span>
                </h1>

                <p className="text-oat/85 text-base md:text-lg leading-relaxed mb-9 max-w-md">
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.cta.href}
                    className="btn-hermes px-6 py-3 rounded-full font-label text-sm font-semibold inline-flex items-center gap-2 shadow-hermes-md"
                  >
                    {slide.cta.label}
                    <i className="ph-bold ph-arrow-right text-sm" />
                  </Link>

                  <Link
                    href={slide.secondary.href}
                    className="px-6 py-3 rounded-full font-label text-sm font-semibold text-oat/85 border border-oat/20 hover:border-brass hover:text-brass transition-colors"
                  >
                    {slide.secondary.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {heroSlides.map((s, idx) => (
          <button
            key={s.badge}
            onClick={() => go(idx)}
            aria-label={`Show slide ${idx + 1}: ${s.badge}`}
            className="h-[3px] rounded-full transition-all"
            style={{
              width: idx === i ? '2.75rem' : '1.5rem',
              backgroundColor: idx === i ? 'rgba(198,166,111,1)' : 'rgba(246,242,234,0.28)',
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-6 md:right-12 flex gap-2 z-20">
        <button
          onClick={() => go(i - 1)}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full border border-oat/20 text-oat/80 hover:text-brass hover:border-brass/60 flex items-center justify-center transition-colors"
        >
          <i className="ph-bold ph-caret-left" />
        </button>
        <button
          onClick={() => go(i + 1)}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full border border-oat/20 text-oat/80 hover:text-brass hover:border-brass/60 flex items-center justify-center transition-colors"
        >
          <i className="ph-bold ph-caret-right" />
        </button>
      </div>
    </section>
  );
}
