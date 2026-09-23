// Wall-clock helpers. A parent knows their kid went in "around 4:15", never
// "at 00:23:40", so the player labels time of day by default.

export function parseClock(label) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 3600 + parseInt(m[2], 10) * 60;
}

export function formatClock(secondsOfDay, withSeconds = false) {
  const s = ((secondsOfDay % 86400) + 86400) % 86400;
  const h24 = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const base = `${h12}:${String(mm).padStart(2, '0')}`;
  return withSeconds ? `${base}:${String(ss).padStart(2, '0')} ${suffix}` : `${base} ${suffix}`;
}

export function formatElapsed(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

// Deterministic pseudo-noise so the activity strip renders identically on the
// server and the client. Math.random() here would mean a hydration mismatch.
export function activityProfile(seed, bins = 96) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out = [];
  for (let i = 0; i < bins; i += 1) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h |= 0;
    const noise = Math.abs(h % 1000) / 1000;
    // Riding happens in bursts with quiet either side of them.
    const p = i / bins;
    const shape =
      0.35 +
      0.65 * Math.exp(-((p - 0.34) ** 2) / 0.012) +
      0.55 * Math.exp(-((p - 0.62) ** 2) / 0.016) +
      0.7 * Math.exp(-((p - 0.8) ** 2) / 0.01);
    // Rounded, not raw: React compares the inline-style string it rendered on
    // the server against what the browser normalises it to, and a full-precision
    // float ("49.36523692028901%") comes back as "49.3652%" — a hydration mismatch.
    const v = Math.min(1, 0.12 + shape * (0.55 + noise * 0.45) * 0.72);
    out.push(Math.round(v * 10000) / 10000);
  }
  return out;
}
