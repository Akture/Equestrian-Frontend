# Update backlog — after the branch merge

*Logged 2026-10-13 by Zane Cooke (via Claude Code). **Not started on purpose.** Nothing here
gets built until Aryan has merged the three branches (Zane's `zane/one-page-per-barn`,
Skyler's zoom fix, Aryan's `AK`) into one build. Then this list is worked in one batch.*

**Sources**
- **A.** The infrastructure shift: no dedicated barn codes.
- **B.** Ana's copy notes (Slack, 2026-10-13, 9:58 PM).
- **C.** Granola, "Akture Equestrian Web UI Review 10/13". Zane and Skyler clicked through the
  whole site at 100% Chrome zoom.

**How to read the locations.** Files and quoted strings are taken from `origin/AK` at
`4bbd1bf`, the most current branch. Line numbers will move after the merge, so search for
the quoted text rather than going to a line.

**Status key:** `[ ]` to do · `[?]` needs a decision first (see **Open questions** at the end).

---

## A. Remove barn codes

Accounts are no longer tied to a barn by a code. Aryan's `AK` already removed the code from
the access flow, `NOTES.md` and the README. **If the merge takes AK's versions of these
files, most of this section is already done.** If it takes `main` or Zane's version, every
item below comes back. After merging, run this check; it should find nothing:

```
git grep -n -i -E 'barn code|AA1111|code once|enter the code|tied to (that|your|this) barn'
```

Text that still needs changing **even on AK**:

- [ ] **Homepage "For barns" hero card**, in `lib/copy.js`: *"Your clients get a page only
  they can reach."* Ana flagged this too (see B3).
- [ ] **Homepage barns section**, in `app/page.jsx`: the heading *"Your arenas on a page only
  your clients can open"*. Rewrite it so it doesn't promise a private page.
- [ ] **`barnFeatures`**, in `lib/copy.js`:
  - *"Your barn gets its own page"*
  - *"Your footage stays inside your barn"*

  Replace both with the value points in C5.
- [ ] **Barns page**, in `app/barns/page.jsx`: *"Each barn has its own page. Riders sign in to
  reach their barn's arenas and footage."*
- [ ] **FAQ**, in `lib/copy.js`: *"...the barn hosts its own page..."*. Check that the answer
  still holds.
- [ ] **Profile**, in `components/ProfilePanel.jsx`: the row `Barn — tied to this account`.
  Remove it, or change it to "your barns".
- [ ] **Header button on `main` and Zane's branch:** *"Enter barn code"*. It should read
  "Purchase footage" or "Sign in". Check which one survives the merge.
- [ ] **Support form option:** *"My barn code does not work"*. It's still on `main` and Zane's
  branch; make sure the merge drops it.
- [ ] **Not-found page:** *"...check the code on it."* Same as above.
- [?] **What replaces the code?** How does a rider reach their barn? Options: pick the barn
  after signing in, follow a barn link, or search. This decides the copy for several items
  above. → Open question 1.

## B. Ana's copy updates (homepage hero cards)

All three are in the `heroSlides` array in `lib/copy.js`. Ana's notes change the
**description** line only. The headlines stay as they are.

- [ ] **B1. For families** ("Watch the round again / at home").
  - Replace *"Buy the window around the class and send it to whoever could not make the
    drive."*
  - With: **"Families no longer have the responsibility of filming. Our cameras capture it
    all, from entering the ring until the course is complete."**
- [ ] **B2. For trainers** ("Go back to the moment / and look again").
  - Replace *"Find the fence, slow it down, and change to the camera that shows what
    happened."*
  - With: **"Find the challenging combination, slow it down, and use the footage to
    reinforce the right rhythm and pace to nail the perfect distance."**
  - Ana's message spells it "reenforce"; this uses the standard spelling, "reinforce".
- [?] **B3. For barns** ("Bring the cameras / to your arena"). Ana flagged *"The cameras go in
  once and run on their own. Your clients get a page only they can reach."* as out of date,
  but didn't give a replacement.
  - **Draft for Ana to approve:** "The cameras go in once and just work: no staff time, no
    management. Your clients find their rides in minutes, and you get footage for your own
    marketing." (Built from the value points in C5.)
  - → Open question 2.
- [?] The **"For riders"** card had no notes from Ana. Ask whether it's approved as is. → Open
  question 2.

## C. Web UI review, 10/13 (Zane + Skyler)

### C1. Size and legibility

The audience skews 55+, so size everything for legibility.
- [ ] Make section headers bigger across the site, especially "For riders" and "For
  families". Roughly double the current size is the target.
- [ ] Bigger body text overall.
- [ ] Bigger floating-header nav buttons.
- [ ] Bigger scrollbar.
- [ ] Leave as is: the floating header touching the top bar. Looks fine once scrolled;
  lowering it looks worse.
- [ ] Logo: Skyler's revision (back legs removed) is in progress. Gold on gold is fine here.

### C2. Hero (homepage)

- [ ] Move the slide arrows from the bottom right to either side of the 1–4 position markers.
- [ ] Keep the four audience cards (barns, families, riders, trainers).
- [?] **Check every CTA destination** so each audience's buttons go somewhere sensible and
  consistent. Some buttons sharing a destination is fine. Ideas from the call: "How it works"
  might go to the FAQ; "For barns" should stay "Talk to us" (it already is).
  - **Flagged in the call as an open item to review together, not to decide now.** → Open
    question 3.
  - Current destinations (AK):

    | Card | Main button | Second button |
    |---|---|---|
    | Riders | Purchase footage → `/aubreymeadows` | How it works → `/how-it-works` |
    | Families | How it works → `/how-it-works` | What it costs → `/pricing` |
    | Trainers | See the player → `/demo/covered/watch/player-preview` | Barns → `/barns` |
    | Barns | Talk to us → `/barns#bring-akture` | What we install → `/how-it-works#what-we-install` |

    The trainers button points to `/demo/covered/...`, an arena route that the one-page-per-barn
    change redirects. Recheck it after the merge.

### C3. Pricing: a teaser until launch

- [ ] **Homepage:** a simple pricing block that links to the full pricing page.
- [ ] **No time-based price tiers before go-live,** on the homepage and, at first, on the
  pricing page too.
  - Users: **"No subscription required. Starting at $15 for your video."** Don't mention
    times.
  - Barns: **"Installation fee, no recurring subscription."**
- [ ] Remove the current tier text everywhere it appears:
  - `lib/copy.js`: *"Up to 15 min $15 · up to 30 min $25 · up to 60 min $40"*
  - The FAQ answer that quotes *"$39.99"*
  - The 15-minute-chunk descriptions in the pricing copy
  - The README's tier list
  - Search for the term `15.99`.

### C4. Homepage sections

- [ ] **Barn carousel:** hide it until there are at least 3 real barns. When it comes back,
  show 3 barns and a button to the full barns page.
  - Replace the heading *"Every barn has its own address"*.
  - Replace the link *"See the barns we are in"*.
- [ ] **No mockup or sample data at launch.** Hide any section without real info. Also
  remove:
  - The `DemoRibbon` ("Mockup — sample data")
  - The footer line *"This is an internal design mockup…"*
  - The "not wired up in this mockup" notices: `DemoActionButton` and `WatchRoom`
- [ ] **"Want the camera in your arena? Talk to us"** with the real hero image: approved
  as is.
- [ ] **"How a barn comes online"** (`app/barns/page.jsx`): rename it to something warmer,
  like "A painless process" or "How to get started". The steps: **Scoping call → Site visit →
  1-day installation → Live on Akture.**
- [ ] **Multiple cameras section:** keep it, but rewrite the titles and body.
  - Take the image from Aryan's media player instead of the current mockup.
- [?] **Media player demo:** embed a 30-second clip from the first real site, if that barn
  signs off. Otherwise remove "demo the player" for the first go-live. → Open question 4.

### C5. Barn value points

These replace `barnFeatures` in `lib/copy.js`.
- [ ] **Lead with: "Your clients can access their videos easily."** This is the main one.
- [ ] Replace *"The cameras run on their own"* with something like **"No overhead, no
  management. It just works."** It doesn't add work for the barn.
- [ ] Add **"A source of promotional and marketing material for your barn."**
- [ ] Optional: "Features and extras your clients will love."

### C6. Navigation and header

- [ ] **One consistent header.** Today the logged-in or in-barn header is different from the
  public one, which surprised both of us.
  - Public: the standard nav (Pricing, FAQ, Barns, …).
  - Logged in: **My Videos** and **Support** (Pricing might come back later as "Manage
    subscription").
- [ ] **No separate arena pages** ("Covered Arena", "Outdoor Arena"). One purchase page per
  barn. Zane's branch already does this; make sure it survives the merge.
- [ ] **Footer:** remove the Instagram and YouTube links until those accounts are live
  (`components/Footer.jsx`).

### C7. How it works

- [ ] Cover **both** flows on the page.
  - **Riders:** sign in or create an account → pick the day (and the arena) → choose the time
    you rode → watch or download.
  - **Barns:** what we install and how the install works, with a link to the media player
    demo.
- [ ] Reuse the homepage "Multiple cameras" section here once it's final.
- [ ] Rider steps wording: "choose the time you rode" and "it's yours to watch or download."
- [ ] Leave as is: the "Purchase footage" button sending a logged-out user to login.

### C8. Other pages

- [ ] **Purchase page:** no thumbnails for now (extra bandwidth, live fill, cost). Skyler owns
  the revision.
- [ ] **My Videos:** Aryan owns it.
- [ ] **Support:** fine as is; trim the extra text.
- [ ] **FAQ:** fix the arrows that sit slightly off to the side.

---

## Who owns what (from the 10/13 call)

| Work | Owner |
|---|---|
| Merge all three branches into one build | **Aryan** |
| Purchase page revision, and folding the arena pages in | **Skyler** |
| My Videos page | **Aryan** |
| Copy pass | **Ana** |
| Logo revision | **Skyler** |
| This backlog | Whoever drives the build after the merge (Skyler or Aryan) |

The call's estimate: the merge takes the site from about 75% to about 90% done. After that,
check every page link, do a final copy pass, and it's ready to launch.

## Open questions

1. **Barn access without a code:** after signing in, how does a rider get to their barn?
   (Section A.)
2. **Ana:** a replacement line for the "For barns" card (B3; the draft above is a starting
   point), and is the "For riders" card approved as is?
3. **CTA destinations:** go through every audience button's destination together (C2).
4. **The 30-second real-site clip:** do we have sign-off from the first barn? If not, hide the
   player demo at launch (C4).
