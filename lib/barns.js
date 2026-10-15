// MOCK DATA for the mockup. None of these are signed partners. The Demo Barn is
// the worked example; the rest are placeholders so the index page reads the way
// it would with a roster behind it. Real barns are added only once signed.
//
// One arena per barn: at launch Akture installs in a single arena at each
// location. A barn with a second install later gets a second entry here.

export const barns = [
  {
    slug: 'demo',
    name: 'Demo Barn',
    shortName: 'Demo Barn',
    city: 'Mock data — for testing the flow',
    disciplines: ['Hunter', 'Jumper'],
    blurb:
      'A stand-in barn with one covered arena and mock footage for trying the purchase and playback flow.',
    availability:
      'Monday to Friday: 8am to 5pm · Saturday & Sunday: 9am to 12pm. Any changes to footage availability will be reflected here. Footage is available for sale for up to 48 hours after recording.',
    image:
      'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    arena: {
      slug: 'covered',
      name: 'Covered Arena',
      dims: '120 × 240 ft',
      surface: 'Sand and fiber',
      use: 'Lessons and schooling',
      image:
        'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    },
  },
  {
    slug: 'stonebridge',
    name: 'Stonebridge Equestrian',
    shortName: 'Stonebridge',
    city: 'Argyle, Texas',
    disciplines: ['Hunter', 'Jumper'],
    blurb:
      'A hunter and jumper program with a covered arena, hosting schooling shows most months.',
    image:
      'https://images.unsplash.com/photo-1694885143306-3dfea504b032?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    arena: {
      slug: 'covered',
      name: 'Covered Arena',
      dims: '120 × 240 ft',
      surface: 'Sand and fiber',
      use: 'Lessons and schooling',
      image:
        'https://images.unsplash.com/photo-1694885143306-3dfea504b032?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    },
  },
  {
    slug: 'willowrun',
    name: 'Willow Run Farm',
    shortName: 'Willow Run',
    city: 'Pilot Point, Texas',
    disciplines: ['Dressage', 'Eventing'],
    blurb:
      'A dressage and eventing barn with a covered arena, running clinics through the spring.',
    image:
      'https://images.unsplash.com/photo-1576692192914-9abed71b3ef9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    arena: {
      slug: 'covered',
      name: 'Covered Arena',
      dims: '20 × 60 m',
      surface: 'Fiber',
      use: 'Tests, lessons, clinics',
      image:
        'https://images.unsplash.com/photo-1595675759752-a743a9b71d93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    },
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
    arena: {
      slug: 'covered',
      name: 'Covered Pen',
      dims: '130 × 260 ft',
      surface: 'Sand',
      use: 'Patterns, lessons, clinics',
      image:
        'https://images.unsplash.com/photo-1741665157800-6d64566c55f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    },
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
    arena: {
      slug: 'covered',
      name: 'Covered Arena',
      dims: '150 × 300 ft',
      surface: 'Sand and fiber',
      use: 'Lessons, schooling, winter series',
      image:
        'https://images.unsplash.com/photo-1698336786171-3a7c3e3b9771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    },
  },
  {
    slug: 'fieldstone',
    name: 'Fieldstone Riding Club',
    shortName: 'Fieldstone',
    city: 'Denton, Texas',
    disciplines: ['Hunter', 'Equitation'],
    blurb:
      'A lesson and boarding barn with an indoor arena, sending juniors to rated shows through the season.',
    image:
      'https://images.unsplash.com/photo-1613085007510-996e4b63d8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    arena: {
      slug: 'indoor',
      name: 'Indoor Arena',
      dims: '100 × 200 ft',
      surface: 'Sand and fiber',
      use: 'Lessons year round',
      image:
        'https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    },
  },
];

export function getBarn(slug) {
  return barns.find((b) => b.slug === slug) || null;
}

export function getArena(barnSlug, arenaSlug) {
  const barn = getBarn(barnSlug);
  if (!barn || barn.arena.slug !== arenaSlug) return null;
  return barn.arena;
}

export function allArenaParams() {
  return barns.map((b) => ({ barn: b.slug, arena: b.arena.slug }));
}

// The fixed camera positions every arena gets.
export const cameraRig = [
  {
    id: 'side',
    label: 'The rail',
    position: 'On the rail, at the middle of the long side',
    reads: 'The classic trainer’s view: your position, the horse’s shape over the fence, and your distances',
    icon: 'ph-bold ph-arrows-horizontal',
  },
  {
    id: 'inGate',
    label: 'Gate end',
    position: 'At the in-gate, looking down the ring',
    reads: 'The horse coming home: the approach, the last line, and the walk out',
    icon: 'ph-bold ph-sign-in',
  },
  {
    id: 'farEnd',
    label: 'Far end',
    position: 'At the far end, opposite the gate',
    reads: 'Every line ridden away from home, head-on, and how straight you stay through the turn',
    icon: 'ph-bold ph-crosshair',
  },
];
