# Akture Equestrian — frontend

The equestrian vertical of Akture, at `equestrian.akture.video`, with a page per barn.
This is the frontend mockup the team reviewed on 9/20, updated for every decision since.
Backend integration is Aryan's; the shapes it needs are in `lib/`.

**Read [NOTES.md](NOTES.md) before touching copy or showing this outside the team.** It lists
what is decided, what is still open, and what the mockup assumes.

```bash
npm install
npm run dev      # http://localhost:3007
npm run lint     # stylelint + the CSS guardrail
npm run build    # runs the guardrail first, then next build — same on Vercel
```

## Pages

| Path | What it is |
|---|---|
| `/` | Landing — who it is for, the multi-camera player, pricing, barns |
| `/how-it-works` | Code once, pick the arena and the day, buy the chunks, watch and download |
| `/pricing` | The three tiers over 15-minute chunks |
| `/faq` | Eleven questions, including who can see footage and how long it stays |
| `/barns` | The barns we are in, and how a barn comes online |
| `/access` | Create account (email, password, barn code) or log in |
| `/[barn]` | A barn's portal — one block per arena, "Find your ride" into each |
| `/[barn]/[arena]` | **The purchase page.** Every 15-minute chunk from the last 48 hours, a date + time filter, select up to an hour in a row |
| `/[barn]/[arena]/watch/[folder]` | **The player.** Bought folders only — there is no preview |
| `/[barn]/my-videos` | Purchases as folders of three angles: rename, delete, combine, play in order, download |
| `/[barn]/profile` | The mock account, and log out |
| `/[barn]/support` | A form that opens a real email to `contact@akture.video` |

**The demo barn** is code **`AA1111`**. Create an account with it on `/access` and you land on
`/demo` with two days of mock footage and an hour bought as four folders in My Videos, at
`/demo/covered/watch/demo-covered-0916-1600`.

## The product, as built here

- **Access.** The barn code is entered once, to create an account tied to that barn. After that
  it's an ordinary login. The mock account lives in `localStorage`; nothing is sent anywhere.
- **Buying.** Footage is sold in **15-minute chunks**, listed for **48 hours** after recording.
  A purchase is one to four contiguous chunks — an hour, max — and is always **every camera in
  the arena.** Tiers: 0–15 min $15.99 · 16–30 min $24.99 · 31–60 min $39.99. A discount-code
  field is on the purchase bar. No preview before purchase.
- **What you get.** One folder per chunk, three angle files in each, named so they sort and
  never collide:

  | Where | Name |
  |---|---|
  | Folder, on screen | `Covered Arena · Tue, Sep 16 · 4:00 PM–4:15 PM` |
  | Zip | `2026-09-16_1600-1615_CoveredArena.zip` |
  | Files inside | `2026-09-16_1600-1615_CoveredArena_LongSide.mp4` · `…_GateEnd.mp4` · `…_FarEnd.mp4` |

- **My Videos.** Purchases grouped by transaction. Rename (folder or file), delete, and combine
  two to four consecutive folders work for real in the browser's storage. Download says plainly
  it is not wired. Each folder shows the date it comes down; the exact retention is TBD.
- **The player.** Custom, not a native `<video>` — the team's decision, because native controls
  vanish in fullscreen. One shared transport, one playhead, one clock. Single angle or all three;
  switching never moves the clock. Speed 0.25×–2×. **Play in order:** folders from one purchase
  run back to back, with a strip under the timeline and a header that says *Playing 2 of 4 ·
  next starts on its own.* Fullscreen takes the whole player. Keyboard: space · 1 2 3 · G · F ·
  N P · ← → · , . · ?
- **Not V1, by decision:** trim and crop (download and edit elsewhere); marks on the timeline
  (still in the player as a demonstrated nice-to-have, off the marketing copy).

## Styling — one source of truth

Every colour is defined **once**, in `app/globals.css` as RGB channels
(`--oat: 246 242 234`). `tailwind.config.js` references them as
`rgb(var(--oat) / <alpha-value>)`, which is what keeps `text-oat/55`-style opacity modifiers
working. **No hex literal anywhere else.**

Component styles live beside their components as `*.module.css` (`GlassPanel`, `Ticker`).
`globals.css` holds resets, base elements and a few true global utilities, whose keyframes are
prefixed `aq-`.

`scripts/check-css.mjs` runs before every build and fails on: a duplicate or unprefixed global
`@keyframes`; a plain `.css` import from a component; a colour literal in the Tailwind config;
or an **opacity modifier off Tailwind's scale** (`/92`, `/12`), which Tailwind drops silently —
that last one is how every photo scrim on the site once went missing at the same time.
`.stylelintrc.json` enforces class and keyframe naming.

## Palette

| Token | Value | Source |
|---|---|---|
| `ink` | `#0B1611` | Near-black with a green cast |
| `pine` | `#10614A` | Between Rolex green `#006039` (observed, usef.org) and Rio Vista's `#107E63` |
| `navy` | `#00457B` | Observed — kyhorsepark.com |
| `oat` | `#F6F2EA` | Cream; Hermès' ground is `#FCF7F1` |
| `brass` | `#C6A66F` | Observed — kyhorsepark.com |
| `hermes` | `#F37021` | ⚠ **Unconfirmed** — see NOTES.md |

Type: Instrument Serif for display, Inter for body, Outfit for small caps labels. Primary buttons
are dark text on the orange — white on `#F37021` is 2.89:1 and fails WCAG AA.

## Verified

- `npm run build` clean, 32 routes prerendered, guardrail passing.
- Zero console errors on every page.
- WCAG AA contrast on every page in both light and dark, including text over photos checked
  against the worst case of a pure-white image, with a scanner proven against planted failures.
- Purchase flow: selection, tier pricing, the four-chunk cap, non-adjacent restart, the filter.
- Access: wrong code refused, `AA1111` creates the account and lands on the demo barn.
- Player: seek, angle switch holds the clock, play-through advances to the next folder, N/P,
  all-three buffering note.
- My Videos: rename persists, combine produces the combined entry and zip name, delete removes.

## Stack

Next.js 16 App Router · React 19 · Tailwind 3 · stylelint. Static — every route prerenders.
