export type Discipline = "Running" | "Strength" | "Muay Thai" | "Yoga";

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
