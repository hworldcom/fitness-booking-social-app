export type Discipline = "Running" | "Strength" | "Muay Thai" | "Yoga";
export type ChallengeMode = "community" | "sponsored";
export type ClubChallenge = {
  id: string;
  title: string;
  description: string;
  discipline: Discipline;
  mode: ChallengeMode;
  organizer: string;
  entry: number;
  prize: number;
  participants: number;
  capacity: number;
  date: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  venueId?: string;
  duration: string;
  artwork: "run" | "strength" | "flow";
  rules: string;
  award?: {
    summary: string;
    criteria: string;
    selection: string;
    prize: string;
  };
};
export const challenges: ClubChallenge[] = [
  {
    id: "before-coffee",
    title: "The 5K before coffee",
    description:
      "A little fresh air. A few familiar faces. Three morning runs together, then a well-earned coffee.",
    discipline: "Running",
    mode: "community",
    organizer: "Daniel's run club",
    entry: 2,
    prize: 10,
    participants: 5,
    capacity: 10,
    date: "22–29 Sep",
    startDate: "2026-09-22",
    endDate: "2026-09-29",
    createdAt: "2026-09-16T10:00:00Z",
    duration: "7 days",
    artwork: "run",
    rules:
      "Complete three 5K runs during the challenge. Share your progress with the group. Participants vote after the challenge ends.",
  },
  {
    id: "show-up-club",
    title: "The show-up club",
    description:
      "Build a consistent training week. Complete at least three gym-confirmed visits and compete for the 10 test EURC prize, awarded to one participant by Fabrik Training.",
    discipline: "Strength",
    mode: "sponsored",
    organizer: "Fabrik Training",
    entry: 0,
    prize: 10,
    participants: 7,
    capacity: 10,
    date: "22–29 Sep",
    startDate: "2026-09-22",
    endDate: "2026-09-29",
    createdAt: "2026-09-18T10:00:00Z",
    venueId: "fabrik",
    duration: "7 days",
    artwork: "strength",
    rules:
      "Attend at least three gym-confirmed visits at Fabrik Training during the challenge. The participant with the most eligible visits is the leading candidate for the prize.",
    award: {
      summary: "One winner · 10 test EURC",
      criteria:
        "Most gym-confirmed visits at Fabrik Training during 22–29 September, with at least three visits to qualify. At most one visit per venue-local day counts under the proposed demo policy.",
      selection:
        "Fabrik Training chooses one winner within 24 hours after the challenge ends. If eligible participants tie on visits, the organizer chooses the person who most supported others: welcoming newcomers and encouraging the group. This is a human judgment, not an automatic on-chain score.",
      prize:
        "The selected winner receives the entire 10 test EURC sponsored pool. Completing three visits makes you eligible; it does not guarantee a prize. If nobody qualifies, the organizer makes no selection and the 24-hour equal-split fallback applies.",
    },
  },
  {
    id: "find-your-flow",
    title: "Find your flow",
    description:
      "Make a little space for yourself. Five mindful sessions, one supportive community.",
    discipline: "Yoga",
    mode: "community",
    organizer: "Lea's movement circle",
    entry: 2,
    prize: 6,
    participants: 3,
    capacity: 10,
    date: "23–30 Sep",
    startDate: "2026-09-23",
    endDate: "2026-09-30",
    createdAt: "2026-09-17T10:00:00Z",
    duration: "7 days",
    artwork: "flow",
    rules:
      "Complete five movement or yoga sessions and share a short reflection with your group. Participants vote at the end.",
  },
];
export type ClubClass = {
  id: string;
  title: string;
  gym: string;
  gymId: string;
  area: string;
  trainer: string;
  discipline: Discipline;
  day: string;
  date: string;
  time: string;
  dateISO: string;
  duration: number;
  price: number;
  spots: number;
  membership: boolean;
  description: string;
  artwork: "fight" | "strength" | "flow";
};
export const classes: ClubClass[] = [
  {
    id: "muay-thai",
    title: "Muay Thai fundamentals",
    gym: "Kru Tiger",
    gymId: "kru-tiger",
    area: "Kreuzberg",
    trainer: "Kru Sam",
    discipline: "Muay Thai",
    day: "TUE",
    date: "22 Sep",
    dateISO: "2026-09-22",
    time: "18:00",
    duration: 60,
    price: 12,
    spots: 4,
    membership: true,
    artwork: "fight",
    description:
      "Find your footing, build your confidence. A welcoming session covering stance, movement and pad work. All levels welcome; bring water and a towel.",
  },
  {
    id: "strength",
    title: "Strength, together",
    gym: "Fabrik Training",
    gymId: "fabrik",
    area: "Neukölln",
    trainer: "Maya Fischer",
    discipline: "Strength",
    day: "WED",
    date: "23 Sep",
    dateISO: "2026-09-23",
    time: "17:30",
    duration: 50,
    price: 18,
    spots: 6,
    membership: false,
    artwork: "strength",
    description:
      "A small-group strength session built around good technique and mutual encouragement. Squats, carries and a little more confidence than you came in with.",
  },
  {
    id: "sunday-flow",
    title: "Sunday reset flow",
    gym: "Studio Vela",
    gymId: "vela",
    area: "Prenzlauer Berg",
    trainer: "Lea Weber",
    discipline: "Yoga",
    day: "SUN",
    date: "27 Sep",
    dateISO: "2026-09-27",
    time: "10:00",
    duration: 75,
    price: 15,
    spots: 8,
    membership: false,
    artwork: "flow",
    description:
      "Slow down and find your rhythm. Gentle movement, spacious breathing and a long stretch to send you into the new week feeling grounded.",
  },
];
export type ClubStudio = {
  id: string;
  name: string;
  area: string;
  activities: Discipline[];
  coaches: string[];
  description: string;
  artwork: ClubClass["artwork"];
};

export const studios: ClubStudio[] = [
  {
    id: "kru-tiger",
    name: "Kru Tiger",
    area: "Kreuzberg",
    activities: ["Muay Thai"],
    coaches: ["Kru Sam"],
    description:
      "Find your footing in a welcoming room. Technique, pad work and good people on the mats.",
    artwork: "fight",
  },
  {
    id: "fabrik",
    name: "Fabrik Training",
    area: "Neukölln",
    activities: ["Strength"],
    coaches: ["Maya Fischer"],
    description:
      "Small groups, thoughtful coaching and a little encouragement. Build strength at your own pace.",
    artwork: "strength",
  },
  {
    id: "vela",
    name: "Studio Vela",
    area: "Prenzlauer Berg",
    activities: ["Yoga"],
    coaches: ["Lea Weber"],
    description:
      "A little space to slow down. Gentle movement, mindful breathing and a community that makes you feel at home.",
    artwork: "flow",
  },
];

export const people = [
  {
    id: "daniel",
    name: "Daniel Park",
    initials: "DP",
    bio: "Runs on good coffee",
    color: "peach",
  },
  {
    id: "lea",
    name: "Lea Weber",
    initials: "LW",
    bio: "Yoga & everyday movement",
    color: "lavender",
  },
  {
    id: "max",
    name: "Max Müller",
    initials: "MM",
    bio: "Always up for one more rep",
    color: "blue",
  },
];
export const formatEurc = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
