'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { feeds } from '@/lib/media';
import { activityProfile, formatClock, formatElapsed, parseClock } from '@/lib/clock';

const SPEEDS = [0.25, 0.5, 1, 1.5, 2];

// One shared transport, one playhead, one clock. No per-camera timeline and no
// per-camera play button — that is the whole reason three feeds can be trusted
// to be the same moment.
export default function MultiCamPlayer({ session: initial, queue: queueProp, markers = [], onDemoAction }) {
  // Play in order: every folder from the same purchase, back to back. When one
  // 15-minute folder ends the next starts on its own, and the header says so.
  const queue = queueProp && queueProp.length ? queueProp : [initial];
  const [cursor, setCursor] = useState(Math.max(0, queue.findIndex((q) => q.id === initial.id)));
  const session = queue[cursor] || initial;
  const duration = session.minutes * 60;
  const windowStart = parseClock(session.start);

  const [t, setT] = useState(duration * 0.32);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState('single'); // 'single' | 'triptych'
  const [active, setActive] = useState('side');
  const [audio, setAudio] = useState('side');
  const [clockMode, setClockMode] = useState('wall'); // 'wall' | 'elapsed'
  const [userMarks, setUserMarks] = useState([]);
  const [loop, setLoop] = useState(null); // { from, to }
  const [showKeys, setShowKeys] = useState(false);

  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const stripRef = useRef(null);
  const rootRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tRef = useRef(0);
  const cursorRef = useRef(cursor);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  const activity = useMemo(() => activityProfile(session.id), [session.id]);
  const allMarks = useMemo(
    () =>
      [...markers.map((m) => ({ ...m, owner: 'seeded' })), ...userMarks].sort((a, b) => a.at - b.at),
    [markers, userMarks]
  );

  // ---- the master clock -------------------------------------------------
  useEffect(() => {
    if (!playing) {
      lastRef.current = null;
      return undefined;
    }
    const step = (now) => {
      if (lastRef.current == null) lastRef.current = now;
      // Clamp the frame delta. requestAnimationFrame stops while the tab is
      // hidden, so without this the first frame back would advance the clock by
      // the whole time the tab was in the background.
      const elapsed = Math.min((now - lastRef.current) / 1000, 0.25);
      const dt = elapsed * speed;
      lastRef.current = now;
      let next = tRef.current + dt;
      if (loop && next >= loop.to) next = loop.from;
      if (next >= duration) {
        if (cursorRef.current < queue.length - 1) {
          // end of this folder — the next one starts on its own
          cursorRef.current += 1;
          setCursor(cursorRef.current);
          tRef.current = 0;
          setT(0);
          rafRef.current = requestAnimationFrame(step);
          return;
        }
        tRef.current = duration;
        setT(duration);
        setPlaying(false);
        return;
      }
      tRef.current = next;
      setT(next);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, speed, duration, loop, queue.length]);

  const seek = useCallback(
    (seconds) => setT(Math.min(duration, Math.max(0, seconds))),
    [duration]
  );

  const nudge = useCallback((delta) => setT((p) => Math.min(duration, Math.max(0, p + delta))), [duration]);

  const goToFolder = useCallback(
    (i) => {
      if (i < 0 || i >= queue.length) return;
      cursorRef.current = i;
      setCursor(i);
      tRef.current = 0;
      setT(0);
      setLoop(null);
    },
    [queue.length]
  );

  // Fullscreen takes the whole player — stage, rail and transport — because a
  // native <video> loses its controls in fullscreen and that is the reason the
  // team chose a custom player.
  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Switching angles never moves the clock and never restarts playback.
  const promote = useCallback((id) => {
    setActive(id);
    setAudio(id);
    setMode('single');
  }, []);

  // ---- keyboard ---------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const k = e.key;
      if (k === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (k === '1' || k === '2' || k === '3') {
        promote(feeds[Number(k) - 1].id);
      } else if (k === 'g' || k === 'G') {
        setMode((m) => (m === 'single' ? 'triptych' : 'single'));
      } else if (k === 'ArrowLeft') {
        nudge(e.shiftKey ? -10 : -1);
      } else if (k === 'ArrowRight') {
        nudge(e.shiftKey ? 10 : 1);
      } else if (k === ',') {
        nudge(-1 / 30);
      } else if (k === '.') {
        nudge(1 / 30);
      } else if (k === 'f' || k === 'F') {
        toggleFullscreen();
      } else if (k === 'n' || k === 'N') {
        goToFolder(cursorRef.current + 1);
      } else if (k === 'p' || k === 'P') {
        goToFolder(cursorRef.current - 1);
      } else if (k === '?') {
        setShowKeys((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nudge, promote, toggleFullscreen, goToFolder]);

  const pct = duration ? t / duration : 0;
  const activeFeed = feeds.find((f) => f.id === active) || feeds[0];

  const timeLabel =
    clockMode === 'wall'
      ? formatClock(windowStart + t, true)
      : `${formatElapsed(t)} / ${formatElapsed(duration)}`;

  function addMark() {
    setUserMarks((prev) => [...prev, { at: pct, label: 'My ride', kind: 'mine' }]);
  }

  function onStripClick(e) {
    const rect = stripRef.current.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  }

  return (
    <div
      ref={rootRef}
      className={`bg-ink text-oat border border-brass/20 overflow-hidden shadow-rail ${
        isFullscreen ? 'rounded-none overflow-y-auto p-4 md:p-8' : 'rounded-2xl'
      }`}
    >
      {/* -- context bar ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-brass/15 bg-navy-panel/60">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-label text-[0.62rem] uppercase tracking-[0.2em] text-hermes-light whitespace-nowrap">
            {session.arenaName}
          </span>
          <span className="w-px h-4 bg-oat/15" aria-hidden="true" />
          <span className="text-[0.78rem] text-oat/70 truncate tabular-nums">
            {session.dateLabel} · {session.start}–{session.end}
          </span>
          {queue.length > 1 && (
            <>
              <span className="w-px h-4 bg-oat/15" aria-hidden="true" />
              <span className="text-[0.78rem] text-hermes-light whitespace-nowrap">
                Playing {cursor + 1} of {queue.length}
                <span className="text-oat/55"> · next starts on its own</span>
              </span>
            </>
          )}
        </div>
        <SyncChip />
      </div>

      {mode === 'single' ? (
        <div className="p-3 md:p-4 grid grid-cols-1 xl:grid-cols-[1fr_248px] gap-3 md:gap-4">
          <Stage feed={activeFeed} timeLabel={timeLabel} playing={playing} />
          <div className="grid grid-cols-3 xl:grid-cols-1 gap-3">
            {feeds.map((f) => (
              <RailTile
                key={f.id}
                feed={f}
                isActive={f.id === active}
                hasAudio={f.id === audio}
                onClick={() => promote(f.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 md:p-4 space-y-3">
          {/* The 180° side view is the one framing that earns full width. */}
          <Stage feed={feeds[0]} timeLabel={timeLabel} playing={playing} onClick={() => promote('side')} />
          <div className="grid grid-cols-2 gap-3">
            {feeds.slice(1).map((f) => (
              <Stage key={f.id} feed={f} compact playing={playing} onClick={() => promote(f.id)} />
            ))}
          </div>
        </div>
      )}

      {/* -- transport ------------------------------------------------------ */}
      <div className="px-3 md:px-6 pb-5 pt-1">
        {/* jump-to chips, seeded from the barn schedule and activity spikes */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-label text-[0.6rem] uppercase tracking-[0.18em] text-oat/55 mr-1">
            Jump to
          </span>
          {allMarks.map((m, i) => (
            <button
              key={`${m.label}-${i}`}
              type="button"
              onClick={() => seek(m.at * duration)}
              className={`px-2.5 py-1 rounded-full text-[0.68rem] border transition-colors ${
                m.kind === 'mine'
                  ? 'border-hermes/50 text-hermes hover:bg-hermes/10'
                  : 'border-oat/15 text-oat/60 hover:border-hermes hover:text-hermes-light'
              }`}
            >
              {formatClock(windowStart + m.at * duration)} · {m.label}
            </button>
          ))}
        </div>

        {/* activity strip + scrub track */}
        <div
          ref={stripRef}
          onClick={onStripClick}
          className="relative h-14 cursor-pointer select-none"
          role="presentation"
        >
          <div className="absolute inset-x-0 top-0 h-9 flex items-end gap-px">
            {activity.map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-[1px]"
                style={{
                  height: `${v * 100}%`,
                  // Longhand, not the `background` shorthand — React expands the
                  // shorthand on the client and reports a false hydration diff.
                  backgroundColor:
                    i / activity.length <= pct ? 'rgba(198,166,111,0.55)' : 'rgba(246,242,234,0.13)',
                }}
              />
            ))}
          </div>

          {loop && (
            <div
              className="absolute top-0 h-9 bg-hermes/20 border-x border-hermes/60 pointer-events-none"
              style={{ left: `${loop.from * 100}%`, width: `${(loop.to - loop.from) * 100}%` }}
            />
          )}

          <div className="absolute inset-x-0 top-9 h-1.5 rounded-full bg-oat/15 overflow-hidden">
            <div className="h-full bg-brass/60" style={{ width: `${pct * 100}%` }} />
          </div>

          {allMarks.map((m, i) => (
            <span
              key={`pin-${i}`}
              title={m.label}
              className={`absolute top-[30px] w-[3px] h-4 rounded-full pointer-events-none ${
                m.kind === 'mine' ? 'bg-hermes' : 'bg-brass'
              }`}
              style={{ left: `${m.at * 100}%` }}
            />
          ))}

          <span
            className="absolute top-[26px] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-hermes border-2 border-oat pointer-events-none"
            style={{ left: `${pct * 100}%`, boxShadow: '0 0 0 4px rgba(243,112,33,0.2)' }}
          />

          <div className="absolute inset-x-0 bottom-0 flex justify-between font-label text-[0.6rem] text-oat/55 tabular-nums">
            <span>{formatClock(windowStart)}</span>
            <span>{formatClock(windowStart + duration * 0.5)}</span>
            <span>{formatClock(windowStart + duration)}</span>
          </div>
        </div>

        {queue.length > 1 && (
          <ol className="mt-3 flex gap-1.5" aria-label="Folders in this purchase, in order">
            {queue.map((q, i) => (
              <li key={q.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => goToFolder(i)}
                  aria-current={i === cursor ? 'true' : undefined}
                  className={`w-full rounded-md border px-2 py-1.5 text-left transition-colors ${
                    i === cursor
                      ? 'border-hermes bg-hermes/15 text-oat'
                      : i < cursor
                        ? 'border-oat/10 text-oat/55 hover:border-brass/50'
                        : 'border-oat/15 text-oat/70 hover:border-brass/50'
                  }`}
                >
                  <span className="block font-label text-[0.58rem] uppercase tracking-[0.14em] text-oat/55">
                    Folder {i + 1}
                  </span>
                  <span className="block font-label text-[0.72rem] tabular-nums">
                    {q.start}–{q.end}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}

        {/* controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5">
            <Ctl label="Back 10 seconds" icon="ph-bold ph-arrow-counter-clockwise" onClick={() => nudge(-10)} />
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause' : 'Play'}
              className="w-11 h-11 rounded-full btn-hermes flex items-center justify-center shadow-hermes-sm"
            >
              <i className={playing ? 'ph-fill ph-pause text-lg' : 'ph-fill ph-play text-lg'} />
            </button>
            <Ctl label="Forward 10 seconds" icon="ph-bold ph-arrow-clockwise" onClick={() => nudge(10)} />
            <Ctl label="Step back one frame" icon="ph-bold ph-caret-line-left" onClick={() => nudge(-1 / 30)} />
            <Ctl label="Step forward one frame" icon="ph-bold ph-caret-line-right" onClick={() => nudge(1 / 30)} />
          </div>

          <button
            type="button"
            onClick={() => setClockMode((m) => (m === 'wall' ? 'elapsed' : 'wall'))}
            className="font-label text-[0.78rem] tabular-nums text-oat/80 hover:text-brass transition-colors px-2"
            title="Switch between time of day and elapsed time"
          >
            {timeLabel}
          </button>

          {/* mode toggle */}
          <div
            className="flex rounded-full border border-oat/15 overflow-hidden ml-auto"
            title="All three keeps every camera running so switching picks up mid-ride — about three times the data, and slower networks will buffer."
          >
            {[
              { id: 'single', label: 'Single' },
              { id: 'triptych', label: 'All three' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`px-3.5 py-1.5 font-label text-[0.72rem] transition-colors ${
                  mode === m.id ? 'bg-oat/15 text-oat' : 'text-oat/55 hover:text-oat/80'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Playback speed"
            className="bg-transparent border border-oat/15 rounded-full px-3 py-1.5 font-label text-[0.72rem] text-oat/80 focus:outline-none focus:border-hermes"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s} className="bg-ink">
                {s}×
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setLoop((l) =>
                l ? null : { from: Math.max(0, pct - 0.02), to: Math.min(1, pct + 0.03) }
              )
            }
            className={`px-3 py-1.5 rounded-full border font-label text-[0.72rem] transition-colors ${
              loop ? 'border-hermes/60 text-hermes' : 'border-oat/15 text-oat/70 hover:border-hermes'
            }`}
            title="Loop a few seconds around the playhead — the distance, over and over"
          >
            <i className="ph-bold ph-repeat mr-1.5" />
            {loop ? 'Looping' : 'Loop distance'}
          </button>

          <button
            type="button"
            onClick={addMark}
            className="px-3 py-1.5 rounded-full border border-oat/15 text-oat/70 hover:border-hermes hover:text-hermes-light font-label text-[0.72rem] transition-colors"
          >
            <i className="ph-bold ph-map-pin mr-1.5" />
            Mark my ride
          </button>

          <Ctl label="Download" icon="ph-bold ph-download-simple" onClick={() => onDemoAction?.('Download')} />
          <Ctl label="Share" icon="ph-bold ph-share-network" onClick={() => onDemoAction?.('Share')} />
          <Ctl
            label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            icon={isFullscreen ? 'ph-bold ph-corners-in' : 'ph-bold ph-corners-out'}
            onClick={toggleFullscreen}
          />
          <Ctl label="Keyboard shortcuts" icon="ph-bold ph-keyboard" onClick={() => setShowKeys((v) => !v)} />
        </div>

        {mode === 'triptych' && (
          <p className="mt-3 font-label text-[0.72rem] text-oat/55 leading-relaxed">
            <i className="ph-bold ph-wifi-medium mr-1.5 text-brass" />
            All three keeps every camera running so switching picks up mid-ride. That is about three
            times the data of a single view, and slower networks will buffer.
          </p>
        )}

        {showKeys && (
          <div className="mt-4 rounded-xl border border-oat/15 bg-navy-panel/50 p-4 grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-6 text-[0.75rem] text-oat/65 animate-rise">
            {[
              ['Space', 'Play / pause'],
              ['1 · 2 · 3', 'Long side · In gate · Far end'],
              ['G', 'Single / all three'],
              ['← →', 'One second'],
              ['⇧ ← →', 'Ten seconds'],
              [', .', 'One frame'],
              ['F', 'Fullscreen'],
              ['N · P', 'Next / previous folder'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <kbd className="font-label text-[0.68rem] px-1.5 py-0.5 rounded border border-oat/20 text-oat/80">
                  {k}
                </kbd>
                <span>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stage({ feed, timeLabel, compact = false, playing, onClick }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Show only the ${feed.label} camera` : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      className={`relative rounded-xl overflow-hidden border border-brass/20 bg-navy-deep ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <img src={feed.poster} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/35" />

      <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink/70 backdrop-blur-sm px-2.5 py-1 font-label text-[0.62rem] uppercase tracking-[0.16em] text-oat/85">
        {feed.label} · {feed.angle}
      </span>

      {timeLabel && (
        <span className="absolute top-3 right-3 rounded-full bg-ink/70 backdrop-blur-sm px-2.5 py-1 font-label text-[0.68rem] tabular-nums text-oat/85">
          {timeLabel}
        </span>
      )}

      {!playing && !compact && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-16 h-16 rounded-full bg-ink/55 backdrop-blur-sm border border-oat/20 flex items-center justify-center">
            <i className="ph-fill ph-play text-2xl text-oat/90 ml-0.5" />
          </span>
        </span>
      )}
    </div>
  );
}

function RailTile({ feed, isActive, hasAudio, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Show the ${feed.label} camera`}
      aria-pressed={isActive}
      className={`relative rounded-lg overflow-hidden border text-left transition-all ${
        isActive ? 'border-hermes/70 ring-1 ring-hermes/30' : 'border-oat/15 hover:border-brass/50'
      }`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <img src={feed.poster} alt="" className="w-full h-full object-cover" />
      <span className="absolute inset-0 bg-ink/35" />
      <span className="absolute bottom-1.5 left-2 font-label text-[0.58rem] uppercase tracking-[0.14em] text-oat/85">
        {feed.label}
      </span>
      {hasAudio && (
        <span className="absolute bottom-1.5 right-2 text-brass" title="Audio source">
          <i className="ph-fill ph-speaker-high text-[0.7rem]" />
        </span>
      )}
    </button>
  );
}

function SyncChip() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-pine-lit/45 bg-pine-lit/10 px-2.5 py-1"
      title="All three feeds are inside sync tolerance"
    >
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-pine-lit animate-pulse-dot" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </span>
      <span className="font-label text-[0.62rem] uppercase tracking-[0.16em] text-pine-lit">Synced</span>
    </span>
  );
}

function Ctl({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-9 h-9 rounded-full border border-oat/15 text-oat/70 hover:text-hermes-light hover:border-hermes flex items-center justify-center transition-colors"
    >
      <i className={`${icon} text-sm`} />
    </button>
  );
}
