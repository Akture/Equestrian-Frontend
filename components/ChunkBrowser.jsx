'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { previewVideos } from '@/lib/media';
import {
  CHUNK_MINUTES,
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
              Drag the brackets to the stretch you rode. Every camera in the arena comes with it.
            </p>
          </div>
          <i className="ph ph-clock text-xl text-hermes-ink dark:text-gold" aria-hidden="true" />
        </div>

        <TimeRangeSlider bounds={bounds} value={value} onChange={setWindow} />
      </section>

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

