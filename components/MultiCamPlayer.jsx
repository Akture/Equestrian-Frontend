'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { feeds } from '@/lib/media';
import { formatClock, formatElapsed, parseClock } from '@/lib/clock';
import { videoFolderTitle } from '@/lib/rides';
import VideoDownloadButton from './VideoDownloadButton';

const SPEEDS = [0.25, 0.5, 1, 1.5, 2];

// One shared transport, one playhead, one clock. No per-camera timeline and no
// per-camera play button — that is the whole reason three feeds can be trusted
// to be the same moment.
export default function MultiCamPlayer({
  session: initial,
  queue: queueProp,
  recentlyPurchased = [],
  autoPlayNext = false,
  autoStart = false,
  markers = [],
  barnName,
}) {
  // Play in order: every folder from the same purchase, back to back. When one
  // 15-minute folder ends the next starts on its own, and the header says so.
  const purchaseQueue = queueProp && queueProp.length ? queueProp : [initial];
  const purchasedIds = new Set(purchaseQueue.map((item) => item.id));
  const queue = [
    ...purchaseQueue,
    ...recentlyPurchased.filter((item) => !purchasedIds.has(item.id)),
  ];
  const [cursor, setCursor] = useState(Math.max(0, queue.findIndex((q) => q.id === initial.id)));
  const session = queue[cursor] || initial;
  const hasVideo = Boolean(session.videos && feeds.every((feed) => session.videos[feed.id]));
  const sessionDuration = session.minutes * 60;
  const [mediaDurations, setMediaDurations] = useState({});
  const duration = hasVideo && feeds.every((feed) => mediaDurations[feed.id])
    ? Math.min(...feeds.map((feed) => mediaDurations[feed.id]))
    : sessionDuration;
  const windowStart = parseClock(session.start);

  const [t, setT] = useState(() => (hasVideo ? 0 : sessionDuration * 0.32));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [active, setActive] = useState('side');
  const [clockMode, setClockMode] = useState('elapsed'); // 'wall' | 'elapsed'
  const [userMarks, setUserMarks] = useState([]);
  const [editingMark, setEditingMark] = useState(null);
  const [markLabel, setMarkLabel] = useState('');
  const [mediaMessage, setMediaMessage] = useState('');

  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const stripRef = useRef(null);
  const rootRef = useRef(null);
  const videoRefs = useRef({});
  const previousSessionRef = useRef(session.id);
  const resumeAfterLoadRef = useRef(false);
  const lastSyncRef = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tRef = useRef(0);
  const cursorRef = useRef(cursor);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    const sessionChanged = previousSessionRef.current !== session.id;
    previousSessionRef.current = session.id;
    if (sessionChanged) setMediaDurations({});
    setMediaMessage('');
    setT(hasVideo ? 0 : sessionDuration * 0.32);
    try {
      const stored = JSON.parse(localStorage.getItem(`aq-player-marks:${session.id}`) || '[]');
      setUserMarks(Array.isArray(stored) ? stored : []);
    } catch {
      setUserMarks([]);
    }
  }, [session.id]);

  useEffect(() => {
    if (!hasVideo) return;
    feeds.forEach((feed) => {
      const video = videoRefs.current[feed.id];
      if (video?.readyState >= 1 && Number.isFinite(video.duration)) {
        setMediaDurations((current) => ({ ...current, [feed.id]: video.duration }));
      }
    });
  }, [hasVideo, session.id]);

  const videosReady = hasVideo && feeds.every((feed) => mediaDurations[feed.id] > 0);

  useEffect(() => {
    if (!videosReady || (!resumeAfterLoadRef.current && !autoStart)) return;
    if (!feeds.every((feed) => videoRefs.current[feed.id]?.readyState >= 1)) return;
    resumeAfterLoadRef.current = false;
    const videos = feeds.map((feed) => videoRefs.current[feed.id]).filter(Boolean);
    videos.forEach((video) => {
      video.currentTime = 0;
      video.playbackRate = speed;
    });
    Promise.all(videos.map((video) => video.play()))
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false);
        setMediaMessage('A camera could not start automatically. Press Play to retry.');
      });
  }, [videosReady, session.id, speed, autoStart]);

  useEffect(() => {
    if (autoStart && !hasVideo) setPlaying(true);
  }, [autoStart, hasVideo, session.id]);

  const allMarks = useMemo(
    () => [
      ...markers.map((m) => ({ ...m, owner: 'seeded' })),
      ...userMarks.map((m) => ({ ...m, at: duration ? m.seconds / duration : 0, kind: 'mine', owner: 'user' })),
    ].sort((a, b) => a.at - b.at),
    [markers, userMarks, duration]
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
      if (hasVideo) {
        const master = videoRefs.current[active];
        if (master && now - lastSyncRef.current >= 350) {
          let next = master.currentTime;
          if (next >= duration) {
            if (
              cursorRef.current < queue.length - 1 &&
              (cursorRef.current < purchaseQueue.length - 1 || autoPlayNext)
            ) {
              resumeAfterLoadRef.current = true;
              cursorRef.current += 1;
              setCursor(cursorRef.current);
              tRef.current = 0;
              setT(0);
            } else {
              tRef.current = duration;
              setT(duration);
              setPlaying(false);
              feeds.forEach((feed) => {
                const video = videoRefs.current[feed.id];
                if (!video) return;
                const end = Math.min(duration, video.duration || duration);
                if (video.readyState >= 1 && Math.abs(video.currentTime - end) > 0.05) video.currentTime = end;
                video.pause();
              });
            }
            return;
          }
          feeds.forEach((feed) => {
            const follower = videoRefs.current[feed.id];
            if (!follower || follower === master || follower.readyState < 1) return;
            if (Math.abs(follower.currentTime - next) > 0.35) follower.currentTime = next;
            follower.playbackRate = speed;
            if (follower.paused && !follower.ended) follower.play().catch(() => {});
          });
          lastSyncRef.current = now;
          tRef.current = next;
          setT(next);
        }
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const elapsed = Math.min((now - lastRef.current) / 1000, 0.25);
      const dt = elapsed * speed;
      lastRef.current = now;
      const next = tRef.current + dt;
      if (next >= duration) {
        if (
          cursorRef.current < queue.length - 1 &&
          (cursorRef.current < purchaseQueue.length - 1 || autoPlayNext)
        ) {
          // end of this folder — the next one starts on its own
          resumeAfterLoadRef.current = true;
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
  }, [playing, speed, duration, queue.length, purchaseQueue.length, hasVideo, active, autoPlayNext]);

  const seek = useCallback((seconds) => {
    const next = Math.min(duration, Math.max(0, seconds));
    tRef.current = next;
    setT(next);
    if (hasVideo) {
      feeds.forEach((feed) => {
        const video = videoRefs.current[feed.id];
        if (video && video.readyState >= 1) video.currentTime = Math.min(next, video.duration || next);
      });
    }
  }, [duration, hasVideo]);

  const nudge = useCallback((delta) => seek(tRef.current + delta), [seek]);

  const goToFolder = useCallback(
    (i) => {
      if (i < 0 || i >= queue.length || (i >= purchaseQueue.length && !autoPlayNext)) return;
      resumeAfterLoadRef.current = playing;
      cursorRef.current = i;
      setCursor(i);
      tRef.current = 0;
      setT(0);
    },
    [queue.length, purchaseQueue.length, autoPlayNext, playing]
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
  }, []);

  const togglePlayback = useCallback(() => {
    resumeAfterLoadRef.current = false;
    if (!hasVideo) {
      setPlaying((value) => !value);
      return;
    }
    if (playing) {
      feeds.forEach((feed) => videoRefs.current[feed.id]?.pause());
      setPlaying(false);
      return;
    }
    const videos = feeds.map((feed) => videoRefs.current[feed.id]).filter(Boolean);
    Promise.all(videos.map((video) => video.play()))
      .then(() => {
        videos.forEach((video) => { video.playbackRate = speed; });
        setPlaying(true);
        setMediaMessage('');
      })
      .catch(() => {
        setPlaying(false);
        setMediaMessage('A camera could not play. Check the connection and press Play to retry.');
      });
  }, [hasVideo, playing, speed]);

  function updateUserMarks(next) {
    setUserMarks(next);
    try {
      localStorage.setItem(`aq-player-marks:${session.id}`, JSON.stringify(next));
    } catch {
      setMediaMessage('This browser could not save timestamps.');
    }
  }

  const pct = duration ? t / duration : 0;
  const activeFeed = feeds.find((f) => f.id === active) || feeds[0];
  const deckFeeds = [activeFeed, ...feeds.filter((feed) => feed.id !== activeFeed.id)];

  const timeLabel =
    clockMode === 'wall'
      ? formatClock(windowStart + t, true)
      : `${formatElapsed(t)} / ${formatElapsed(duration)}`;
  const sessionTitle = videoFolderTitle(barnName || session.barnName || '', session);

  function addMark() {
    const seconds = hasVideo ? videoRefs.current[active]?.currentTime ?? t : t;
    const mark = { id: `${Date.now()}`, seconds, label: `Timestamp ${userMarks.length + 1}` };
    tRef.current = seconds;
    setT(seconds);
    updateUserMarks([...userMarks, mark]);
    setEditingMark(mark.id);
    setMarkLabel(mark.label);
  }

  function saveMarkLabel(e) {
    e.preventDefault();
    updateUserMarks(userMarks.map((mark) => mark.id === editingMark ? { ...mark, label: markLabel.trim() || mark.label } : mark));
    setEditingMark(null);
  }

  function deleteMark(id) {
    updateUserMarks(userMarks.filter((mark) => mark.id !== id));
    if (editingMark === id) setEditingMark(null);
  }

  function onStripClick(e) {
    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;
    seek(((e.clientX - rect.left) / rect.width) * duration);
  }

  return (
    <div
      ref={rootRef}
      className={`bg-ink text-oat border border-brass/20 overflow-hidden shadow-rail flex flex-col ${
        isFullscreen
          ? 'h-[100svh] rounded-none p-3 md:p-5'
          : 'h-[min(88svh,960px)] min-h-[560px] rounded-2xl lg:h-[min(960px,88svh)] lg:min-h-[650px]'
      }`}
    >
      {/* -- context bar ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-brass/15 bg-navy-panel/60">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="min-w-0 truncate font-label text-[0.72rem] uppercase tracking-[0.1em] text-hermes-light"
            title={sessionTitle}
          >
            {sessionTitle}
          </span>
          {(purchaseQueue.length > 1 || (autoPlayNext && queue.length > 1)) && (
            <>
              <span className="w-px h-4 bg-oat/15" aria-hidden="true" />
              <span className="text-[0.78rem] text-hermes-light whitespace-nowrap">
                Playing {cursor + 1} of {autoPlayNext ? queue.length : purchaseQueue.length}
                <span className="text-oat/55"> · next starts on its own</span>
              </span>
            </>
          )}
        </div>
        <SyncChip />
      </div>

      {mediaMessage && (
        <p className="px-4 py-2 text-[0.78rem] text-hermes-light" role="status">{mediaMessage}</p>
      )}
      {hasVideo && !videosReady && !mediaMessage && (
        <p className="px-4 py-2 text-[0.78rem] text-oat/60" role="status">Loading all three camera clips…</p>
      )}

      <div className={`grid flex-1 min-h-0 grid-cols-2 gap-2 p-2 md:gap-3 md:p-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] ${
        isFullscreen ? 'grid-rows-[minmax(0,1fr)]' : 'grid-rows-[minmax(0,1fr)_clamp(4rem,12svh,7rem)] md:grid-rows-2'
      }`}>
        {deckFeeds.map((feed, index) => {
          const isActive = feed.id === active;
          const isHidden = isFullscreen && !isActive;
          const placement = isFullscreen
            ? 'col-span-2 row-span-1'
            : isActive
              ? 'col-span-2 row-start-1 md:col-span-1 md:row-span-2'
              : `col-span-1 row-start-2 ${index === 1 ? 'col-start-1 md:col-start-2 md:row-start-1' : 'col-start-2 md:col-start-2 md:row-start-2'}`;
          return (
            <div
              key={feed.id}
              onClick={!isActive ? () => promote(feed.id) : undefined}
              onKeyDown={!isActive ? (e) => (e.key === 'Enter' || e.key === ' ') && promote(feed.id) : undefined}
              role={!isActive ? 'button' : undefined}
              tabIndex={!isActive ? 0 : undefined}
              aria-label={!isActive ? `Show only the ${feed.label} camera` : undefined}
              className={`relative min-h-0 h-full rounded-xl overflow-hidden border border-brass/20 bg-navy-deep ${placement} ${
                isHidden ? 'hidden' : ''
              } ${!isActive ? 'cursor-pointer hover:border-hermes/70' : ''}`}
            >
              {hasVideo ? (
                <video
                  ref={(element) => { if (element) videoRefs.current[feed.id] = element; }}
                  src={session.videos[feed.id]}
                  poster={feed.poster}
                  preload="auto"
                  muted
                  playsInline
                  onLoadedMetadata={(e) => {
                    const { duration: videoDuration } = e.currentTarget;
                    if (Number.isFinite(videoDuration)) {
                      setMediaDurations((current) => ({ ...current, [feed.id]: videoDuration }));
                    }
                  }}
                  onError={() => setMediaMessage(`${feed.label} could not load. Check the connection and retry.`)}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <img src={feed.poster} alt="" className="absolute inset-0 w-full h-full object-contain" />
              )}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/45 via-transparent to-ink/20" />
              <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink/70 backdrop-blur-sm px-2.5 py-1 font-label text-[0.62rem] uppercase tracking-[0.16em] text-oat/85">
                {feed.label} · {feed.angle}
              </span>
              <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 font-label text-[0.62rem] tabular-nums text-oat/85">
                {feed.resolution}
              </span>
              {isActive && (
                <span className="absolute top-3 right-3 rounded-full bg-ink/70 backdrop-blur-sm px-2.5 py-1 font-label text-[0.68rem] tabular-nums text-oat/85">
                  {timeLabel}
                </span>
              )}
              {isActive && !playing && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-16 h-16 rounded-full bg-ink/55 backdrop-blur-sm border border-oat/20 flex items-center justify-center">
                    <i className="ph-fill ph-play text-2xl text-oat/90 ml-0.5" />
                  </span>
                </span>
              )}
              {isFullscreen && isActive && (
                <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    aria-label="Previous camera angle"
                    onClick={(e) => { e.stopPropagation(); promote(feeds[(feeds.findIndex((item) => item.id === active) + feeds.length - 1) % feeds.length].id); }}
                    className="w-10 h-10 rounded-full bg-ink/70 text-oat flex items-center justify-center pointer-events-auto"
                  >
                    <i className="ph-bold ph-caret-left" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next camera angle"
                    onClick={(e) => { e.stopPropagation(); promote(feeds[(feeds.findIndex((item) => item.id === active) + 1) % feeds.length].id); }}
                    className="w-10 h-10 rounded-full bg-ink/70 text-oat flex items-center justify-center pointer-events-auto"
                  >
                    <i className="ph-bold ph-caret-right" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* -- transport ------------------------------------------------------ */}
      <div className="px-3 md:px-6 pb-5 pt-1">
        {/* jump-to chips, seeded from the barn schedule */}
        <div className="flex flex-nowrap items-center gap-2 mb-2 overflow-x-auto">
          <span className="font-label text-[0.6rem] uppercase tracking-[0.18em] text-oat/55 mr-1">
            Jump to
          </span>
          {allMarks.map((m, i) => (
            <div key={m.id || `${m.label}-${i}`} className="inline-flex items-center rounded-full border border-oat/15 overflow-hidden text-[0.68rem]">
              {editingMark === m.id ? (
                <form onSubmit={saveMarkLabel} className="inline-flex items-center gap-1 p-1">
                  <input
                    autoFocus
                    value={markLabel}
                    onChange={(e) => setMarkLabel(e.target.value)}
                    aria-label="Timestamp name"
                    className="w-28 bg-transparent px-1 text-oat focus:outline-none"
                  />
                  <button type="submit" className="px-2 py-1 text-hermes-light">Save</button>
                </form>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => seek(m.at * duration)}
                    className={`px-2.5 py-1 transition-colors ${m.owner === 'user' ? 'text-hermes hover:bg-hermes/10' : 'text-oat/60 hover:text-hermes-light'}`}
                  >
                    {formatClock(windowStart + m.at * duration)} · {m.label}
                  </button>
                  {m.owner === 'user' && (
                    <>
                      <button
                        type="button"
                        aria-label={`Rename ${m.label}`}
                        title="Rename timestamp"
                        onClick={() => { setEditingMark(m.id); setMarkLabel(m.label); }}
                        className="px-1.5 py-1 text-oat/50 hover:text-hermes-light"
                      ><i className="ph-bold ph-pencil-simple" /></button>
                      <button
                        type="button"
                        aria-label={`Delete ${m.label}`}
                        title="Delete timestamp"
                        onClick={() => deleteMark(m.id)}
                        className="px-1.5 py-1 pr-2.5 text-oat/50 hover:text-hermes-light"
                      ><i className="ph-bold ph-x" /></button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* activity strip + scrub track */}
        <div
          ref={stripRef}
          onClick={onStripClick}
          className="relative h-11 cursor-pointer select-none"
          role="presentation"
        >
          <div className="absolute inset-x-0 top-2 h-1.5 rounded-full bg-oat/15 overflow-hidden">
            <div className="h-full bg-brass/60" style={{ width: `${pct * 100}%` }} />
          </div>

          {allMarks.map((m, i) => (
            <span
              key={`pin-${i}`}
              title={m.label}
              className={`absolute top-0 w-[3px] h-5 rounded-full pointer-events-none ${
                m.kind === 'mine' ? 'bg-hermes' : 'bg-brass'
              }`}
              style={{ left: `${m.at * 100}%` }}
            />
          ))}

          <span
            className="absolute top-0 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-hermes border-2 border-oat pointer-events-none"
            style={{ left: `${pct * 100}%`, boxShadow: '0 0 0 4px rgba(243,112,33,0.2)' }}
          />

          <div className="absolute inset-x-0 bottom-0 flex justify-between font-label text-[0.6rem] text-oat/55 tabular-nums">
            <span>{clockMode === 'wall' ? formatClock(windowStart) : formatElapsed(0)}</span>
            <span>{clockMode === 'wall' ? formatClock(windowStart + duration * 0.5) : formatElapsed(duration * 0.5)}</span>
            <span>{clockMode === 'wall' ? formatClock(windowStart + duration) : formatElapsed(duration)}</span>
          </div>
        </div>

        {queue.length > 1 && (
          <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Folders in this purchase, in order">
            {purchaseQueue.map((q, i) => (
              <li key={q.id} className="min-w-[105px] flex-1">
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
        <div className="mt-2 flex flex-wrap lg:flex-nowrap items-center gap-1.5 md:gap-2">
          <div className="flex items-center gap-1.5">
            <Ctl label="Back 10 seconds" icon="ph-bold ph-arrow-counter-clockwise" onClick={() => nudge(-10)} />
            <button
              type="button"
              onClick={togglePlayback}
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

          <select
            value={speed}
            onChange={(e) => {
              const nextSpeed = Number(e.target.value);
              setSpeed(nextSpeed);
              feeds.forEach((feed) => {
                const video = videoRefs.current[feed.id];
                if (video) video.playbackRate = nextSpeed;
              });
            }}
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
            onClick={addMark}
            className="px-3 py-1.5 rounded-full border border-oat/15 text-oat/70 hover:border-hermes hover:text-hermes-light font-label text-[0.72rem] transition-colors"
          >
            <i className="ph-bold ph-map-pin mr-1.5" />
            Add timestamp
          </button>

          <VideoDownloadButton
            folder={session}
            buttonLabel="Download"
            buttonClassName="w-9 h-9 rounded-full border border-oat/15 text-oat/70 hover:text-hermes-light hover:border-hermes flex items-center justify-center transition-colors"
          >
            <i className="ph-bold ph-download-simple text-sm" />
          </VideoDownloadButton>
          <Ctl
            label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            icon={isFullscreen ? 'ph-bold ph-corners-in' : 'ph-bold ph-corners-out'}
            onClick={toggleFullscreen}
          />
        </div>
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
      <img src={feed.poster} alt="" className="w-full h-full object-contain" />
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
      <img src={feed.poster} alt="" className="w-full h-full object-contain" />
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
