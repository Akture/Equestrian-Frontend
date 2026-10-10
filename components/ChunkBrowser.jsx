'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { feeds } from '@/lib/media';
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

export default function ChunkBrowser({ barnSlug, barnName, arenaSlug, arenaName, dayOptions, chunksByDay, ownedIds }) {
  const router = useRouter();
  const [dayKey, setDayKey] = useState('all');
  const [fromMin, setFromMin] = useState(null);
  const [toMin, setToMin] = useState(null);
  const [selected, setSelected] = useState([]);
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
  const timeOptions = useMemo(() => {
    const out = [];
    for (let minute = bounds.start; minute <= bounds.end; minute += CHUNK_MINUTES) out.push(minute);
    return out;
  }, [bounds.start, bounds.end]);

  const all = (dayKey === 'all'
    ? dayOptions.flatMap((day) => chunksByDay[day.key] || [])
    : chunksByDay[dayKey] || []
  ).sort((a, b) => a.startMin - b.startMin || a.recordedAt.localeCompare(b.recordedAt));
  const visible = all
    .filter((chunk) => chunk.startMin >= (fromMin ?? bounds.start) && chunk.endMin <= (toMin ?? bounds.end))
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
  const owned = new Set([...ownedIds, ...localOwnedIds]);

  const selectedChunks = selected.map((id) => all.find((chunk) => chunk.id === id)).filter(Boolean);
  const price = selectedChunks.length ? priceForChunks(selectedChunks.length) : 0;
  const range = selectedChunks.length
    ? `${selectedChunks[0].start}–${selectedChunks[selectedChunks.length - 1].end}`
    : '';

  function flash(message) {
    setNote(message);
    setTimeout(() => setNote(''), 3000);
  }

  function toggle(chunk) {
    if (owned.has(chunk.id)) return;
    setNote('');
    const index = selected.indexOf(chunk.id);
    if (index !== -1) {
      setSelected(selected.slice(0, index));
      return;
    }
    if (!selected.length) {
      setSelected([chunk.id]);
      return;
    }
    const last = all.find((item) => item.id === selected[selected.length - 1]);
    const first = all.find((item) => item.id === selected[0]);
    const extendsEnd = last && last.dayKey === chunk.dayKey && chunk.startMin === last.endMin;
    const extendsStart = first && first.dayKey === chunk.dayKey && chunk.endMin === first.startMin;
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

  function changeDay(key) {
    setDayKey(key);
    setFromMin(null);
    setToMin(null);
    setSelected([]);
  }

  function completeTestPurchase(payment) {
    try {
      const existing = readMockPurchases();
      const purchasedAt = new Date().toISOString();
      const purchaseGroup = `${barnSlug}-${arenaSlug}-${selectedChunks[0].dayKey}-${Date.now()}`;
      const newFolders = selectedChunks.map((chunk) => ({
        ...chunk,
        arenaName,
        minutes: CHUNK_MINUTES,
        horse: chunk.label || 'Arena footage',
        expires: new Date(new Date(chunk.availableUntil).getTime()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        owned: true,
        videos: previewVideos,
        names: folderNames(chunk, arenaName),
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
      setSelected([]);
      router.push(`/${barnSlug}/my-videos`);
      return null;
    } catch (error) {
      return `The mock purchase could not be saved: ${error.message}`;
    }
  }

  const customTimeRange = fromMin !== null || toMin !== null;

  return (
    <div>
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <section className="rounded-2xl border border-ink/15 bg-white/60 p-4 dark:border-oat/15 dark:bg-oat/[0.03] md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink/55 dark:text-oat/55">
                Choose a day
              </p>
              <p className="mt-1 text-[0.8rem] text-ink/60 dark:text-oat/55">
                Footage from the last {PURCHASE_WINDOW_HOURS} hours
              </p>
            </div>
            <i className="ph ph-calendar-blank text-xl text-hermes-ink dark:text-hermes-light" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => changeDay('all')}
              aria-pressed={dayKey === 'all'}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                dayKey === 'all'
                  ? 'border-hermes bg-hermes/15 text-hermes-ink dark:text-hermes-light'
                  : 'border-ink/10 bg-white/50 text-ink/75 hover:border-hermes/60 dark:border-oat/10 dark:bg-oat/[0.02] dark:text-oat/75'
              }`}
            >
              <span className="min-w-0">
                <span className="block font-label text-[0.82rem] font-semibold">All available</span>
                <span className="mt-0.5 block text-[0.72rem] text-ink/55 dark:text-oat/55">Last 48 hours</span>
              </span>
              <span className="shrink-0 rounded-full bg-ink/5 px-2 py-1 font-label text-[0.65rem] tabular-nums dark:bg-oat/10">
                {dayOptions.reduce((total, day) => total + (chunksByDay[day.key]?.length || 0), 0)}
              </span>
            </button>
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
                      ? 'border-hermes bg-hermes/15 text-hermes-ink dark:text-hermes-light'
                      : 'border-ink/10 bg-white/50 text-ink/75 hover:border-hermes/60 dark:border-oat/10 dark:bg-oat/[0.02] dark:text-oat/75'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block font-label text-[0.82rem] font-semibold">{day.short}</span>
                    <span className="mt-0.5 block text-[0.72rem] text-ink/55 dark:text-oat/55">{day.label}</span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-1 font-label text-[0.65rem] tabular-nums ${active ? 'bg-hermes/20' : 'bg-ink/5 dark:bg-oat/10'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-ink/15 bg-white/60 p-4 dark:border-oat/15 dark:bg-oat/[0.03] md:p-5 lg:min-w-[22rem]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink/55 dark:text-oat/55">
                Narrow by time
              </p>
              <p className="mt-1 text-[0.8rem] text-ink/60 dark:text-oat/55">Select a start and end time</p>
            </div>
            <i className="ph ph-clock text-xl text-hermes-ink dark:text-hermes-light" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2">
            <TimeSelect
              label="Start time"
              value={fromMin ?? bounds.start}
              onChange={(value) => {
                setFromMin(Math.min(value, (toMin ?? bounds.end) - CHUNK_MINUTES));
                setSelected([]);
              }}
              options={timeOptions.slice(0, -1)}
            />
            <span className="font-label text-[0.7rem] text-ink/50 dark:text-oat/50">to</span>
            <TimeSelect
              label="End time"
              value={toMin ?? bounds.end}
              onChange={(value) => {
                setToMin(Math.max(value, (fromMin ?? bounds.start) + CHUNK_MINUTES));
                setSelected([]);
              }}
              options={timeOptions.slice(1)}
            />
          </div>
          <div className="mt-3 flex min-h-6 items-center justify-between gap-3">
            <p className="font-label text-[0.7rem] text-ink/60 dark:text-oat/55" aria-live="polite">
              {visible.length} of {all.length} segments
            </p>
            {customTimeRange && (
              <button
                type="button"
                onClick={() => {
                  setFromMin(null);
                  setToMin(null);
                  setSelected([]);
                }}
                className="font-label text-[0.7rem] font-semibold text-hermes-ink underline decoration-hermes/50 underline-offset-4 hover:decoration-hermes dark:text-hermes-light"
              >
                Show full day
              </button>
            )}
          </div>
        </section>
      </div>

      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((chunk) => {
          const isOwned = owned.has(chunk.id);
          const isSelected = selected.includes(chunk.id);
          const title = segmentTitle(barnName, arenaName, chunk);
          return (
            <li key={chunk.id}>
              {isOwned ? (
                <Link
                  href={`/${barnSlug}/${arenaSlug}/watch/${chunk.id}`}
                  className="block h-full overflow-hidden rounded-2xl border border-pine-lit/50 bg-pine-lit/10 transition-colors hover:border-pine-lit"
                >
                  <SegmentThumbnail chunk={chunk} />
                  <div className="p-4">
                    <ChunkBody chunk={chunk} title={title} />
                    <span className="mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] font-semibold text-pine dark:text-pine-lit">
                      Bought · Watch <i className="ph-bold ph-arrow-right text-xs" />
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(chunk)}
                  aria-pressed={isSelected}
                  className={`block h-full w-full overflow-hidden rounded-2xl border text-left transition-colors ${
                    isSelected
                      ? 'border-hermes bg-hermes/15'
                      : 'border-ink/15 bg-white/60 hover:border-hermes/60 dark:border-oat/15 dark:bg-oat/[0.03]'
                  }`}
                >
                  <SegmentThumbnail chunk={chunk} />
                  <span className="block p-4">
                    <ChunkBody chunk={chunk} title={title} />
                    <span className={`mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] font-semibold ${isSelected ? 'text-hermes-ink dark:text-hermes-light' : 'text-ink/65 dark:text-oat/55'}`}>
                      <i className={`${isSelected ? 'ph-fill ph-check-circle' : 'ph ph-circle'} text-sm`} />
                      {isSelected ? 'Selected' : 'Select segment'}
                    </span>
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {visible.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-ink/20 p-8 text-center dark:border-oat/20">
          <p className="font-display text-lg">No footage available for sale in this range</p>
          <p className="mt-2 text-[0.86rem] text-ink/60 dark:text-oat/55">
            Footage is listed for up to 48 hours after recording. Try another day or show the full day.
          </p>
        </div>
      )}

      <div
        className={`sticky bottom-4 mt-8 rounded-2xl border bg-ink p-4 text-oat shadow-rail transition-all md:p-5 ${
          selectedChunks.length ? 'border-hermes/50 opacity-100' : 'border-oat/15 opacity-90'
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            {selectedChunks.length ? (
              <>
                <p className="font-display text-xl leading-tight">
                  {selectedChunks.length * CHUNK_MINUTES} minutes · {range}
                </p>
                <p className="mt-1 text-[0.84rem] text-oat/65">
                  {selectedChunks.length} {selectedChunks.length === 1 ? 'segment' : 'segments'} · three camera angles · {money(price)}
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-xl leading-tight">Select up to 60 minutes</p>
                <p className="mt-1 text-[0.84rem] text-oat/65">
                  Choose up to four consecutive 15-minute segments.
                </p>
              </>
            )}
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
            disabled={!selectedChunks.length}
            onClick={() => setCheckoutOpen(true)}
            className="btn-hermes whitespace-nowrap rounded-full px-6 py-3 font-label text-sm font-semibold shadow-hermes-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            {selectedChunks.length ? `Buy for ${money(price)}` : 'Buy'}
          </button>
        </div>

        {note && (
          <p className="mt-3 font-label text-[0.78rem] text-hermes-light" role="status">
            <i className="ph-fill ph-flask mr-1.5" />{note}
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

function SegmentThumbnail({ chunk }) {
  return (
    <div className="relative grid aspect-video grid-cols-[2fr_1fr] grid-rows-2 gap-1 overflow-hidden bg-ink">
      {feeds.map((feed, index) => (
        <div key={feed.id} className={`relative min-h-0 overflow-hidden ${index === 0 ? 'row-span-2' : ''}`}>
          <img
            src={index === 0 ? chunk.thumbnailUrl : feed.poster}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-ink/25" />
          <span className="absolute bottom-1 left-1.5 font-label text-[0.52rem] uppercase tracking-[0.1em] text-white">
            {feed.label}
          </span>
        </div>
      ))}
      <span className="absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-1 font-label text-[0.62rem] font-semibold text-white">
        {chunk.durationMinutes} min
      </span>
    </div>
  );
}

function ChunkBody({ chunk, title }) {
  return (
    <>
      <p className="break-words font-display text-[1.02rem] leading-snug text-ink dark:text-oat">
        {title}
      </p>
      <p className="mt-2 text-[0.78rem] leading-snug text-ink/60 dark:text-oat/55">
        {chunk.label || 'Recorded footage'}{chunk.discipline ? ` · ${chunk.discipline}` : ''}
      </p>
    </>
  );
}

function TimeSelect({ label, value, onChange, options }) {
  return (
    <label className="min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <span className="relative block">
        <i className="ph ph-clock absolute left-3 top-1/2 -translate-y-1/2 text-sm text-hermes-ink dark:text-hermes-light" aria-hidden="true" />
        <select
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full appearance-none rounded-xl border border-ink/15 bg-white py-3 pl-9 pr-8 font-label text-[0.78rem] font-semibold text-ink focus:border-hermes focus:outline-none focus:ring-2 focus:ring-hermes/20 dark:border-oat/20 dark:bg-ink dark:text-oat"
        >
          {options.map((minute) => (
            <option key={minute} value={minute}>{minutesToClock(minute)}</option>
          ))}
        </select>
        <i className="ph ph-caret-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50 dark:text-oat/50" aria-hidden="true" />
      </span>
    </label>
  );
}
