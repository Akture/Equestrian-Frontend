// MOCK DATA. The unit of everything here is the 15-minute recording segment.
import { previewVideos } from './media';
import { getBarn } from './barns';
//
// Facts from the team, as of 9/22:
//   · footage is for sale for 48 hours after it is recorded
//   · a purchase is one to four contiguous segments (an hour, max) and is
//     always every camera in the arena
//   · a purchase arrives as one folder per chunk, three angle files in each
//   · purchases are kept for a limited time (duration TBD); download to keep

export const CHUNK_MINUTES = 15;
export const MAX_CHUNKS_PER_PURCHASE = 4;
export const PURCHASE_WINDOW_HOURS = 48;

function localIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getRecentDays(now = new Date()) {
  return Array.from({ length: 3 }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const iso = localIsoDate(date);
    return {
      key: iso.replaceAll('-', ''),
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      short: ['Today', 'Yesterday', '2 Days ago'][offset],
      iso,
    };
  });
}

export const days = getRecentDays();

export function hoursForDay(dayKey, dayOptions = days) {
  const day = dayOptions.find((item) => item.key === dayKey);
  if (!day) return { start: 8 * 60, end: 17 * 60 };
  const weekday = new Date(`${day.iso}T12:00:00`).getDay();
  return weekday === 0 || weekday === 6
    ? { start: 9 * 60, end: 12 * 60 }
    : { start: 8 * 60, end: 17 * 60 };
}

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
// Labels are sample metadata; segment availability is driven by the barn's
// recording schedule and the rolling 48-hour purchase window.
const sampleLabels = {
  'demo/covered': [
    [
      { offset: 60, duration: 30, label: 'Private lesson', discipline: 'Equitation' },
      { offset: 90, duration: 60, label: 'Flatwork group', discipline: 'Hunter' },
    ],
    [
      { offset: 30, duration: 60, label: 'Private lessons', discipline: 'Hunter' },
      { offset: 8 * 60, duration: 60, label: 'Group lesson — related distances', discipline: 'Jumper' },
    ],
    [
      { offset: 60, duration: 60, label: 'Schooling — short course', discipline: 'Equitation' },
      { offset: 5 * 60, duration: 60, label: 'Group lesson — gymnastics', discipline: 'Jumper' },
    ],
  ],
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

export const angles = [
  { id: 'side', label: 'The rail', file: 'LongSide' },
  { id: 'ingate', label: 'Gate end', file: 'GateEnd' },
  { id: 'farend', label: 'Far end', file: 'FarEnd' },
];

function segmentDate(day, minute) {
  const date = new Date(`${day.iso}T00:00:00`);
  date.setMinutes(minute);
  return date;
}

// Every 15-minute segment in one arena on one day, inside the barn's hours.
export function chunksForDay(barn, arena, dayKey, dayOptions = days) {
  const day = dayOptions.find((item) => item.key === dayKey);
  if (!day) return [];
  const bounds = hoursForDay(dayKey, dayOptions);
  const labels = sampleLabels[`${barn}/${arena}`]?.[dayOptions.indexOf(day)] || [];
  const out = [];
  for (let m = bounds.start; m < bounds.end; m += CHUNK_MINUTES) {
    const hit = labels.find((item) => m >= bounds.start + item.offset && m < bounds.start + item.offset + item.duration);
    const recordedAt = segmentDate(day, m + CHUNK_MINUTES);
    const thumbnailUrl = thumbs[Math.floor(m / CHUNK_MINUTES) % thumbs.length];
    const id = chunkId(barn, arena, dayKey, m);
    const assetPrefix = `recordings/${barn}/${arena}/${day.iso}/${minutesToHHMM(m)}`;
    out.push({
      id,
      recordingId: id,
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
      durationMinutes: CHUNK_MINUTES,
      recordedAt: recordedAt.toISOString(),
      availableUntil: new Date(recordedAt.getTime() + PURCHASE_WINDOW_HOURS * 60 * 60 * 1000).toISOString(),
      thumbnailUrl,
      assets: {
        provider: 'mock',
        thumbnailUrl,
        angles: angles.map((angle) => ({
          cameraId: angle.id,
          storageKey: `${assetPrefix}_${angle.file}.mp4`,
          url: previewVideos[angle.id],
        })),
      },
    });
  }
  return out;
}

export function availableChunksForDay(barn, arena, dayKey, now = new Date(), dayOptions = days) {
  const nowTime = now.getTime();
  return chunksForDay(barn, arena, dayKey, dayOptions).filter((chunk) => {
    const recordedAt = new Date(chunk.recordedAt).getTime();
    const availableUntil = new Date(chunk.availableUntil).getTime();
    return recordedAt <= nowTime && nowTime < availableUntil;
  });
}

export function chunksForArena(barn, arena) {
  const dayOptions = getRecentDays();
  return dayOptions.flatMap((day) => chunksForDay(barn, arena, day.key, dayOptions));
}

export function getChunk(id) {
  const match = id.match(/^([^-]+)-([^-]+)-(\d{8})-(\d{4})$/);
  if (!match) return null;
  const [, barn, arena, dayKey, hhmm] = match;
  const m = parseInt(hhmm.slice(0, 2), 10) * 60 + parseInt(hhmm.slice(2), 10);
  const dayOptions = getRecentDays();
  return chunksForDay(barn, arena, dayKey, dayOptions).find((chunk) => chunk.startMin === m) || null;
}

// ---------------------------------------------------------------------------
// Purchases — what lives in My Videos. One folder per chunk, three angle
// files in each. Expiry is a fixed date; the real duration is still TBD.
export function folderNames(chunk, arenaName) {
  const arenaSlug = arenaName.replace(/[^A-Za-z0-9]/g, '');
  const range = `${minutesToHHMM(chunk.startMin)}-${minutesToHHMM(chunk.endMin)}`;
  const base = `${chunk.iso}_${range}_${arenaSlug}`;
  const date = new Date(`${chunk.iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const barnName = getBarn(chunk.barn)?.name || chunk.barn;
  return {
    display: `${barnName} (${arenaName}) - ${date} at ${chunk.start} - ${chunk.end} (${chunk.durationMinutes} min)`,
    zip: `${base}.zip`,
    files: angles.map((a) => ({ ...a, filename: `${base}_${a.file}.mp4` })),
  };
}

export function videoFolderTitle(barnName, folder) {
  if (folder.names?.display) return folder.names.display;
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

// Seeded purchases include a second Demo Barn transaction so autoplay can
// continue beyond the current purchase; local sample clips stand in for footage.
const seededPurchases = [
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: days[1].key, from: hoursForDay(days[1].key).start + 60, to: hoursForDay(days[1].key).start + 120, expires: 'In 48 hours', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: days[1].key, from: hoursForDay(days[1].key).start + 120, to: hoursForDay(days[1].key).start + 135, expires: 'In 48 hours', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: days[1].key, from: hoursForDay(days[1].key).start + 135, to: hoursForDay(days[1].key).start + 180, expires: 'In 48 hours', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: days[2].key, from: hoursForDay(days[2].key).start + 60, to: hoursForDay(days[2].key).start + 120, expires: 'In 48 hours', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: days[2].key, from: hoursForDay(days[2].key).start + 135, to: hoursForDay(days[2].key).start + 165, expires: 'In 48 hours', horse: 'Copper Penny', videos: previewVideos },
  { barn: 'demo', arena: 'covered', arenaName: 'Covered Arena', dayKey: days[0].key, from: hoursForDay(days[0].key).start, to: hoursForDay(days[0].key).start + 15, expires: 'In 48 hours', horse: 'Demo Horse', videos: previewVideos },
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
  return {
    ...chunk,
    arenaName,
    minutes: CHUNK_MINUTES,
    owned: false,
    videos: previewVideos,
    names: folderNames(chunk, arenaName),
  };
}

// Markers a rider or trainer drops on the shared timeline.
export const demoMarkers = [
  { at: 0.08, label: 'Warm-up', kind: 'quiet' },
  { at: 0.36, label: 'First course', kind: 'key' },
  { at: 0.62, label: 'Chip at the in-and-out', kind: 'note' },
  { at: 0.84, label: 'Second course — clean', kind: 'key' },
];
