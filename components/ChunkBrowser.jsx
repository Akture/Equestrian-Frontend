'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BARN_HOURS,
  CHUNK_MINUTES,
  MAX_CHUNKS_PER_PURCHASE,
  PURCHASE_WINDOW_HOURS,
  days,
  minutesToClock,
  money,
  priceForChunks,
} from '@/lib/rides';

// The purchase page for one arena. The list is already full when you land —
// everything recorded in the last 48 hours — and the filters narrow it.
// Select up to four chunks in a row and the price follows the tier.
export default function ChunkBrowser({ barnSlug, arenaSlug, chunksByDay, ownedIds }) {
  const [dayKey, setDayKey] = useState(days[0].key);
  const [fromMin, setFromMin] = useState(BARN_HOURS.start);
  const [toMin, setToMin] = useState(BARN_HOURS.end);
  const [selected, setSelected] = useState([]); // chunk ids, contiguous, in order
  const [discount, setDiscount] = useState('');
  const [note, setNote] = useState('');

  const timeOptions = useMemo(() => {
    const out = [];
    for (let m = BARN_HOURS.start; m <= BARN_HOURS.end; m += CHUNK_MINUTES) out.push(m);
    return out;
  }, []);

  const all = chunksByDay[dayKey] || [];
  const visible = all.filter((c) => c.startMin >= fromMin && c.endMin <= toMin);
  const owned = new Set(ownedIds);

  const selectedChunks = selected.map((id) => all.find((c) => c.id === id)).filter(Boolean);
  const price = selectedChunks.length ? priceForChunks(selectedChunks.length) : 0;
  const range = selectedChunks.length
    ? `${selectedChunks[0].start}–${selectedChunks[selectedChunks.length - 1].end}`
    : '';

  function flash(msg) {
    setNote(msg);
    setTimeout(() => setNote(''), 3000);
  }

  function toggle(chunk) {
    if (owned.has(chunk.id)) return;
    setNote('');
    const idx = selected.indexOf(chunk.id);
    if (idx !== -1) {
      // clicking a selected chunk clears from it to the end of the run
      setSelected(selected.slice(0, idx));
      return;
    }
    if (!selected.length) {
      setSelected([chunk.id]);
      return;
    }
    const last = all.find((c) => c.id === selected[selected.length - 1]);
    const first = all.find((c) => c.id === selected[0]);
    const extendsEnd = last && chunk.startMin === last.endMin;
    const extendsStart = first && chunk.endMin === first.startMin;
    if (!extendsEnd && !extendsStart) {
      setSelected([chunk.id]);
      return;
    }
    if (selected.length >= MAX_CHUNKS_PER_PURCHASE) {
      flash(`An hour is the most you can buy at once — ${MAX_CHUNKS_PER_PURCHASE} chunks.`);
      return;
    }
    setSelected(extendsEnd ? [...selected, chunk.id] : [chunk.id, ...selected]);
  }

  function changeDay(k) {
    setDayKey(k);
    setSelected([]);
  }

  return (
    <div>
      {/* filters ------------------------------------------------------ */}
      <div className="rounded-2xl border border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03] p-4 flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="font-label text-[0.6rem] uppercase tracking-[0.18em] text-ink/60 dark:text-oat/55 mr-1">
            Day
          </span>
          {days.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => changeDay(d.key)}
              className={`px-3.5 py-1.5 rounded-full font-label text-[0.76rem] border transition-colors ${
                dayKey === d.key
                  ? 'border-hermes bg-hermes/15 text-hermes-ink dark:text-hermes-light'
                  : 'border-ink/15 dark:border-oat/15 text-ink/65 dark:text-oat/55 hover:border-hermes/60'
              }`}
            >
              {d.short} · {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:border-l lg:border-ink/10 lg:dark:border-oat/10 lg:pl-4">
          <span className="font-label text-[0.6rem] uppercase tracking-[0.18em] text-ink/60 dark:text-oat/55 mr-1">
            Between
          </span>
          <TimeSelect value={fromMin} onChange={(v) => setFromMin(Math.min(v, toMin - CHUNK_MINUTES))} options={timeOptions.slice(0, -1)} />
          <span className="text-ink/65 dark:text-oat/55 text-sm">and</span>
          <TimeSelect value={toMin} onChange={(v) => setToMin(Math.max(v, fromMin + CHUNK_MINUTES))} options={timeOptions.slice(1)} />
        </div>

        <span className="lg:ml-auto font-label text-[0.68rem] text-ink/65 dark:text-oat/55">
          {visible.length} of {all.length} · for sale {PURCHASE_WINDOW_HOURS} hours after recording
        </span>
      </div>

      {/* chunk list ---------------------------------------------------- */}
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visible.map((c) => {
          const isOwned = owned.has(c.id);
          const isSel = selected.includes(c.id);
          return (
            <li key={c.id}>
              {isOwned ? (
                <Link
                  href={`/${barnSlug}/${arenaSlug}/watch/${c.id}`}
                  className="block rounded-xl border border-pine-lit/50 bg-pine-lit/10 p-4 hover:border-pine-lit transition-colors"
                >
                  <ChunkBody chunk={c} />
                  <span className="mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] font-semibold text-pine dark:text-pine-lit">
                    Bought · Watch
                    <i className="ph-bold ph-arrow-right text-xs" />
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(c)}
                  aria-pressed={isSel}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${
                    isSel
                      ? 'border-hermes bg-hermes/15'
                      : 'border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03] hover:border-hermes/60'
                  }`}
                >
                  <ChunkBody chunk={c} />
                  <span
                    className={`mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] font-semibold ${
                      isSel ? 'text-hermes-ink dark:text-hermes-light' : 'text-ink/65 dark:text-oat/55'
                    }`}
                  >
                    <i className={`${isSel ? 'ph-fill ph-check-circle' : 'ph ph-circle'} text-sm`} />
                    {isSel ? 'Selected' : 'Select'}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {visible.length === 0 && (
        <p className="mt-6 text-ink/65 dark:text-oat/55 text-[0.92rem]">
          Nothing in that range. Widen the times, or check the other day.
        </p>
      )}

      {/* purchase bar -------------------------------------------------- */}
      <div
        className={`sticky bottom-4 mt-8 rounded-2xl border bg-ink text-oat shadow-rail p-4 md:p-5 transition-all ${
          selectedChunks.length ? 'border-hermes/50 opacity-100' : 'border-oat/15 opacity-90'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 min-w-0">
            {selectedChunks.length ? (
              <>
                <p className="font-display text-xl leading-tight">
                  {selectedChunks.length * CHUNK_MINUTES} minutes · {range}
                </p>
                <p className="mt-1 text-oat/65 text-[0.84rem]">
                  {selectedChunks.length} {selectedChunks.length === 1 ? 'folder' : 'folders'} ·
                  every camera in the arena comes with it · {money(price)}
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-xl leading-tight">Select up to an hour</p>
                <p className="mt-1 text-oat/65 text-[0.84rem]">
                  Pick the chunks you rode in, in a row. A purchase is always every camera in the
                  arena.
                </p>
              </>
            )}
          </div>

          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Discount code"
            aria-label="Discount code"
            className="rounded-full border border-oat/20 bg-transparent px-4 py-2.5 font-label text-[0.8rem] text-oat placeholder:text-oat/55 focus:outline-none focus:border-hermes md:w-40"
          />

          <button
            type="button"
            disabled={!selectedChunks.length}
            onClick={() => flash('Mockup — no payment is taken. In the product this opens checkout.')}
            className="btn-hermes rounded-full px-6 py-3 font-label text-sm font-semibold shadow-hermes-md disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {selectedChunks.length ? `Buy for ${money(price)}` : 'Buy'}
          </button>
        </div>

        {note && (
          <p className="mt-3 font-label text-[0.78rem] text-hermes-light animate-rise" role="status">
            <i className="ph-fill ph-flask mr-1.5" />
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

function ChunkBody({ chunk }) {
  return (
    <>
      <p className="font-label text-[0.86rem] font-semibold text-ink dark:text-oat tabular-nums">
        {chunk.start} – {chunk.end}
      </p>
      <p className="mt-1 text-[0.8rem] leading-snug text-ink/65 dark:text-oat/55">
        {chunk.label || 'Recorded · unlabelled'}
      </p>
    </>
  );
}

function TimeSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-full border border-ink/15 dark:border-oat/20 bg-white dark:bg-ink px-3 py-1.5 font-label text-[0.76rem] text-ink dark:text-oat focus:outline-none focus:border-hermes"
    >
      {options.map((m) => (
        <option key={m} value={m}>
          {minutesToClock(m)}
        </option>
      ))}
    </select>
  );
}
