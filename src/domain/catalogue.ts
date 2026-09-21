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
  description: string;
  artwork: "fight" | "strength" | "flow";
};

export type ClubStudio = {
  id: string;
  name: string;
  area: string;
  activities: Discipline[];
  coaches: string[];
  description: string;
  artwork: ClubClass["artwork"];
};
