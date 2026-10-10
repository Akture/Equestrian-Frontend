# Akture Equestrian — what is decided, what is open, what the mockup assumes

Updated 2026-09-23 from the 9/20 call notes and the Slack threads of 9/21–9/22.
Read this before changing copy or showing the site outside the team.

---

## Decided by the team

| Decision | Source |
|---|---|
| No barn code; sign up or log in (including Google) to access Aubrey Meadows | current access flow |
| Purchase page **auto-populates**; a date + start/end time **filter** narrows it | usability note; Aryan 9/21 |
| **No preview** before purchase; a purchase is **every angle**, no picking | usability note |
| Unit is the **15-minute chunk** | usability note |
| **One hour** max per transaction | Zane 9/21 ("maybe 1.5" — not decided) |
| Footage is for sale for **48 hours** after recording | Zane 9/21 |
| Prices: **0–15 $15.99 · 16–30 $24.99 · 31–60 $39.99** | Aryan's proposal, 9/21 |
| Purchases kept a **limited time**, download to keep; exact duration TBD, "language to be massaged" | 9/20 call |
| Dashboard V1: **My Videos, Profile, Contact Support**; no subscription page | 9/20 call |
| **Custom player**, not native `<video>` (native loses controls in fullscreen) | 9/20 call |
| Multi-camera is V1: switching + 3-up, one scrub bar, position preserved on switch | 9/20 call |
| Playback speed from the start | 9/20 call |
| **Trim and crop: not V1** | 9/20 call |
| **Marks/timestamps: nice-to-have, not V1** — ranked below slow-mo and multi-cam | 9/20 call |
| Download = **folder of three synced files, zipped**, named date + camera per file | 9/20 call |
| Discount codes exist and are on/off; whether they're on is Zane's call | Aryan 9/21 |
| Cameras **do not record audio** | Sky |
| Palette: hunter green, pale gold, Hermès orange — matched the Rolex equestrian palette | 9/20 call; research |
| Frontend styling: one source of truth for tokens, CSS Modules, lint guardrails | design-tokens note |

## Open — the mockup makes an assumption, marked here

- **Merge vs. deliver as 15-minute folders.** Zane's gut says merge; Aryan argues folders (3× less
  merging, playback, download load); Chris proposed folders with a **combine** option in the
  dashboard and tracking how often it's used; Zane doesn't hate that if the merge is polished.
  **The mockup shows folders + play-in-order + combine**, so the team can look at Chris's
  question — does it feel polished enough — rather than argue it. If the answer is merge, the UI
  only gets simpler.
- **Retention duration.** Each folder shows a concrete date it comes down; copy never names a
  number.
- **1 hour vs 1.5.** Mockup uses one hour; a one-line change.
- **Onsite hardware** for the 48-hour pre-purchase window. Zane's to answer; the 9/13 notes
  mention a ~$500 local NVR/Linux box as the idea.
- **The Hermès orange hex is unconfirmed.** `#F37021` could not be verified from any
  Hermès-owned source — their entire stylesheet holds five hex values, none orange, and their
  favicon and touch-icons pixel-sample to zero orange pixels. Colour databases disagree
  (`#F37021` vs `#FD5E0F`). Anna's call, or derive from Akture's existing ember.

## Photo licensing — reviewer task before launch

All 14 photos are served from `images.unsplash.com`, the free tier (Unsplash+ paid content
comes from `plus.unsplash.com`). The standard Unsplash License allows commercial use without
attribution. **That is inferred from the host, not confirmed per photo:** the CDN id is not the
photo page's slug, so `unsplash.com/photos/<cdn-id>` returns 404, and the CDN's `?fm=json`
carries camera EXIF only — no photographer, no license field. Per-photo confirmation needs the
Unsplash API (an access key) or finding each photo page by search.

Two photos deserve a specific look: the **rider portrait** (`riderPortrait`, an identifiable
face — fine as a site photo, but the license does not cover likeness used to imply endorsement)
and the **night grand prix** (`heroNightGrandPrix`, visible sponsor branding on the oxer).

## Copy rules this build follows

Headings say what the thing is — no balanced two-clause titles, no X-not-Y, no rhythmic
triads, no number play. Say what something is, not what it isn't. Lead with what it does for
the reader. Three tweaks from the 9/20 review are in: "tied to your barn" (not "belongs to");
"Scrub to the distance" and "by the time you rode in" reworded. `scripts/` has no copy linter;
the one used during the build is in the session transcript and is easy to recreate.

## Repo and deploy

- Repo: **`Akture/Equestrian-Frontend`**, private — transferred into the org 2026-09-23 after
  Chris added `skyler-lark` as a member. Sky commits as `skyler-lark`.
- Vercel: the project sits under Sky's `lark-labs` team; deploys are from the CLI on his
  machine. Don't connect the repo to that Vercel project — commits from anyone not on lark-labs
  would silently skip the build. When Akture takes it over, the project moves to their team.
- Live: `https://akture-equestrian.vercel.app` (production alias; `noindex, nofollow`).

## Elsewhere

- **New-Frontend has a live `@keyframes marquee` collision** between `global.css`
  (100% → −100%) and `Banner.css` (0 → −50%); whichever loads last wins. Separate small fix on
  the `skyler` branch — not part of this repo.
- Sky is consolidating onto the `skyler-lark` GitHub identity. Aryan should add `skyler-lark`
  to New-Frontend too.
