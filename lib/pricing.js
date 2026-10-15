// Draft pricing from the 9/13 team call. Show-day pricing is deliberately not
// modelled here — it is dynamic, barn-by-barn, and a V2 decision.
export const timeTiers = [
  {
    id: 'w15',
    window: 'Up to 15 minutes',
    price: 15,
    blurb: 'Enough for a single round and the minutes on either side of it.',
    fits: ['A single course', 'A dressage test', 'A flat class'],
    highlight: false,
  },
  {
    id: 'w30',
    window: 'Up to 30 minutes',
    price: 25,
    blurb: 'Half a lesson, or a division with a few trips and the hack.',
    fits: ['Half a lesson', 'Two or three rounds', 'Warm-up plus the round'],
    highlight: true,
  },
  {
    id: 'w60',
    window: 'Up to 60 minutes',
    price: 40,
    blurb: 'A full lesson start to finish, tack-up walk to final cool-out.',
    fits: ['A full lesson', 'A clinic session', 'A long schooling day'],
    highlight: false,
  },
];

export const includedInEveryWindow = [
  'Every camera in the arena',
  'Download in HD — yours to keep',
  'Pay only for the videos you want',
  'Shareable link for family who could not make it',
  'Available in your account within the hour',
  'Your trainer can be added to any purchase',
];

export const hardCapNote =
  'An hour is the longest single window. That is where the recording holds up cleanly across every camera in the arena, so a longer session is bought as two windows.';
