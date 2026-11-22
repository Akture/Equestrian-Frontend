# Old /barns page — snapshot for reference (not live)

A copy of the **Barns** page from the old mockup preview, `akture-equestrian.vercel.app/barns`,
saved 2026-11-22 before that preview is taken down. **Nothing here is built or served.** Next.js
only routes `app/`, so this folder never reaches `equestrian-frontend.vercel.app`.

## What's here

| File | What |
|---|---|
| `barns-desktop.png` | Full page at 1440px wide, dark theme |
| `page-text.txt` | Every line of visible text on the page, in order |

## The source code

The page's code is still in git. It is the version just before the 10/13 review backlog was
built (`de05c8f`, 2026-10-15), which removed the mock barns and the barn-code wording.
That older code also lists one more barn, removed from this snapshot.

```
git show cec381b:app/barns/page.jsx         # the page
git show cec381b:components/BarnCard.jsx    # the barn cards
git show cec381b:lib/barns.js               # the barn data
git checkout cec381b -- app/barns           # bring the old page back onto a working branch
```

The original mockup commit is `00f4142` (Skyler, 2026-09-23).

## How it differs from the live page

- Heading is **Choose Location** (Zane's wording, 2026-11-22; the old page said "The barns we
  are in").
- Lists six barns: Demo Barn plus five **invented sample barns** (Stonebridge, Willow Run, Cedar
  Hollow, Brightwater, Fieldstone). Labelled "Mockup — sample data".
- The button says **Enter barn code**; the live site says **Purchase footage**.
- The ticker shows time-tier prices (up to 15 min $15 · 30 min $25 · 60 min $40); the live site
  shows "starting at $15.99".
- Has a **"How a barn comes online"** section (walk the arena → cameras go in → page goes live).

*Saved 2026-11-22 by Zane, via Claude Code.*
