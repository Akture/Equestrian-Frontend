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
  'No subscription · starting at $15 for your video',
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
    // Riders sit high in these frames: start the photo below the floating
    // header and set a focal point so the helmet is never cropped.
    imageTop: true,
    focus: 'center top',
    cta: { label: 'Purchase footage', href: '/demo' },
    secondary: { label: 'How it works', href: '/how-it-works' },
  },
  {
    badge: 'For families',
    line1: 'Watch the round again',
    line2: 'at home',
    description:
      'Families no longer have the responsibility of filming. Our cameras capture it all, from entering the ring until the course is complete.',
    image: 'heroSandJump',
    imageTop: true,
    focus: 'center 30%',
    cta: { label: 'How it works', href: '/how-it-works' },
    secondary: { label: 'What it costs', href: '/pricing' },
  },
  {
    badge: 'For trainers',
    line1: 'Go back to the moment',
    line2: 'and look again',
    description:
      'Find the challenging combination, slow it down, and use the footage to reinforce the right rhythm and pace to nail the perfect distance.',
    image: 'heroNightGrandPrix',
    imageTop: true,
    focus: 'center top',
    cta: { label: 'See the player', href: '/demo/covered/watch/player-preview' },
    secondary: { label: 'Barns', href: '/barns' },
  },
  {
    badge: 'For barns',
    line1: 'Bring the cameras',
    line2: 'to your arena',
    description:
      'The cameras go in once and just work: no staff time, no management. Your clients find their rides in minutes, and you get footage for your own marketing.',
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
    icon: 'ph ph-play-circle',
    title: 'Your clients can access their videos easily',
    desc:
      'Riders and families sign in, pick the day and the time they rode, and the footage is theirs to watch and download. No one has to ask your office.',
  },
  {
    icon: 'ph ph-wrench',
    title: 'No overhead, no management. It just works',
    desc:
      'Mounted once, pointed once, left alone. Nothing to charge, nothing to carry to the ring, and no one pulled off the schedule to film a lesson.',
  },
  {
    icon: 'ph ph-megaphone',
    title: 'Marketing material for your barn',
    desc:
      'Lessons, clinics and shows from every camera in your arena: a steady source of promotional footage for your own site and social pages.',
  },
];

export const multiCam = {
  eyebrow: 'Every angle',
  heading: 'See the whole ride, from every side',
  sub:
    'Three cameras cover the arena: one down the long side and one at each end. Switch between them while the ride plays and you stay on the same moment.',
  bullets: [
    {
      icon: 'ph ph-arrows-horizontal',
      title: 'The long side',
      desc:
        'The wide view down the length of the arena. Form over the fence, the release, the takeoff spot, the way of going.',
    },
    {
      icon: 'ph ph-crosshair',
      title: 'Both ends',
      desc:
        'A camera at each end of the arena. Straightness, the track to the fence, whether the horse drifted coming or going.',
    },
    {
      icon: 'ph ph-timer',
      title: 'Always in sync',
      desc:
        'A single scrub bar drives all the cameras together, so every view lands on the same instant of the ride.',
    },
  ],
};

export const theRig = {
  eyebrow: 'What we install',
  heading: 'What goes into your arena',
  sub:
    'Arenas are rectangular or oval and rarely have sharp corners, so a small number of fixed positions covers the whole of one.',
};

export const howItWorks = [
  {
    step: '01',
    title: 'Sign in or create an account',
    desc:
      'Use your email and password or continue with Google to open your barn.',
  },
  {
    step: '02',
    title: 'Pick the day',
    desc:
      'Your barn page lists the footage from its arena for the last 48 hours. Choose the day you rode.',
  },
  {
    step: '03',
    title: 'Choose the time you rode',
    desc:
      'Footage from the last 48 hours is listed earliest-first in collapsed Morning, Afternoon, and Evening sections. Narrow by day and time, then select up to an hour in a row.',
  },
  {
    step: '04',
    title: 'It’s yours to watch or download',
    desc:
      'Every camera comes with the purchase, as a folder for each 15 minutes. Watch a full day on one timeline, change views while it plays, and download a timestamp or a full day as a ZIP.',
  },
];

export const pricingCopy = {
  eyebrow: 'Pricing',
  heading: 'Simple pricing',
  sub:
    'Riders pay only for the videos they want. Barns pay once to install. Nobody pays a subscription.',
  riders: {
    label: 'For riders and families',
    lead: 'Starting at $15',
    unit: 'for your video',
    points: ['No subscription required', 'Every camera in the arena comes with it', 'Download it and keep it'],
  },
  barns: {
    label: 'For barns',
    lead: 'One installation fee',
    unit: 'no recurring subscription',
    points: ['We scope, install and maintain the cameras', 'Your clients buy their own footage', 'Talk to us for a quote for your arena'],
  },
};

export const accessCopy = {
  eyebrow: 'Your barn',
  heading: 'Log in or create an account',
  sub:
    'Use your email and password, or continue with Google. Once signed in, you can browse available footage at your barn.',
};

export const faq = [
  {
    q: 'Was my ride recorded?',
    a: 'If it happened in an arena with cameras, during the hours your barn runs them, it is listed on your barn’s footage page for 48 hours. Pick the day and time, then check the arena named on each segment. Every camera comes with the footage. If you go to the right time and find nothing listed, tell us and we will tell you why.',
  },
  {
    q: 'Who else can see my daughter’s rides?',
    a: 'Your barn’s footage is listed on its barn page, which requires an account to open. Anything you buy sits on your account, and it goes to social media only if you put it there yourself.',
  },
  {
    q: 'I do not know exactly when she went in. How do I find the ride?',
    a:     'The barn page lists available footage in 15-minute chunks, earliest-first within each day. Open the Morning, Afternoon, or Evening section, narrow by day and time, then select up to four consecutive chunks.',
  },
  {
    q: 'What happens if the ride ran past the window I bought?',
    a: 'Buy the next stretch of footage. If you are unsure where a class will land, buy a little wider up front so the whole ride is covered.',
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
    a: 'Not yet. The cameras are installed at the barn, so your barn needs to be on Akture first. Tell your trainer or barn manager if you would like it, and have them get in touch with us.',
  },
];

// How a barn gets set up (10/13 review): scoping call, site visit, one-day
// install, live on Akture.
export const barnSteps = [
  {
    icon: 'ph ph-phone',
    title: 'A scoping call',
    desc: 'Tell us about your arena, your programs and your show calendar. We tell you what an install looks like.',
  },
  {
    icon: 'ph ph-path',
    title: 'A site visit',
    desc: 'We walk the arena: dimensions, sight lines, power, and where the internet actually reaches.',
  },
  {
    icon: 'ph ph-wrench',
    title: 'A one-day installation',
    desc: 'A wide camera down the long side and one at each end, mounted and pointed in a day. Your staff have nothing to charge, carry or aim.',
  },
  {
    icon: 'ph ph-check-circle',
    title: 'Live on Akture',
    desc: 'Your clients sign in, find their rides and buy their footage. We keep the cameras running.',
  },
];

export const footerBlurb =
  'Akture Equestrian is the equestrian side of Akture, a video capture and streaming platform. Fixed cameras in the arena, one shared timeline, and footage that goes back to the riders, families and trainers who were in the ring.';
