import type { ClubClass, ClubStudio } from "@/domain/catalogue";
import type { ClubEvent } from "@/domain/events";

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
    artwork: "flow",
    description:
      "Slow down and find your rhythm. Gentle movement, spacious breathing and a long stretch to send you into the new week feeling grounded.",
  },
];

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

export const events: ClubEvent[] = [
  {
    id: "run-and-coffee",
    title: "Run & Coffee",
    host: "Sunday Coffee",
    location: "Meet outside Sunday Coffee · Kreuzberg, Berlin",
    description:
      "An easy-paced 5K with your neighbours, followed by a coffee together. Meet at the café at 09:00; we’ll run as a group and return for a relaxed catch-up. All paces welcome.",
    included:
      "One guided social 5K run and one regular coffee afterwards, per ticket. Choose an espresso, americano or filter coffee at the café. Extras are not included.",
    discipline: "Running",
    dateISO: "2026-09-27",
    time: "09:00",
    duration: 90,
    capacity: 12,
    price: 2,
  },
];
