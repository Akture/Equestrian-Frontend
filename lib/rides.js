// MOCK DATA. The unit of everything here is the 15-minute chunk.
import { previewVideos } from './media';
//
// Facts from the team, as of 9/22:
//   · footage is for sale for 48 hours after it is recorded
//   · a purchase is one to four contiguous chunks (an hour, max) and is
//     always every camera in the arena
//   · a purchase arrives as one folder per chunk, three angle files in each
//   · purchases are kept for a limited time (duration TBD); download to keep
//
// Dates are fixed strings, not computed, so the server and client render the
// same thing and the mockup reads identically every time. "Today" is Sep 16.

export const CHUNK_MINUTES = 15;
export const MAX_CHUNKS_PER_PURCHASE = 4;
export const PURCHASE_WINDOW_HOURS = 48;
export const BARN_HOURS = { start: 7 * 60, end: 20 * 60 }; // minutes of day

// The two days inside the 48-hour window, newest first.
export const days = [
  { key: '0916', label: 'Tue, Sep 16', short: 'Today', iso: '2026-09-16' },
  { key: '0915', label: 'Mon, Sep 15', short: 'Yesterday', iso: '2026-09-15' },
];

// Tier pricing over contiguous chunks. From Aryan's proposal in the thread.
export const tiers = [
  { chunks: 1, minutes: 15, label: '0–15 min', price: 15.99 },
  { chunks: 2, minutes: 30, label: '16–30 min', price: 24.99 },
  { chunks: 4, minutes: 60, label: '31–60 min', price: 39.99 },
];

export function priceForChunks(n) {
  if (n <= 1) return tiers[0].price;
  if (n === 2) return tiers[1].price;
  return tiers[2].price;
}

export function money(n) {
  return `$${n.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Clock helpers — minutes-of-day in, labels out.
export function minutesToClock(m) {
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

export function minutesToHHMM(m) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// What the cameras saw. Labelled ranges are the barn's schedule; everything
// else inside barn hours was recorded too, just unlabelled.
const schedule = {
  'aubreymeadows/covered': {
    '0916': [
      { start: 9 * 60, end: 9 * 60 + 30, label: 'Private lesson', discipline: 'Equitation' },
      { start: 10 * 60, end: 11 * 60, label: 'Flatwork group', discipline: 'Hunter' },
      { start: 16 * 60, end: 17 * 60, label: 'Group lesson — gymnastics', discipline: 'Jumper' },
      { start: 17 * 60 + 30, end: 18 * 60, label: 'Schooling — short course', discipline: 'Equitation' },
    ],
    '0915': [
      { start: 8 * 60, end: 9 * 60, label: 'Private lessons', discipline: 'Hunter' },
      { start: 16 * 60, end: 17 * 60, label: 'Group lesson — related distances', discipline: 'Jumper' },
    ],
  },
  'aubreymeadows/outdoor': {
    '0916': [
      { start: 8 * 60, end: 12 * 60, label: 'Schooling show — 2\'6" Hunters', discipline: 'Hunter' },
      { start: 13 * 60, end: 15 * 60, label: 'Schooling show — Equitation', discipline: 'Equitation' },
    ],
    '0915': [{ start: 15 * 60, end: 16 * 60, label: 'Course schooling', discipline: 'Jumper' }],
  },
  'demo/covered': {
    '0916': [
      { start: 9 * 60, end: 10 * 60, label: 'Morning lessons', discipline: 'Hunter' },
      { start: 16 * 60, end: 17 * 60, label: 'Afternoon group', discipline: 'Jumper' },
    ],
    '0915': [{ start: 10 * 60, end: 11 * 60, label: 'Private lessons', discipline: 'Equitation' }],
  },
};

const thumbs = [
  'https://images.unsplash.com/photo-1690112329897-0c7e37e89b71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595675759752-a743a9b71d93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512934772407-b292436089ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1690112328558-0bfc0d32bf0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

export function chunkId(barn, arena, dayKey, startMin) {
  return `${barn}-${arena}-${dayKey}-${minutesToHHMM(startMin)}`;
}

// Every 15-minute chunk in one arena on one day, inside barn hours.
export function chunksForDay(barn, arena, dayKey) {
  const day = days.find((d) => d.key === dayKey);
  if (!day) return [];
  const labelled = schedule[`${barn}/${arena}`]?.[dayKey] || [];
  const out = [];
  for (let m = BARN_HOURS.start; m < BARN_HOURS.end; m += CHUNK_MINUTES) {
    const hit = labelled.find((r) => m >= r.start && m < r.end);
    out.push({
      id: chunkId(barn, arena, dayKey, m),
      barn,
      arena,
      dayKey,
      dateLabel: day.label,
      iso: day.iso,
      startMin: m,
      endMin: m + CHUNK_MINUTES,
      start: minutesToClock(m),
      end: minutesToClock(m + CHUNK_MINUTES),
      label: hit ? hit.label : null,
      discipline: hit ? hit.discipline : null,
      thumb: thumbs[(m / CHUNK_MINUTES) % thumbs.length],
    });
  }
  return out;
}

export function chunksForArena(barn, arena) {
  return days.flatMap((d) => chunksForDay(barn, arena, d.key));
}

export function getChunk(id) {
  const [barn, arena, dayKey, hhmm] = id.split('-');
  const m = parseInt(hhmm.slice(0, 2), 10) * 60 + parseInt(hhmm.slice(2), 10);
  return chunksForDay(barn, arena, dayKey).find((c) => c.startMin === m) || null;
}

// ---------------------------------------------------------------------------
// Purchases — what lives in My Videos. One folder per chunk, three angle
// files in each. Expiry is a fixed date; the real duration is still TBD.
export const angles = [
  { id: 'side', label: 'Long side', file: 'LongSide' },
  { id: 'ingate', label: 'Gate end', file: 'GateEnd' },
  { id: 'farend', label: 'Far end', file: 'FarEnd' },
];

export function folderNames(chunk, arenaName) {
  const arenaSlug = arenaName.replace(/[^A-Za-z0-9]/g, '');
  const range = `${minutesToHHMM(chunk.startMin)}-${minutesToHHMM(chunk.endMin)}`;
  const base = `${chunk.iso}_${range}_${arenaSlug}`;
  return {
    display: `${arenaName} · ${chunk.dateLabel} · ${chunk.start}–${chunk.end}`,
    zip: `${base}.zip`,
    files: angles.map((a) => ({ ...a, filename: `${base}_${a.file}.mp4` })),
  };
}

export function videoFolderTitle(barnName, folder) {
  const date = folder.iso
    ? new Date(`${folder.iso}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : folder.dateLabel;
  return `${barnName} Equestrian Outdoor Arena ${date} ${folder.start} ${folder.end}`;
}

// Seeded purchases include a second Aubrey Meadows transaction so autoplay can
// continue beyond the current purchase; local sample clips stand in for footage.
const seededPurchases = [
  { barn: 'aubreymeadows', arena: 'covered', arenaName: 'Covered Arena', dayKey: '0916', from: 16 * 60, to: 17 * 60, expires: 'Oct 16', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'aubreymeadows', arena: 'covered', arenaName: 'Covered Arena', dayKey: '0916', from: 17 * 60 + 30, to: 17 * 60 + 45, expires: 'Oct 16', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'aubreymeadows', arena: 'covered', arenaName: 'Covered Arena', dayKey: '0916', from: 17 * 60 + 45, to: 18 * 60 + 30, expires: 'Oct 16', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'aubreymeadows', arena: 'covered', arenaName: 'Covered Arena', dayKey: '0915', from: 16 * 60, to: 17 * 60, expires: 'Oct 15', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'aubreymeadows', arena: 'covered', arenaName: 'Covered Arena', dayKey: '0915', from: 17 * 60 + 15, to: 17 * 60 + 45, expires: 'Oct 15', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: '0916', from: 16 * 60, to: 16 * 60 + 15, expires: 'Oct 16', horse: 'Demo Horse', videos: previewVideos },
];

export const purchases = seededPurchases.flatMap((p) => {
  const out = [];
  for (let m = p.from; m < p.to; m += CHUNK_MINUTES) {
    const chunk = getChunk(chunkId(p.barn, p.arena, p.dayKey, m));
    if (!chunk) continue;
    const names = folderNames(chunk, p.arenaName);
    out.push({
      ...chunk,
      arenaName: p.arenaName,
      minutes: CHUNK_MINUTES,
      horse: p.horse,
      expires: p.expires,
      owned: true,
      videos: p.videos,
      names,
      purchaseGroup: `${p.barn}-${p.arena}-${p.dayKey}-${minutesToHHMM(p.from)}`,
    });
  }
  return out;
});

export const playerPreview = {
  id: 'player-preview',
  barn: 'demo',
  arena: 'covered',
  arenaName: 'Covered Arena',
  dateLabel: 'Sample footage',
  start: '4:00 PM',
  end: '4:01 PM',
  startMin: 0,
  endMin: 1,
  minutes: 1,
  label: 'Three-camera player preview',
  discipline: 'Player preview',
  horse: 'Sample clips',
  expires: null,
  owned: true,
  preview: true,
  videos: previewVideos,
  names: {
    display: 'Three-camera player preview',
    zip: 'ThreeCameraPreview.zip',
    files: angles.map((angle) => ({ ...angle, filename: `Preview_${angle.file}.mp4` })),
  },
};

export function getPlayerPreview(barn, arena, id) {
  return barn === playerPreview.barn && arena === playerPreview.arena && id === playerPreview.id
    ? playerPreview
    : null;
}

export function purchasesForBarn(barn) {
  return purchases.filter((p) => p.barn === barn);
}

export function getPurchase(id) {
  return purchases.find((p) => p.id === id) || null;
}

// Everything the player page can open: a bought folder, or an unbought chunk
// shown behind the purchase card.
export function getWatchable(barn, arena, id, arenaName) {
  const bought = getPurchase(id);
  if (bought) return bought;
  const chunk = getChunk(id);
  if (!chunk || chunk.barn !== barn || chunk.arena !== arena) return null;
  return { ...chunk, arenaName, minutes: CHUNK_MINUTES, owned: false, names: folderNames(chunk, arenaName) };
}

// Markers a rider or trainer drops on the shared timeline.
export const demoMarkers = [
  { at: 0.08, label: 'Warm-up', kind: 'quiet' },
  { at: 0.36, label: 'First course', kind: 'key' },
  { at: 0.62, label: 'Chip at the in-and-out', kind: 'note' },
  { at: 0.84, label: 'Second course — clean', kind: 'key' },
];
