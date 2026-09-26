export type Discipline = "Running" | "Strength" | "Muay Thai" | "Yoga";

export type ClubStudio = {
  id: string;
  name: string;
  area: string;
  activities: Discipline[];
  coaches: string[];
  description: string;
  artwork: "fight" | "strength" | "flow";
};
