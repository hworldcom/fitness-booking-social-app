import type { ClubStudio } from "@/domain/catalogue";

export const studios: ClubStudio[] = [
  {
    id: "northside-combat",
    name: "Northside Combat",
    area: "Kreuzberg",
    activities: ["Muay Thai"],
    coaches: ["Sam Lee"],
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
