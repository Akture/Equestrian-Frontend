// Every URL here was checked with a HEAD request and returned 200 image/jpeg.
// Fabricated photo IDs were used as negative controls and returned 404, so the
// check discriminates rather than passing everything.
const u = (id, w = 2400) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&q=80`;

export const media = {
  // Hero — wide frames with an empty left third for the headline
  heroGrassOxer: u('1559295928-6964f905e9c7'),
  heroSandJump: u('1580579944142-2d7913587151'),
  heroNightGrandPrix: u('1698336786171-3a7c3e3b9771'),

  // The three-angle set: one horse, one rider, one ring, one session, three
  // camera positions. This is why the synced-timeline mockup reads as real.
  camSide: u('1690112329897-0c7e37e89b71'),
  camInGate: u('1690112328558-0bfc0d32bf0d'),
  camFarEnd: u('1690112330355-300fa08844b7'),

  coveredArena: u('1726209431921-71cb661b4dbf'),
  barnAisleBright: u('1694885143306-3dfea504b032'),
  barnAisleWarm: u('1576692192914-9abed71b3ef9'),
  extendedTrot: u('1595675759752-a743a9b71d93'),
  riderPortrait: u('1613085007510-996e4b63d8d3', 1200),
  showRing: u('1512934772407-b292436089ee', 1600), // small original — never full-bleed
  western: u('1741665157800-6d64566c55f9', 1600),
  tackDetail: u('1650397306188-53f940e7ebb4', 1600),
};

// The three fixed feeds, in rail order. Positions match the rig every arena gets.
export const feeds = [
  {
    id: 'side',
    label: 'Long Side',
    angle: '180°',
    resolution: '3040 × 1368',
    position: 'Long side, mid-arena',
    reads: 'Distances, pace, and the shape of the jump',
    poster: media.camSide,
    key: '1',
  },
  {
    id: 'ingate',
    label: 'In Gate',
    angle: '90°',
    resolution: '2688 × 1520',
    position: 'Short end, gate side',
    reads: 'Straightness in the turn, and the walk to the gate',
    poster: media.camInGate,
    key: '2',
  },
  {
    id: 'farend',
    label: 'Far End',
    angle: '90°',
    resolution: '2688 × 1520',
    position: 'Short end, opposite',
    reads: 'Head-on approach and the landing side',
    poster: media.camFarEnd,
    key: '3',
  },
];

// Local sample clips used by the preview and seeded purchased folders.
export const previewVideos = {
  side: '/videos/Horsey.mp4',
  ingate: '/videos/Horsey%202.mp4',
  farend: '/videos/Horsey%203.mp4',
};
