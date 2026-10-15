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
| `/how-it-works` | Sign in, choose the day and footage, buy chunks, watch and download |
| `/pricing` | The three tiers over 15-minute chunks |
| `/faq` | Eleven questions, including who can see footage and how long it stays |
| `/barns` | The barns we are in, and how a barn comes online |
| `/access` | Create an account with email/password, log in, or use the mock Google sign-in |
| `/[barn]` | **The purchase page.** All available 15-minute footage segments from the barn's arena |
| `/[barn]/[arena]` | Redirects to the barn purchase page |
| `/[barn]/[arena]/watch/[folder]` | **The player.** Purchased folders and the demo multi-camera preview |
| `/[barn]/my-videos` | Purchases as folders of three angles: rename, delete, combine, play in order, download |
| `/[barn]/profile` | The mock account, and log out |
| `/[barn]/support` | A form that opens a real email to `contact@akture.video` |

Create an account or use the mock Google sign-in on `/access` to open the Demo Barn
(`/demo`). The account is stored in this browser only; there is no production authentication
provider connected yet. The Demo Barn carries the worked example: mock footage, three camera angles, and
seeded purchases in My Videos.
Seeded purchased folders use local sample MP4s from `public/videos/` to exercise playback and
downloads; they stand in for the signed camera-angle URLs supplied by a production backend.

## The product, as built here

- **Access.** The barn code is not required. Email/password account creation, login, and Google
  sign-in are mocked in the browser and redirect to the Demo Barn. Production OAuth and account
  services still need to be connected.
- **Buying.** Footage is sold in **15-minute chunks**, listed for **48 hours** after recording.
  **One arena per barn:** at launch Akture installs in a single arena at each location, so the
  barn page is the purchase page for that arena (`barn.arena` in `lib/barns.js`). Footage is ordered earliest-first within each day and
  grouped into collapsed Morning, Afternoon, and Evening sections. A purchase is one to four
  contiguous chunks — an hour, max — and always includes **every camera in that
  arena.** Tiers: 0–15 min $15.99 · 16–30 min $24.99 · 31–60 min $39.99. A discount-code
  field is on the purchase bar. The checkout mock accepts Stripe test card `4242 4242 4242 4242`
  and simulates decline for `4000 0000 0000 9995`; successful folders are saved in browser
  storage and immediately open My Videos. No live Stripe API calls or card data storage are used.
- **Availability.** Demo Barn footage is scheduled Monday to Friday, 8am–5pm, and Saturday
  and Sunday, 9am–12pm. The day filter starts on **All available** (earliest first within each day) and can narrow
  to Today, Yesterday, or 2 Days ago. The time filter narrows the selected day.
- **Footage assets.** Mock segments expose a stable `recordingId`, `recordedAt`, `availableUntil`,
  `thumbnailUrl`, and per-camera `assets.angles` entries with `cameraId`, `storageKey`, and `url`.
  Replace the mock data provider and provide S3-backed object keys/signed URLs while preserving
  these fields to connect real recordings to the purchase UI.
- **What you get.** One folder per chunk, three angle files in each, named so they sort and
  never collide. The browser player synchronizes all three angles. Offline playback of all
  three downloaded files requires a specialized media player; footage has no sound:

  | Where | Name |
  |---|---|
  | Folder, on screen | `Demo Barn (Covered Arena) - September 16, 2026 at 4:00 PM - 4:15 PM (15 min)` |
  | Zip | `2026-09-16_1600-1615_CoveredArena.zip` |
  | Files inside | `2026-09-16_1600-1615_CoveredArena_LongSide.mp4` · `…_GateEnd.mp4` · `…_FarEnd.mp4` |

- **My Videos.** Purchases grouped by day. Rename (folder or file), delete, and combine two to
  four consecutive folders work for real in the browser's storage. Download an individual
  timestamp or every timestamp from a day as one ZIP; each archive contains all three angles or
  only the selected angle. Each folder shows the date it comes down; the exact retention is TBD.
- **The player.** Custom controls over native `<video>` elements — native controls vanish in
  fullscreen. One shared transport, one playhead, one clock. Single angle or all three;
  switching never moves the clock. Playback starts when the user presses Play. Speed 0.25×–2×.
  **Play in order:** folders from one purchase run back to back. Day autoplay uses one timeline
  spanning all that day's chunks; an individual chunk uses its own 15-minute timeline. The
  player fits the viewport, with the scrub timeline carrying segment transitions. Fullscreen takes the whole player.
  Keyboard: space · 1 2 3 · G · F · N P · ← → · , . · ?
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
- Access: email signup, login, and mock Google sign-in open the Demo Barn; barn routes require a
  browser mock account.
- Player: seek, angle switch holds the clock, play-through advances to the next folder, N/P,
  all-three buffering note.
- Player preview: `/demo/my-videos` has a separate three-feed sample folder. It uses local clips
  from `public/videos/`, not synchronized horse footage; real folders provide their own angle URLs.
- My Videos: rename persists, combine produces the combined entry and zip name, delete removes.

## Stack

Next.js 16 App Router · React 19 · Tailwind 3 · stylelint. Static — every route prerenders.
