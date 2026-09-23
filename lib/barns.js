// MOCK DATA for the mockup. None of these are signed partners.
// Aubrey Meadows is the barn named on the 9/13 call and its arena dimensions are
// the real ones Anna collected; the rest are placeholders so the index page reads
// the way it would with a roster behind it.

export const barns = [
  {
    // The demo barn from the 9/20 call: code AA1111, mock data, so the team can
    // walk account creation and the barn-code flow before the backend exists.
    slug: 'demo',
    name: 'Demo Barn',
    shortName: 'Demo Barn',
    city: 'Mock data — for testing the flow',
    disciplines: ['Hunter', 'Jumper'],
    blurb:
      'A stand-in barn with one covered arena and a day of mock footage. Use code AA1111 to try account creation and the barn-code flow end to end.',
    image:
      'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'AA',
    arenas: [
      {
        slug: 'covered',
        name: 'Covered Arena',
        dims: '120 × 240 ft',
        surface: 'Sand and fiber',
        use: 'Lessons and schooling',
        image:
          'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
  {
    slug: 'aubreymeadows',
    name: 'Aubrey Meadows',
    shortName: 'Aubrey Meadows',
    city: 'Aubrey, Texas',
    disciplines: ['Hunter', 'Jumper', 'Equitation'],
    blurb:
      'A full show facility with a covered arena and an outdoor ring, running lessons through the week and rated shows through the season.',
    image:
      'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'AM-',
    arenas: [
      {
        slug: 'covered',
        name: 'Covered Arena',
        dims: '140 × 280 ft',
        surface: 'Sand and fiber',
        use: 'Lessons, schooling, winter shows',
        image:
          'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
      {
        slug: 'outdoor',
        name: 'Outdoor Arena',
        dims: '130 × 240 ft',
        surface: 'Sand',
        use: 'Shows, outdoor courses, hacking',
        image:
          'https://images.unsplash.com/photo-1512934772407-b292436089ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
  {
    slug: 'stonebridge',
    name: 'Stonebridge Equestrian',
    shortName: 'Stonebridge',
    city: 'Argyle, Texas',
    disciplines: ['Hunter', 'Jumper'],
    blurb:
      'A hunter and jumper program with a covered arena and a grass derby field, hosting schooling shows most months.',
    image:
      'https://images.unsplash.com/photo-1694885143306-3dfea504b032?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'SB-',
    arenas: [
      {
        slug: 'covered',
        name: 'Covered Arena',
        dims: '120 × 240 ft',
        surface: 'Sand and fiber',
        use: 'Lessons and schooling',
        image:
          'https://images.unsplash.com/photo-1694885143306-3dfea504b032?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
      {
        slug: 'derby',
        name: 'Derby Field',
        dims: '200 × 320 ft',
        surface: 'Grass',
        use: 'Derbies and outdoor courses',
        image:
          'https://images.unsplash.com/photo-1559295928-6964f905e9c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
  {
    slug: 'willowrun',
    name: 'Willow Run Farm',
    shortName: 'Willow Run',
    city: 'Pilot Point, Texas',
    disciplines: ['Dressage', 'Eventing'],
    blurb:
      'A dressage and eventing barn with a covered arena and a grass ring, running clinics through the spring.',
    image:
      'https://images.unsplash.com/photo-1576692192914-9abed71b3ef9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'WR-',
    arenas: [
      {
        slug: 'covered',
        name: 'Covered Arena',
        dims: '20 × 60 m',
        surface: 'Fiber',
        use: 'Tests, lessons, clinics',
        image:
          'https://images.unsplash.com/photo-1595675759752-a743a9b71d93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
      {
        slug: 'grass',
        name: 'Grass Ring',
        dims: '150 × 250 ft',
        surface: 'Grass',
        use: 'Schooling and shows',
        image:
          'https://images.unsplash.com/photo-1580579944142-2d7913587151?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
  {
    slug: 'cedarhollow',
    name: 'Cedar Hollow Stables',
    shortName: 'Cedar Hollow',
    city: 'Weatherford, Texas',
    disciplines: ['Reining', 'Western'],
    blurb:
      'A reining and western program working out of a covered pen, with clinics and futurity prep through the year.',
    image:
      'https://images.unsplash.com/photo-1741665157800-6d64566c55f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'CH-',
    arenas: [
      {
        slug: 'covered',
        name: 'Covered Pen',
        dims: '130 × 260 ft',
        surface: 'Sand',
        use: 'Patterns, lessons, clinics',
        image:
          'https://images.unsplash.com/photo-1741665157800-6d64566c55f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
  {
    slug: 'brightwater',
    name: 'Brightwater Sport Horses',
    shortName: 'Brightwater',
    city: 'Celina, Texas',
    disciplines: ['Jumper', 'Equitation'],
    blurb:
      'A jumper barn with one large covered arena, running lessons six days a week and a winter schooling series.',
    image:
      'https://images.unsplash.com/photo-1698336786171-3a7c3e3b9771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'BW-',
    arenas: [
      {
        slug: 'covered',
        name: 'Covered Arena',
        dims: '150 × 300 ft',
        surface: 'Sand and fiber',
        use: 'Lessons, schooling, winter series',
        image:
          'https://images.unsplash.com/photo-1698336786171-3a7c3e3b9771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
  {
    slug: 'fieldstone',
    name: 'Fieldstone Riding Club',
    shortName: 'Fieldstone',
    city: 'Denton, Texas',
    disciplines: ['Hunter', 'Equitation'],
    blurb:
      'A lesson and boarding barn with an indoor and an outdoor ring, sending juniors to rated shows through the season.',
    image:
      'https://images.unsplash.com/photo-1613085007510-996e4b63d8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    accessCodeHint: 'FS-',
    arenas: [
      {
        slug: 'indoor',
        name: 'Indoor Arena',
        dims: '100 × 200 ft',
        surface: 'Sand and fiber',
        use: 'Lessons year round',
        image:
          'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
      {
        slug: 'outdoor',
        name: 'Outdoor Ring',
        dims: '120 × 220 ft',
        surface: 'Sand',
        use: 'Schooling and summer lessons',
        image:
          'https://images.unsplash.com/photo-1580579944142-2d7913587151?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      },
    ],
  },
];

export function getBarn(slug) {
  return barns.find((b) => b.slug === slug) || null;
}

export function getArena(barnSlug, arenaSlug) {
  const barn = getBarn(barnSlug);
  if (!barn) return null;
  return barn.arenas.find((a) => a.slug === arenaSlug) || null;
}

export function allArenaParams() {
  return barns.flatMap((b) => b.arenas.map((a) => ({ barn: b.slug, arena: a.slug })));
}

// The fixed camera positions every arena gets.
export const cameraRig = [
  {
    id: 'side',
    label: 'Long side',
    position: 'Long side, mid-arena',
    reads: 'Distances, pace, and the shape of the jump',
    icon: 'ph-bold ph-arrows-horizontal',
  },
  {
    id: 'inGate',
    label: 'Gate end',
    position: 'Short end, gate side',
    reads: 'Straightness through the turn, and the walk to the gate',
    icon: 'ph-bold ph-sign-in',
  },
  {
    id: 'farEnd',
    label: 'Far end',
    position: 'Short end, opposite',
    reads: 'The head-on approach and the landing side',
    icon: 'ph-bold ph-crosshair',
  },
];
