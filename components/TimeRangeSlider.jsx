'use client';

import { useRef, useState } from 'react';
import { CHUNK_MINUTES, MAX_CHUNKS_PER_PURCHASE, minutesToClock } from '@/lib/rides';

const MAX_MINUTES = MAX_CHUNKS_PER_PURCHASE * CHUNK_MINUTES;
const GLOW = '0 0 2px rgb(var(--gold)), 0 0 12px rgb(var(--gold) / 0.7)';

// One day of an arena as a line, with a start bracket and an end bracket.
//   · both brackets move on the 15-minute grid
//   · the brackets stop 15 minutes apart and never cross
//   · past 60 minutes apart, the bracket being dragged brings the other along
//   · a press on the open line picks up the nearer bracket
export default function TimeRangeSlider({ bounds, value, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const span = bounds.end - bounds.start;

  const pct = (minute) => ((minute - bounds.start) / span) * 100;
  const snap = (minute) => Math.round(minute / CHUNK_MINUTES) * CHUNK_MINUTES;

  function minuteAt(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return bounds.start + t * span;
  }

  function moveStart(clientX) {
    const start = Math.max(bounds.start, Math.min(snap(minuteAt(clientX)), value.end - CHUNK_MINUTES));
    const end = value.end - start > MAX_MINUTES ? start + MAX_MINUTES : value.end;
    if (start !== value.start || end !== value.end) onChange({ start, end });
  }

  function moveEnd(clientX) {
    const end = Math.min(bounds.end, Math.max(snap(minuteAt(clientX)), value.start + CHUNK_MINUTES));
    const start = end - value.start > MAX_MINUTES ? end - MAX_MINUTES : value.start;
    if (start !== value.start || end !== value.end) onChange({ start, end });
  }

  function beginDrag(which) {
    return (event) => {
      event.preventDefault();
      capture(event);
      setDragging(which);
    };
  }

  function onPointerMove(event) {
    if (!dragging) return;
    if (dragging === 'start') moveStart(event.clientX);
    else moveEnd(event.clientX);
  }

  function endDrag(event) {
    if (!dragging) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch (e) {
      /* capture already released */
    }
    setDragging(null);
  }

  // A press on the open line picks up whichever bracket is nearer.
  function onTrackPointerDown(event) {
    if (event.target.closest('[data-thumb]')) return;
    event.preventDefault();
    capture(event);
    const minute = minuteAt(event.clientX);
    const which = minute - value.start < value.end - minute ? 'start' : 'end';
    setDragging(which);
    if (which === 'start') moveStart(event.clientX);
    else moveEnd(event.clientX);
  }

  const hours = [];
  for (let m = Math.ceil(bounds.start / 60) * 60; m <= bounds.end; m += 60) hours.push(m);
  const minutes = value.end - value.start;

  return (
    <div className="select-none">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-display text-2xl tabular-nums leading-none">
          {minutesToClock(value.start)}
          <span className="mx-2 text-ink/45 dark:text-oat/45">–</span>
          {minutesToClock(value.end)}
        </p>
        <p className="font-label text-[0.78rem] text-ink/65 dark:text-oat/55">
          {minutes} minutes · up to {MAX_MINUTES} in one purchase
        </p>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-14 cursor-pointer touch-none"
        role="group"
        aria-label="Time range"
      >
        {/* the day as a line */}
        <div data-line className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-pine-deep dark:bg-pine-lit" />

        {/* the selected window */}
        <div
          data-selection
          className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold"
          style={{
            left: `${pct(value.start)}%`,
            width: `${pct(value.end) - pct(value.start)}%`,
            boxShadow: GLOW,
          }}
        />

        {/* brackets */}
        {[
          { which: 'start', minute: value.start, label: 'Start time' },
          { which: 'end', minute: value.end, label: 'End time' },
        ].map((thumb) => (
          <button
            key={thumb.which}
            type="button"
            data-thumb={thumb.which}
            onPointerDown={beginDrag(thumb.which)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            aria-label={`${thumb.label}: ${minutesToClock(thumb.minute)}`}
            className={`absolute top-1/2 z-10 h-12 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none ${
              dragging === thumb.which ? 'cursor-grabbing' : ''
            }`}
            style={{ left: `${pct(thumb.minute)}%` }}
          >
            <span
              aria-hidden="true"
              className={`absolute top-1/2 h-7 w-2.5 -translate-y-1/2 border-y-[3px] border-hermes transition-transform ${
                thumb.which === 'start' ? 'border-l-[3px]' : 'border-r-[3px]'
              } ${dragging === thumb.which ? 'scale-110' : ''}`}
              style={thumb.which === 'start' ? { left: 'calc(50% - 1.5px)' } : { right: 'calc(50% - 1.5px)' }}
            />
          </button>
        ))}
      </div>

      {/* hour ticks */}
      <div className="relative mt-1 h-5">
        {hours.map((m) => (
          <span
            key={m}
            className="absolute -translate-x-1/2 font-label text-[0.62rem] tabular-nums text-ink/65 dark:text-oat/55"
            style={{ left: `${pct(m)}%` }}
          >
            {hourLabel(m)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Capture keeps the drag alive when the pointer leaves the bracket. It throws for
// a pointer the browser is not tracking, which is harmless — the drag still works
// while the pointer stays over the line.
function capture(event) {
  try {
    event.currentTarget.setPointerCapture(event.pointerId);
  } catch (e) {
    /* untracked pointer */
  }
}

function hourLabel(minute) {
  const h24 = Math.floor(minute / 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12} ${h24 >= 12 ? 'PM' : 'AM'}`;
}
