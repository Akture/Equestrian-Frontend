'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { previewVideos } from '@/lib/media';
import {
  CHUNK_MINUTES,
  MAX_CHUNKS_PER_PURCHASE,
  PURCHASE_WINDOW_HOURS,
  folderNames,
  hoursForDay,
  minutesToClock,
  money,
  priceForChunks,
} from '@/lib/rides';
import { readMockPurchases, writeMockPurchases } from '@/lib/purchaseStore';
import StripeTestCheckout from './StripeTestCheckout';
import TimeRangeSlider from './TimeRangeSlider';

export default function ChunkBrowser({ barnSlug, barnName, dayOptions, chunksByDay, ownedIds }) {
  const router = useRouter();
  const [dayKey, setDayKey] = useState(dayOptions[0]?.key);
  const [window, setWindow] = useState(null);
  const [discount, setDiscount] = useState('');
  const [note, setNote] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [localOwnedIds, setLocalOwnedIds] = useState([]);

  useEffect(() => {
    try {
      setLocalOwnedIds(
        readMockPurchases()
          .filter((purchase) => purchase.barn === barnSlug)
          .map((purchase) => purchase.id)
      );
    } catch (error) {
      setNote(`Saved purchases could not be loaded: ${error.message}`);
    }
  }, [barnSlug]);

  const bounds = hoursForDay(dayKey, dayOptions);
  const all = (chunksByDay[dayKey] || []).slice().sort((a, b) => a.startMin - b.startMin);
  const owned = new Set([...ownedIds, ...localOwnedIds]);
  const byStart = useMemo(() => new Map(all.map((chunk) => [chunk.startMin, chunk])), [all]);

  // Every 15-minute slot of the day, so the track can show what is for sale,
  // what is already bought, and what has not been recorded yet.
  // Where the brackets land when a day opens: the first lesson on the schedule,
  // else the first footage for sale; half an hour when the next slot is there too.
  const defaultWindow = useMemo(() => {
    const first = all.find((chunk) => chunk.label) || all[0];
    if (!first) return { start: bounds.start, end: Math.min(bounds.start + CHUNK_MINUTES, bounds.end) };
    const second = byStart.get(first.startMin + CHUNK_MINUTES);
    return { start: first.startMin, end: first.startMin + (second ? 2 : 1) * CHUNK_MINUTES };
  }, [all, byStart, bounds.start, bounds.end]);
  const value = window || defaultWindow;

  // A press on a segment in the list moves the same window the handles move: a
  // neighbour joins the run, an end segment leaves it, anything else starts a
  // new run there. Past an hour the run slides to keep the pressed segment.
  function pick(chunk) {
    const { startMin: s, endMin: e } = chunk;
    const max = MAX_CHUNKS_PER_PURCHASE * CHUNK_MINUTES;
    let next;
    if (s >= value.start && e <= value.end) {
      if (value.end - value.start === CHUNK_MINUTES) return;
      if (s === value.start) next = { start: e, end: value.end };
      else if (e === value.end) next = { start: value.start, end: s };
      else return;
    } else if (e === value.start) {
      next = { start: s, end: Math.min(value.end, s + max) };
    } else if (s === value.end) {
      next = { start: Math.max(value.start, e - max), end: e };
    } else {
      next = { start: s, end: e };
    }
    setWindow(next);
  }

  const selectedChunks = [];
  let missingSlot = false;
  for (let m = value.start; m < value.end; m += CHUNK_MINUTES) {
    const chunk = byStart.get(m);
    if (chunk) selectedChunks.push(chunk);
    else missingSlot = true;
  }
  const overlapsOwned = selectedChunks.some((chunk) => owned.has(chunk.id));
  const canBuy = selectedChunks.length > 0 && !missingSlot && !overlapsOwned;
  const price = selectedChunks.length ? priceForChunks(selectedChunks.length) : 0;
  const range = `${minutesToClock(value.start)}–${minutesToClock(value.end)}`;

  function flash(message) {
    setNote(message);
    setTimeout(() => setNote(''), 3000);
  }

  function changeDay(key) {
    setDayKey(key);
    setWindow(null);
  }

  function completeTestPurchase(payment) {
    try {
      const existing = readMockPurchases();
      const purchasedAt = new Date().toISOString();
      const purchaseGroup = `${barnSlug}-${selectedChunks[0].arena}-${selectedChunks[0].dayKey}-${Date.now()}`;
      const newFolders = selectedChunks.map((chunk) => ({
        ...chunk,
        arenaName: chunk.arenaName,
        minutes: CHUNK_MINUTES,
        horse: chunk.label || 'Ring footage',
        expires: new Date(new Date(chunk.availableUntil).getTime()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        owned: true,
        videos: previewVideos,
        names: folderNames(chunk, chunk.arenaName),
        purchaseGroup,
        payment: {
          provider: 'stripe-test',
          status: 'succeeded',
          amountCents: Math.round(price * 100),
          last4: payment.last4,
          purchasedAt,
        },
      }));
      const nextPurchases = [
        ...existing.filter((purchase) => !newFolders.some((folder) => folder.id === purchase.id)),
        ...newFolders,
      ];
      writeMockPurchases(nextPurchases);
      setLocalOwnedIds((ids) => [...new Set([...ids, ...newFolders.map((folder) => folder.id)])]);
      setCheckoutOpen(false);
      setWindow(null);
      router.push(`/${barnSlug}/my-videos`);
      return null;
    } catch (error) {
      return `The mock purchase could not be saved: ${error.message}`;
    }
  }

  return (
    <div>
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <section className="rounded-2xl border border-ink/15 bg-white/60 p-4 dark:border-oat/15 dark:bg-ink md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink/65 dark:text-oat/55">
                Choose a day
              </p>
              <p className="mt-1 text-[0.8rem] text-ink/65 dark:text-oat/55">
                Footage from the last {PURCHASE_WINDOW_HOURS} hours
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {dayOptions.map((day) => {
              const count = chunksByDay[day.key]?.length || 0;
              const active = dayKey === day.key;
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => changeDay(day.key)}
                  aria-pressed={active}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    active
                      ? 'border-gold bg-gold/15 text-ink dark:text-gold'
                      : 'border-ink/10 bg-white/50 text-ink/75 hover:border-gold/60 dark:border-oat/10 dark:bg-oat/[0.02] dark:text-oat/75'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block font-label text-[0.82rem] font-semibold">{day.short}</span>
                    <span className="mt-0.5 block text-[0.72rem] text-ink/65 dark:text-oat/55">{day.label}</span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-1 font-label text-[0.65rem] tabular-nums ${active ? 'bg-gold/20' : 'bg-ink/5 dark:bg-oat/10'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mb-8 rounded-2xl border border-ink/15 bg-white/60 p-5 dark:border-oat/15 dark:bg-ink md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink/65 dark:text-oat/55">
              Choose your time
            </p>
            <p className="mt-1 text-[0.8rem] text-ink/65 dark:text-oat/55">
              Drag the handles to select your time, or drag the middle to move the whole window. Every camera in the arena comes with it.
            </p>
          </div>
          <i className="ph ph-clock text-xl text-hermes-ink dark:text-gold" aria-hidden="true" />
        </div>

        <TimeRangeSlider bounds={bounds} value={value} onChange={setWindow} />
      </section>

      <div className="mb-8">
        <p className="mb-4 font-label text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink/65 dark:text-oat/55">
          Or pick segments from the day
        </p>
        {timeOfDaySections.map((section) => {
          const sectionChunks = all.filter((chunk) => section.contains(chunk.startMin));
          return (
            <details
              key={section.label}
              open={section.contains(value.start)}
              className="mb-4 rounded-2xl border border-ink/15 bg-white/40 dark:border-oat/15 dark:bg-ink"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-xl marker:hidden">
                <span>{section.label}</span>
                <span className="inline-flex items-center gap-3 font-label text-[0.72rem] text-ink/65 dark:text-oat/55">
                  {sectionChunks.length} {sectionChunks.length === 1 ? 'segment' : 'segments'}
                  <i className="ph-bold ph-caret-down" aria-hidden="true" />
                </span>
              </summary>
              {sectionChunks.length ? (
                <ol className="grid grid-cols-1 gap-4 border-t border-ink/10 p-4 dark:border-oat/10 sm:grid-cols-2 xl:grid-cols-3">
                  {sectionChunks.map((chunk) => {
                    const isOwned = owned.has(chunk.id);
                    const isSelected = chunk.startMin >= value.start && chunk.endMin <= value.end;
                    const title = segmentTitle(barnName, chunk.arenaName, chunk);
                    const body = <ChunkBody chunk={chunk} title={title} />;
                    return (
                      <li key={chunk.id}>
                        {isOwned ? (
                          <Link
                            href={`/${barnSlug}/${chunk.arena}/watch/${chunk.id}`}
                            title={title}
                            className="block h-full rounded-2xl border border-pine-lit/50 bg-pine-lit/10 p-4 transition-colors hover:border-pine-lit"
                          >
                            {body}
                            <span className="mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] font-semibold text-pine dark:text-pine-lit">
                              Bought · Watch <i className="ph-bold ph-arrow-right text-xs" />
                            </span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => pick(chunk)}
                            aria-pressed={isSelected}
                            title={title}
                            className={`block h-full w-full rounded-2xl border p-4 text-left transition-colors ${
                              isSelected
                                ? 'border-hermes bg-hermes/15'
                                : 'border-ink/15 bg-white/60 hover:border-hermes/60 dark:border-oat/15 dark:bg-oat/[0.03]'
                            }`}
                          >
                            {body}
                            <span className={`mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] font-semibold ${isSelected ? 'text-hermes-ink dark:text-hermes-light' : 'text-ink/65 dark:text-oat/55'}`}>
                              <i className={`${isSelected ? 'ph-fill ph-check-circle' : 'ph ph-circle'} text-sm`} />
                              {isSelected ? 'Selected' : 'Select segment'}
                            </span>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="border-t border-ink/10 px-5 py-4 text-[0.82rem] text-ink/65 dark:border-oat/10 dark:text-oat/55">
                  No {section.label.toLowerCase()} footage for sale on this day.
                </p>
              )}
            </details>
          );
        })}
      </div>

      <div
        className={`sticky bottom-4 mt-8 rounded-2xl border bg-ink p-4 text-oat shadow-rail transition-all md:p-5 ${
          canBuy ? 'border-hermes/50 opacity-100' : 'border-oat/15 opacity-90'
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-tight tabular-nums">
              {value.end - value.start} minutes · {range}
            </p>
            <p className="mt-1 text-[0.84rem] text-oat/65">
              {overlapsOwned
                ? 'Part of this range is already in My Videos.'
                : missingSlot
                  ? 'Part of this range has no footage for sale yet.'
                  : `Three camera angles · ${money(price)}`}
            </p>
          </div>

          <input
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            placeholder="Discount code"
            aria-label="Discount code"
            className="rounded-full border border-oat/20 bg-transparent px-4 py-2.5 font-label text-[0.8rem] text-oat placeholder:text-oat/55 focus:border-hermes focus:outline-none md:w-40"
          />

          <button
            type="button"
            disabled={!canBuy}
            onClick={() => setCheckoutOpen(true)}
            className="btn-hermes whitespace-nowrap rounded-full px-6 py-3 font-label text-sm font-semibold shadow-hermes-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            {canBuy ? `Buy for ${money(price)}` : 'Buy'}
          </button>
        </div>

        {note && (
          <p className="mt-3 font-label text-[0.78rem] text-hermes-light" role="status">
            <i className="ph-fill ph-warning-circle mr-1.5" />{note}
          </p>
        )}
      </div>
      {checkoutOpen && (
        <StripeTestCheckout
          amount={price}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={completeTestPurchase}
        />
      )}
    </div>
  );
}

function segmentTitle(barnName, arenaName, chunk) {
  const date = new Date(`${chunk.iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return `${barnName} (${arenaName}) - ${date} at ${chunk.start} - ${chunk.end} (${chunk.durationMinutes} min)`;
}

function ChunkBody({ chunk, title }) {
  const date = new Date(`${chunk.iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <>
      <p className="break-words font-display text-[1.02rem] leading-snug text-ink dark:text-oat" aria-label={title}>
        {chunk.label || 'Recorded footage'} · {chunk.arenaName}
      </p>
      <p className="mt-2 text-[0.78rem] leading-snug text-ink/65 dark:text-oat/55">
        {date} · {chunk.start}–{chunk.end}
      </p>
    </>
  );
}

const timeOfDaySections = [
  { label: 'Morning', contains: (minute) => minute < 12 * 60 },
  { label: 'Afternoon', contains: (minute) => minute >= 12 * 60 && minute < 17 * 60 },
  { label: 'Evening', contains: (minute) => minute >= 17 * 60 },
];
