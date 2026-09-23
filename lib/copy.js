// Copy for the Akture Equestrian mockup.
//
// House rules this file follows, because the first draft broke all of them:
//   · a heading says plainly what the thing is — no balanced two-clause titles,
//     no X-not-Y, no rhythmic triads, no number play
//   · say what something IS, not what it is not
//   · lead with what it does for the person reading
//
// Nothing here claims anything the 9/13 call does not support. No show-day
// pricing, no barn revenue share, no audio.

export const tickerLines = [
  'Arena cameras at your barn',
  'Up to 15 min $15 · up to 30 min $25 · up to 60 min $40',
  'Download your ride and keep it',
];

export const heroSlides = [
  {
    badge: 'For riders',
    line1: 'Watch your ride from',
    line2: 'every camera in the arena',
    description:
      'The cameras run through your lesson. Buy the time you rode in and the footage is yours.',
    image: 'heroGrassOxer',
    cta: { label: 'Find your ride', href: '/access' },
    secondary: { label: 'How it works', href: '/how-it-works' },
  },
  {
    badge: 'For families',
    line1: 'Watch the round again',
    line2: 'at home',
    description:
      'Buy the window around the class and send it to whoever could not make the drive.',
    image: 'heroSandJump',
    cta: { label: 'How it works', href: '/how-it-works' },
    secondary: { label: 'What it costs', href: '/pricing' },
  },
  {
    badge: 'For trainers',
    line1: 'Go back to the moment',
    line2: 'and look again',
    description:
      'Find the fence, slow it down, and change to the camera that shows what happened.',
    image: 'heroNightGrandPrix',
    cta: { label: 'See the player', href: '/aubreymeadows/covered/watch/aubreymeadows-covered-0916-1600' },
    secondary: { label: 'Barns', href: '/barns' },
  },
  {
    badge: 'For barns',
    line1: 'Bring the cameras',
    line2: 'to your arena',
    description:
      'The cameras go in once and run on their own. Your clients get a page only they can reach.',
    image: 'coveredArena',
    cta: { label: 'Talk to us', href: '/barns#bring-akture' },
    secondary: { label: 'What we install', href: '/how-it-works#what-we-install' },
  },
];

export const riderFeatures = [
  {
    icon: 'ph ph-clock-afternoon',
    title: 'The timeline runs in clock time',
    desc:
      'The timeline is labelled in clock time, so knowing roughly when she went in is enough to get you there.',
  },
  {
    icon: 'ph ph-gauge',
    title: 'Slow it down',
    desc:
      'Quarter speed shows the chip, the late lead, the moment the decision got made. Step a frame at a time when that is still too fast.',
  },
  {
    icon: 'ph ph-squares-four',
    title: 'Change cameras while it plays',
    desc:
      'Watch one camera or all of them at once. Switching keeps the clock where it was, so you see the same second from the other end of the arena.',
  },
  {
    icon: 'ph ph-download-simple',
    title: 'Download it and keep it',
    desc:
      'Your footage comes down uncut, from a fixed camera, with the date on it. That is what college programs and horse buyers ask to see.',
  },
];

export const barnFeatures = [
  {
    icon: 'ph ph-link-simple',
    title: 'Your barn gets its own page',
    desc:
      'equestrian.akture.video and your barn name. You hand clients a code once, and their account is tied to your barn from then on.',
  },
  {
    icon: 'ph ph-lock-simple',
    title: 'Your footage stays inside your barn',
    desc:
      'Only the accounts you have admitted can open your page. Your clients reach your arenas and nothing else.',
  },
  {
    icon: 'ph ph-wrench',
    title: 'The cameras run on their own',
    desc:
      'Mounted once, pointed once, left alone. Nothing to charge, nothing to carry to the ring, nobody pulled off the schedule to film a lesson.',
  },
];

export const multiCam = {
  eyebrow: 'Multiple cameras',
  heading: 'Change cameras while the ride plays',
  sub:
    'Every arena gets a wide camera down the long side and a camera at each end. They share a single timeline, so changing your view keeps the clock exactly where it was.',
  bullets: [
    {
      icon: 'ph ph-arrows-horizontal',
      title: 'The long side camera',
      desc:
        'The wide view down the length of the arena. Form over the fence, the release, the takeoff spot, the way of going.',
    },
    {
      icon: 'ph ph-crosshair',
      title: 'The end cameras',
      desc:
        'A camera at each end of the arena. Straightness, the track to the fence, whether the horse drifted coming or going.',
    },
    {
      icon: 'ph ph-timer',
      title: 'The shared timeline',
      desc:
        'A single scrub bar drives all the cameras together, so every view lands on the same instant of the ride.',
    },
  ],
};

export const theRig = {
  eyebrow: 'What we install',
  heading: 'What goes into your arena',
  sub:
    'Arenas are rectangular or oval and rarely have sharp corners, so a small number of fixed positions covers the whole of one. An arena with two rings gets a set for each, and each is sold on its own.',
};

export const howItWorks = [
  {
    step: '01',
    title: 'Enter your barn’s code',
    desc:
      'Your barn sends you a link with a code on it. Make an account, enter the code once — capitals do not matter — and your account is tied to that barn from then on. After that you just log in.',
  },
  {
    step: '02',
    title: 'Pick the day and the arena',
    desc:
      'Your barn’s page lists its arenas. Open the one you rode in and choose the day.',
  },
  {
    step: '03',
    title: 'Choose the time you rode in',
    desc:
      'The last two days are listed in 15-minute chunks. Narrow to the time you rode, select up to an hour in a row, and buy it.',
  },
  {
    step: '04',
    title: 'Watch it and download it',
    desc:
      'Every camera comes with the purchase, as a folder for each 15 minutes. Watch the folders in order, change views while it plays, and download them to keep.',
  },
];

export const pricingCopy = {
  eyebrow: 'Pricing',
  heading: 'Pay for the time you were in the arena',
  sub:
    'Footage is sold in 15-minute chunks, and every camera in the arena comes with each one. A round lasts about ninety seconds and a dressage test about five minutes, so one chunk holds the last warm-up fence, the gate, the ride itself and the jog afterwards.',
  tierNotes: [
    'A purchase is always every camera in the arena, for the stretch of time you pick.',
    'Footage is sold in 15-minute chunks. Buy up to four in a row — an hour is the most in one purchase.',
    'Each 15 minutes arrives as its own folder with every angle inside. Chunks are bought per arena.',
  ],
};

export const accessCopy = {
  eyebrow: 'Barn access',
  heading: 'Enter your barn’s code',
  sub:
    'Each barn has its own page, and your account is tied to the barn that invited you. Enter the code once when you create the account; after that you just log in.',
  codeFieldHelp:
    'The code came in the link from your barn. Enter it once and it is remembered — after that you just sign in. Ask the barn office if you have lost it.',
};

export const faq = [
  {
    q: 'Was my ride recorded?',
    a: 'If it happened in an arena with cameras, during the hours your barn runs them, it is listed on that arena’s page for 48 hours. Open the arena, pick the day and the time, and buy the chunks you rode in. Every camera comes with them. If you go to the right time and find nothing listed, tell us and we will tell you why.',
  },
  {
    q: 'Who else can see my daughter’s rides?',
    a: 'Access starts with your barn. Only accounts your barn has admitted can open its page at all — there is no public feed and no search across barns. Anything you buy sits on your account, and it goes to social media only if you put it there yourself.',
  },
  {
    q: 'I do not know exactly when she went in. How do I find the ride?',
    a: 'The arena page lists the day in 15-minute chunks by clock time, and each one that lines up with the barn’s schedule is labelled. Knowing roughly when she went in is enough to pick the right chunk. On a show day, buy the whole class and find the round inside it.',
  },
  {
    q: 'What happens if the ride ran past the window I bought?',
    a: 'Buy the next chunk. If you are unsure where a class will land, buy wider up front — an hour in one purchase is $39.99, and two half-hours come to $49.98.',
  },
  {
    q: 'Do the cameras record sound?',
    a: 'No. The arena cameras record video only, so your trainer’s voice and anything said at the rail stay in the arena.',
  },
  {
    q: 'What do the cameras cover?',
    a: 'The arena they are mounted in. Cross-country, the hacking fields, trail rides, turnout and the barn aisle are all outside what they see, and so is the schooling ring unless your barn has cameras there too. For eventing that means the dressage test and the show jumping round are covered end to end, and cross-country is not. We would rather say that now than after your first event.',
  },
  {
    q: 'How long is footage available to buy?',
    a: 'For 48 hours after it is recorded. After that it comes down, so if a lesson mattered, buy it that day or the next.',
  },
  {
    q: 'How long do my purchases stay in My Videos?',
    a: 'For a limited time — each folder shows the date it comes down. Download it before then and it is yours for good, on your own device.',
  },
  {
    q: 'Can I use the footage for college video or to sell a horse?',
    a: 'That is one of the better uses for it. What you download is uncut, from a fixed camera, with the date on it. Buyers looking at a horse from out of state want exactly that, and unedited video from one consistent camera is what college programs ask to see.',
  },
  {
    q: 'Will this work on my phone at the showgrounds?',
    a: 'It runs in your phone’s browser, so there is nothing to install. Showground service is genuinely bad in a lot of places — buy the chunks anyway and download them over wifi that night. They wait in My Videos until you do.',
  },
  {
    q: 'My barn does not have cameras. Can I still buy my rides?',
    a: 'Not yet. The cameras go in at the barn and the barn hosts its own page. Tell your trainer or barn manager if you would like your barn on it, and have them get in touch with us.',
  },
];

export const footerBlurb =
  'Akture Equestrian is the equestrian side of Akture, a video capture and streaming platform. Fixed cameras in the arena, one shared timeline, and footage that goes back to the riders, families and trainers who were in the ring.';
