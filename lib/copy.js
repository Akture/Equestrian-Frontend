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
//
// Voice: short declaratives, "you" and "your", and the ring named the way
// riders name it: the rail, the in-gate, the far end, coming home. No camera
// jargon. Say where a camera is in words a parent knows, then say what you
// would see from it, in a full sentence.

export const tickerLines = [
  'Cameras in the ring at your barn',
  'No subscription · starting at $15.99 for your video',
  'Download your ride and keep it',
];

export const heroSlides = [
  {
    badge: 'For riders',
    line1: 'Watch your ride from',
    line2: 'every camera in the arena',
    description:
      'The cameras are already rolling when you walk in. Pick the time you rode, and every angle of it is yours to keep.',
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
    title: 'Find it by the clock',
    desc:
      'Footage is listed by the time of day. If you know roughly when she went in, you will find the ride in a few seconds.',
  },
  {
    icon: 'ph ph-gauge',
    title: 'Slow it down',
    desc:
      'Watch the round at quarter speed and see the distance, the lead change, and the moment it went right or wrong. Step through it a frame at a time when you need to.',
  },
  {
    icon: 'ph ph-squares-four',
    title: 'Switch cameras mid-ride',
    desc:
      'Watch from the rail, the in-gate or the far end, or all three at once. Switch views and the ride keeps playing from the same moment.',
  },
  {
    icon: 'ph ph-download-simple',
    title: 'Download it and keep it',
    desc:
      'Your footage comes down uncut and dated, from a fixed camera. It is exactly what college coaches and horse buyers ask to see.',
  },
];

export const barnFeatures = [
  {
    icon: 'ph ph-play-circle',
    title: 'Your clients can access their videos easily',
    desc:
      'Riders and parents sign in, pick the day and the time they rode, and the footage is theirs to watch and download. Nobody has to ask the office.',
  },
  {
    icon: 'ph ph-wrench',
    title: 'No overhead, no management. It just works',
    desc:
      'The cameras are mounted once and left alone. Nothing to charge, nothing to carry to the ring, and nobody pulled off the schedule to film a lesson.',
  },
  {
    icon: 'ph ph-megaphone',
    title: 'Marketing material for your barn',
    desc:
      'Lessons, clinics and shows, from every angle in your ring. A steady supply of footage for your website and your social pages.',
  },
];

export const multiCam = {
  eyebrow: 'Every angle',
  heading: 'See the whole ride, from every side',
  sub:
    'Three cameras cover the ring: one on the rail, one at the in-gate and one at the far end. Switch between them while the ride plays and you stay on the same moment.',
  bullets: [
    {
      icon: 'ph ph-arrows-horizontal',
      title: 'The rail',
      desc:
        'Side-on from the middle of the long side. The classic trainer’s view: your position, the horse’s shape over the fence, and your distances.',
    },
    {
      icon: 'ph ph-crosshair',
      title: 'The gate end',
      desc:
        'Looking down the ring from the in-gate. You see the horse coming home: the approach, the last line, and the walk out.',
    },
    {
      icon: 'ph ph-timer',
      title: 'The far end',
      desc:
        'From the short end opposite the gate, head-on. Every line ridden away from home, and how straight you stay through the turn.',
    },
  ],
};

export const theRig = {
  eyebrow: 'What we install',
  heading: 'What goes into your ring',
  sub:
    'Three fixed cameras cover the whole ring: one on the rail, one at the in-gate and one at the far end. They go in once and record on their own.',
};

export const howItWorks = [
  {
    step: '01',
    title: 'Sign in or create an account',
    desc:
      'Use your email, or continue with Google. It takes a minute, and you only do it once.',
  },
  {
    step: '02',
    title: 'Pick the day',
    desc:
      'Your barn’s page lists the last 48 hours of footage from the ring. Choose the day you rode.',
  },
  {
    step: '03',
    title: 'Choose the time you rode',
    desc:
      'Footage is grouped by morning, afternoon and evening. Pick the stretch that covers your lesson or your round, up to an hour at a time.',
  },
  {
    step: '04',
    title: 'It’s yours to watch or download',
    desc:
      'Every camera comes with it. Watch from the rail, the gate or the far end, slow it down, and download it to keep.',
  },
];

export const pricingCopy = {
  eyebrow: 'Pricing',
  heading: 'Simple pricing',
  sub:
    'Riders pay for the videos they want and nothing else. Barns pay once for the install. Nobody pays a subscription.',
  riders: {
    label: 'For riders and families',
    lead: 'Starting at $15.99',
    unit: 'for your video',
    points: ['No subscription', 'Every camera in the ring, with every purchase', 'Yours to download and keep'],
  },
  barns: {
    label: 'For barns',
    lead: 'One installation fee',
    unit: 'no recurring subscription',
    points: ['We scope, install and look after the cameras', 'Your riders buy their own footage', 'Ask us for a quote for your ring'],
  },
};

export const accessCopy = {
  eyebrow: 'Your barn',
  heading: 'Log in or create an account',
  sub:
    'Use your email and password, or continue with Google. Once you are in, you will see the footage from your barn’s ring.',
};

export const faq = [
  {
    q: 'Was my ride recorded?',
    a: 'If you rode in the ring with cameras, during the hours your barn runs them, it is there. Footage stays up for 48 hours. Pick the day and the time, and every camera comes with it. If you go to the right time and find nothing, email us and we will find out why.',
  },
  {
    q: 'Who else can see my daughter’s rides?',
    a: 'Only people with an account at your barn can see the barn’s footage. What you buy sits in your account, and it goes on social media only if you put it there.',
  },
  {
    q: 'I do not know exactly when she went in. How do I find the ride?',
    a: 'Footage is listed by time of day and grouped into morning, afternoon and evening. Open the part of the day she rode and look through it until you see her. Roughly right is close enough.',
  },
  {
    q: 'What happens if the ride ran past the window I bought?',
    a: 'Buy the next stretch. If you are not sure when a class will go, buy a little wider up front so the whole round is covered.',
  },
  {
    q: 'Do the cameras record sound?',
    a: 'No. The cameras record video only. What your trainer says at the rail stays at the rail.',
  },
  {
    q: 'What do the cameras cover?',
    a: 'The ring they are mounted in. Cross-country, the hacking fields, turnout and the barn aisle are all out of view, and so is the schooling ring unless your barn has cameras there too. For eventers, that means the dressage test and the show jumping round are covered end to end, and cross-country is not.',
  },
  {
    q: 'How long is footage available to buy?',
    a: 'For 48 hours after it is recorded. After that it comes down, so if a lesson mattered, buy it that day or the next.',
  },
  {
    q: 'How long do my purchases stay in My Videos?',
    a: 'For a limited time. Each folder shows the date it comes down. Download it before then and it is yours for good.',
  },
  {
    q: 'Can I use the footage for college video or to sell a horse?',
    a: 'That is one of the best uses for it. What you download is uncut, from a fixed camera, with the date on it. That is exactly what college coaches and out-of-state buyers ask for.',
  },
  {
    q: 'Will this work on my phone at the showgrounds?',
    a: 'Yes. It runs in your phone’s browser, so there is nothing to install. Cell service at the showgrounds is often poor, so buy the footage there and download it over wifi that night. It waits in My Videos until you do.',
  },
  {
    q: 'My barn does not have cameras. Can I still buy my rides?',
    a: 'Not yet. The cameras go in at the barn, so your barn has to be on Akture first. Tell your trainer or barn manager, and have them get in touch with us.',
  },
  {
    q: 'I bought the wrong video. What do I do?',
    a: 'Email contact@akture.video with the date and time you meant to buy, and we will sort it out.',
  },
];

// How a barn gets set up: scoping call, site visit, one-day install, live on
// Akture.
export const barnSteps = [
  {
    icon: 'ph ph-phone',
    title: 'A scoping call',
    desc: 'Tell us about your ring, your programs and your show calendar. We tell you what an install looks like.',
  },
  {
    icon: 'ph ph-path',
    title: 'A site visit',
    desc: 'We walk the ring with you: size, sight lines, power, and where the internet actually reaches.',
  },
  {
    icon: 'ph ph-wrench',
    title: 'A one-day installation',
    desc: 'Three cameras, mounted and pointed in a day. Nothing for your staff to charge, carry or aim.',
  },
  {
    icon: 'ph ph-check-circle',
    title: 'Live on Akture',
    desc: 'Your riders sign in, find their rounds and buy the footage. We look after the cameras.',
  },
];

export const footerBlurb =
  'Akture Equestrian puts fixed cameras in your barn’s ring, so riders, parents and trainers can watch the ride again from every angle, and keep it.';
