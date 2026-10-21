'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import VideoDownloadButton from './VideoDownloadButton';
import { feeds } from '@/lib/media';
import { CHUNK_MINUTES } from '@/lib/rides';
import { readMockPurchases } from '@/lib/purchaseStore';

// My Videos. Every purchase is a run of 15-minute folders, three angle files in
// each. Rename, delete and combine work for real in this browser's storage so
// the flow can be walked; downloads are packaged as ZIP archives in the browser.
const KEY = 'aq-mock-my-videos';

function formatPurchaseDate(iso, fallback) {
  if (!iso) return fallback;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch (e) {
    return null;
  }
}
function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* private browsing */
  }
}

export default function MyVideosBoard({ barnSlug, folders }) {
  // state = { names: {id: displayName}, fileNames: {id: {angleId: label}}, deleted: [id], combined: [{...}] }
  const [state, setState] = useState({ names: {}, fileNames: {}, deleted: [], combined: [] });
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null); // folder id being renamed
  const [editingFile, setEditingFile] = useState(null); // `${id}:${angle}`
  const [note, setNote] = useState('');
  const [purchasedFolders, setPurchasedFolders] = useState([]);
  const [purchaseLoadError, setPurchaseLoadError] = useState('');

  useEffect(() => {
    const s = load();
    if (s) setState({ names: {}, fileNames: {}, deleted: [], combined: [], ...s });
    try {
      setPurchasedFolders(readMockPurchases().filter((purchase) => purchase.barn === barnSlug));
    } catch (error) {
      setPurchaseLoadError(`New purchases could not be loaded: ${error.message}`);
    }
  }, [barnSlug]);

  function commit(next) {
    setState(next);
    save(next);
  }
  function flash(msg) {
    setNote(msg);
    setTimeout(() => setNote(''), 3200);
  }

  const live = useMemo(
    () => [...folders, ...purchasedFolders]
      .filter((folder, index, all) => all.findIndex((item) => item.id === folder.id) === index)
      .filter((f) => !state.deleted.includes(f.id)),
    [folders, purchasedFolders, state.deleted]
  );

  // Keep every folder together under the date it was recorded.
  const groups = useMemo(() => {
    const map = new Map();
    for (const f of live) {
      const key = f.iso || f.dayKey || f.dateLabel;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(f);
    }
    return [...map.entries()]
      .map(([key, items]) => ({
        key,
        label: formatPurchaseDate(items[0].iso, items[0].dateLabel),
        items: items.sort((a, b) => a.startMin - b.startMin || a.arenaName.localeCompare(b.arenaName)),
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [live]);

  const displayName = (f) => state.names[f.id] || f.names.display;
  const fileLabel = (f, a) => state.fileNames[f.id]?.[a.id] || a.label;

  function toggleSelect(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function rename(id, value) {
    const names = { ...state.names, [id]: value.trim() || undefined };
    commit({ ...state, names });
    setEditing(null);
  }
  function renameFile(id, angleId, value) {
    const fileNames = { ...state.fileNames, [id]: { ...(state.fileNames[id] || {}), [angleId]: value.trim() || undefined } };
    commit({ ...state, fileNames });
    setEditingFile(null);
  }
  function remove(ids) {
    commit({ ...state, deleted: [...new Set([...state.deleted, ...ids])] });
    setSelected((s) => s.filter((x) => !ids.includes(x)));
    flash(`${ids.length === 1 ? 'Folder' : `${ids.length} folders`} removed from this browser's My Videos.`);
  }

  // Combine: two to four selected folders, consecutive, from one purchase.
  function combine() {
    const picked = live.filter((f) => selected.includes(f.id)).sort((a, b) => a.startMin - b.startMin);
    if (picked.length < 2 || picked.length > 4) {
      flash('Select two to four folders in a row to combine them.');
      return;
    }
    const oneGroup = picked.every((f) => f.purchaseGroup === picked[0].purchaseGroup);
    const consecutive = picked.every((f, i) => i === 0 || f.startMin === picked[i - 1].endMin);
    if (!oneGroup || !consecutive) {
      flash('Combined folders have to be next to each other in the same purchase.');
      return;
    }
    const first = picked[0], last = picked[picked.length - 1];
    const entry = {
      id: `${first.purchaseGroup}-combined-${first.startMin}`,
      display: `${first.arenaName} · ${first.dateLabel} · ${first.start}–${last.end} (combined)`,
      zip: first.names.zip.replace(/_\d{4}-\d{4}_/, `_${String(Math.floor(first.startMin / 60)).padStart(2, '0')}${String(first.startMin % 60).padStart(2, '0')}-${String(Math.floor(last.endMin / 60)).padStart(2, '0')}${String(last.endMin % 60).padStart(2, '0')}_`).replace('.zip', '_Combined.zip'),
      minutes: picked.length * CHUNK_MINUTES,
      sourceIds: picked.map((f) => f.id),
      watchHref: `/${barnSlug}/${first.arena}/watch/${first.id}`,
      expires: first.expires,
    };
    commit({ ...state, combined: [...state.combined, entry] });
    setSelected([]);
    flash('Combined in this browser. In the product this runs on the server once and replaces the folders.');
  }

  const anySelected = selected.length > 0;

  return (
    <div>
      <p className="mb-8 max-w-3xl text-[0.9rem] leading-relaxed text-ink/65 dark:text-oat/60">
        Use Autoplay to watch a full day in sequence, or Download day to save every timestamp together.
      </p>
      {purchaseLoadError && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-[0.84rem] text-red-700 dark:text-red-300" role="alert">
          {purchaseLoadError}
        </p>
      )}
      {/* toolbar ------------------------------------------------------ */}
      {(anySelected || note) && (
        <div className="rounded-2xl border border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03] p-3 flex flex-wrap items-center gap-2 mb-8">
          {anySelected && (
            <span className="font-label text-[0.72rem] text-ink/65 dark:text-oat/55 mr-2">
              {selected.length} selected
            </span>
          )}
          <button
            type="button"
            disabled={!anySelected}
            onClick={combine}
            className="rounded-full border border-hermes/60 px-4 py-2 font-label text-[0.78rem] font-semibold text-hermes-ink dark:text-hermes-light hover:bg-hermes/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ph-bold ph-git-merge mr-1.5" />
            Combine
          </button>
          <VideoDownloadButton
            folders={live.filter((folder) => selected.includes(folder.id))}
            buttonLabel="Download"
            buttonClassName="rounded-full border border-ink/15 dark:border-oat/20 px-4 py-2 font-label text-[0.78rem] font-semibold text-ink/75 dark:text-oat/75 hover:border-hermes disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ph-bold ph-download-simple mr-1.5" />
            Download
          </VideoDownloadButton>
          <button
            type="button"
            disabled={!anySelected}
            onClick={() => remove(selected)}
            className="rounded-full border border-ink/15 dark:border-oat/20 px-4 py-2 font-label text-[0.78rem] font-semibold text-ink/75 dark:text-oat/75 hover:border-hermes disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ph-bold ph-trash mr-1.5" />
            Delete
          </button>
          {note && (
            <span className="basis-full mt-1 font-label text-[0.74rem] text-hermes-ink dark:text-hermes-light animate-rise" role="status">
              {note}
            </span>
          )}
        </div>
      )}

      {/* combined entries ---------------------------------------------- */}
      {state.combined.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-xl mb-4">Combined</h2>
          <ul className="space-y-3">
            {state.combined.map((c) => (
              <li key={c.id} className="rounded-2xl border border-hermes/40 bg-hermes/5 p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg">{c.display}</p>
                  <p className="font-label text-[0.72rem] text-ink/65 dark:text-oat/55 mt-1 truncate">{c.zip}</p>
                  <p className="text-ink/60 dark:text-oat/55 text-[0.8rem] mt-1">
                    {c.minutes} minutes · {c.sourceIds.length} folders · comes down {c.expires}
                  </p>
                </div>
                <Link href={c.watchHref} className="btn-hermes rounded-full px-5 py-2.5 font-label text-[0.82rem] font-semibold text-center">
                  Watch
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* purchases ------------------------------------------------------ */}
      {groups.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/20 dark:border-oat/20 p-16 text-center">
          <p className="font-display text-xl mb-3">Your purchases will show here</p>
          <p className="text-ink/65 dark:text-oat/55 text-[0.92rem]">Buy a chunk from one of your barn’s arenas and it will show up here.</p>
        </div>
      )}

      {groups.map((g) => {
        const first = g.items[0];
        return (
          <section key={g.key} className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-ink/15 dark:border-oat/15 pb-4">
              <h2 className="font-display text-xl md:text-2xl">{g.label}</h2>
              <Link
                href={`/${barnSlug}/${first.arena}/watch/${first.id}?autoplay=1&queue=${encodeURIComponent(g.items.map((item) => item.id).join(','))}`}
                className="inline-flex shrink-0 items-center gap-2 btn-hermes rounded-full px-5 py-2.5 font-label text-[0.82rem] font-semibold"
              >
                <i className="ph-fill ph-play text-xs" />
                Autoplay
              </Link>
              <VideoDownloadButton
                folders={g.items}
                buttonLabel="Download day"
                buttonClassName="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 font-label text-[0.82rem] font-semibold text-ink/75 transition-colors hover:border-hermes dark:border-oat/20 dark:text-oat/75"
              >
                <i className="ph-bold ph-download-simple text-sm" />
                Download day
              </VideoDownloadButton>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {g.items.map((f) => {
                const isSel = selected.includes(f.id);
                return (
                  <li
                    key={f.id}
                    className={`rounded-2xl border overflow-hidden transition-colors ${
                      isSel ? 'border-hermes bg-hermes/10' : 'border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03]'
                    }`}
                  >
                    <FolderThumbnail selected={isSel} onSelect={() => toggleSelect(f.id)} />
                    <div className="p-4">
                      <div className="flex items-start gap-2">
                        {editing === f.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              rename(f.id, new FormData(e.currentTarget).get('name'));
                            }}
                            className="flex min-w-0 flex-1 gap-2"
                          >
                            <input
                              name="name"
                              defaultValue={displayName(f)}
                              autoFocus
                              className="flex-1 min-w-0 rounded-lg border border-hermes bg-white dark:bg-ink px-3 py-1.5 text-[0.9rem] focus:outline-none"
                            />
                            <button type="submit" className="btn-hermes rounded-lg px-3 font-label text-[0.72rem] font-semibold">Save</button>
                          </form>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="break-words font-display text-lg leading-snug">{displayName(f)}</p>
                              <p className="mt-1 text-[0.78rem] text-ink/60 dark:text-oat/55">{f.horse}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditing(f.id)}
                              aria-label="Rename folder"
                              className="shrink-0 w-8 h-8 rounded-full border border-ink/15 dark:border-oat/20 text-ink/60 dark:text-oat/55 hover:border-hermes hover:text-hermes-ink dark:hover:text-hermes-light flex items-center justify-center transition-colors"
                            >
                              <i className="ph-bold ph-pencil-simple text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                      <details className="mt-3 border-t border-ink/10 dark:border-oat/10 pt-3">
                        <summary className="cursor-pointer font-label text-[0.68rem] text-ink/60 dark:text-oat/55">Folder files</summary>
                        <ul className="mt-2 space-y-1.5">
                          {f.names.files.map((a) => {
                            const k = `${f.id}:${a.id}`;
                            return (
                              <li key={a.id} className="flex items-center gap-2 text-[0.8rem]">
                                {editingFile === k ? (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      renameFile(f.id, a.id, new FormData(e.currentTarget).get('name'));
                                    }}
                                    className="flex min-w-0 flex-1 gap-2"
                                  >
                                    <input name="name" defaultValue={fileLabel(f, a)} autoFocus className="flex-1 min-w-0 rounded-md border border-hermes bg-white dark:bg-ink px-2 py-1 text-[0.8rem] focus:outline-none" />
                                    <button type="submit" className="btn-hermes rounded-md px-2 font-label text-[0.66rem] font-semibold">Save</button>
                                  </form>
                                ) : (
                                  <>
                                    <span className="text-ink/80 dark:text-oat/75 w-24 shrink-0">{fileLabel(f, a)}</span>
                                    <span className="font-label text-[0.66rem] text-ink/65 dark:text-oat/55 truncate flex-1">{a.filename}</span>
                                    <button
                                      type="button"
                                      onClick={() => setEditingFile(k)}
                                      aria-label={`Rename ${a.label}`}
                                      className="shrink-0 text-ink/65 dark:text-oat/55 hover:text-hermes-ink dark:hover:text-hermes-light"
                                    >
                                      <i className="ph-bold ph-pencil-simple text-[0.66rem]" />
                                    </button>
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </details>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Link
                            href={`/${barnSlug}/${f.arena}/watch/${f.id}`}
                            className="btn-hermes rounded-full px-4 py-2 font-label text-[0.76rem] font-semibold"
                          >
                            Watch
                          </Link>
                          <VideoDownloadButton
                            folder={f}
                            buttonLabel="Download"
                            buttonClassName="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 font-label text-[0.76rem] font-semibold text-ink/75 transition-colors hover:border-hermes dark:border-oat/20 dark:text-oat/75"
                          >
                            <i className="ph-bold ph-download-simple text-sm" />
                            Download
                          </VideoDownloadButton>
                          <button
                            type="button"
                            onClick={() => remove([f.id])}
                            className="rounded-full border border-ink/15 dark:border-oat/20 px-4 py-2 font-label text-[0.76rem] font-semibold text-ink/75 dark:text-oat/75 hover:border-hermes transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

    </div>
  );
}

function FolderThumbnail({ selected, onSelect }) {
  return (
    <div className="relative grid aspect-video grid-cols-[2fr_1fr] grid-rows-2 gap-1 overflow-hidden bg-ink">
      {feeds.map((feed, index) => (
        <div
          key={feed.id}
          className={`relative min-h-0 overflow-hidden ${index === 0 ? 'row-span-2' : ''}`}
        >
          <img src={feed.poster} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-ink/25" />
          <span className="absolute bottom-1 left-1.5 font-label text-[0.52rem] uppercase tracking-[0.1em] text-white">
            {feed.label}
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={selected ? 'Deselect folder' : 'Select folder'}
        className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border ${
          selected ? 'border-hermes bg-hermes text-ink' : 'border-white/70 bg-ink/60 text-white'
        }`}
      >
        {selected && <i className="ph-bold ph-check text-xs" />}
      </button>
    </div>
  );
}
