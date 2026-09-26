import {
  membershipPlanIds,
  type GymSummary,
  type MembershipPlanId,
  type MembershipPlanSummary,
  type PublicCatalogue,
  type PublicCatalogueResult,
} from "@/domain/catalogue";

export const plans: MembershipPlanSummary[] = [
  {
    id: "basic",
    version: "2026-09-preview-v1",
    name: "Basic",
    price: { amount: 80, currency: "EUR" },
    priceInterval: "month",
    access: { model: "limited", includedCheckins: 10 },
    maxIncludedCheckinsPerDay: 1,
    requiredCoreGyms: 4,
    nonCoreVisitPrice: { amount: 15, currency: "EUR" },
    description: "Ten included check-ins across your selected core gyms.",
  },
  {
    id: "classic",
    version: "2026-09-preview-v1",
    name: "Classic",
    price: { amount: 150, currency: "EUR" },
    priceInterval: "month",
    access: { model: "daily-uncapped" },
    maxIncludedCheckinsPerDay: 1,
    requiredCoreGyms: 4,
    nonCoreVisitPrice: { amount: 15, currency: "EUR" },
    description:
      "Unlimited included check-ins with no numerical monthly allowance.",
  },
];

export const studios: GymSummary[] = [
  {
    id: "northside-combat",
    name: "Northside Combat",
    area: "Kreuzberg",
    activities: ["Muay Thai"],
    coaches: ["Sam Lee"],
    description:
      "Technique-led Muay Thai, welcoming pad rounds and a steady path from first class to confident combinations.",
    artwork: "fight",
    eligiblePlans: ["basic", "classic"],
    supportsNonCoreVisit: true,
    mapAnchor: {
      label: "Near Amerika-Gedenkbibliothek",
      address: "Blücherplatz 1, 10961 Berlin",
      latitude: 52.496568,
      longitude: 13.392365,
    },
    fixture: true,
  },
  {
    id: "fabrik",
    name: "Fabrik Training",
    area: "Neukölln",
    activities: ["Strength"],
    coaches: ["Maya Fischer"],
    description:
      "Small-group strength sessions, thoughtful coaching and flexible open-floor training for every experience level.",
    artwork: "strength",
    eligiblePlans: ["basic", "classic"],
    supportsNonCoreVisit: true,
    mapAnchor: {
      label: "Near Museum Neukölln",
      address: "Alt-Britz 81, 12359 Berlin",
      latitude: 52.446019,
      longitude: 13.437642,
    },
    fixture: true,
  },
  {
    id: "vela",
    name: "Studio Vela",
    area: "Prenzlauer Berg",
    activities: ["Yoga"],
    coaches: ["Lea Weber"],
    description:
      "A calm room for vinyasa, slower mobility sessions and mindful movement that fits around a busy week.",
    artwork: "flow",
    eligiblePlans: ["basic", "classic"],
    supportsNonCoreVisit: true,
    mapAnchor: {
      label: "Near Museum Pankow",
      address: "Prenzlauer Allee 227/228, 10405 Berlin",
      latitude: 52.53316,
      longitude: 13.41951,
    },
    fixture: true,
  },
  {
    id: "groundline-mma",
    name: "Groundline MMA",
    area: "Kreuzberg",
    activities: ["MMA", "Grappling"],
    coaches: ["Nora Klein", "Idris Malik"],
    description:
      "Structured MMA and no-gi grappling with fundamentals, controlled sparring and technical sessions for mixed levels.",
    artwork: "ground",
    eligiblePlans: ["basic", "classic"],
    supportsNonCoreVisit: true,
    mapAnchor: {
      label: "Near the Jewish Museum Berlin",
      address: "Lindenstraße 9–14, 10969 Berlin",
      latitude: 52.5023119,
      longitude: 13.3954469,
    },
    fixture: true,
  },
  {
    id: "kiezstrike",
    name: "Kiezstrike Club",
    area: "Kreuzberg",
    activities: ["Kickboxing"],
    coaches: ["Elif Demir"],
    description:
      "Beginner-friendly kickboxing, focused K1 technique and energetic conditioning in a respectful team setting.",
    artwork: "fight",
    eligiblePlans: ["basic", "classic"],
    supportsNonCoreVisit: true,
    mapAnchor: {
      label: "Near Berlinische Galerie",
      address: "Alte Jakobstraße 124–128, 10969 Berlin",
      latitude: 52.5033889,
      longitude: 13.3984444,
    },
    fixture: true,
  },
  {
    id: "quiet-current",
    name: "Quiet Current Recovery",
    area: "Charlottenburg",
    activities: ["Massage", "Wellness"],
    coaches: ["Anika Roth"],
    description:
      "Sports massage, guided recovery and restorative wellness sessions designed to complement regular training.",
    artwork: "recovery",
    eligiblePlans: ["classic"],
    supportsNonCoreVisit: true,
    mapAnchor: {
      label: "Near Museum Berggruen",
      address: "Schloßstraße 1, 14059 Berlin",
      latitude: 52.5191944,
      longitude: 13.2953056,
    },
    fixture: true,
  },
  {
    id: "nightshift-athletic",
    name: "Nightshift Athletic Club",
    area: "Mitte",
    activities: ["Strength", "Yoga"],
    coaches: ["Jules Hartmann", "Mina Okafor"],
    description:
      "A music-and-light-led club with strength circuits, mobility and yoga across early mornings and late evenings.",
    artwork: "night",
    eligiblePlans: ["classic"],
    supportsNonCoreVisit: false,
    mapAnchor: {
      label: "Near Futurium",
      address: "Alexanderufer 2, 10117 Berlin",
      latitude: 52.5240876,
      longitude: 13.3743507,
    },
    fixture: true,
  },
];

const fixtureCatalogue: PublicCatalogue = {
  source: "preview-fixtures",
  version: "2026-09-preview-v1",
  plans,
  gyms: studios,
};

function hasUniqueValues(values: readonly string[]) {
  return new Set(values).size === values.length;
}

function hasKnownPlanIds(
  planIds: readonly string[],
): planIds is MembershipPlanId[] {
  return planIds.every((planId) =>
    membershipPlanIds.includes(planId as MembershipPlanId),
  );
}

function isValidPlan(plan: MembershipPlanSummary) {
  return (
    membershipPlanIds.includes(plan.id) &&
    plan.price.currency === "EUR" &&
    plan.price.amount > 0 &&
    plan.priceInterval === "month" &&
    plan.maxIncludedCheckinsPerDay === 1 &&
    plan.requiredCoreGyms === 4 &&
    plan.nonCoreVisitPrice.currency === "EUR" &&
    plan.nonCoreVisitPrice.amount === 15 &&
    (plan.access.model === "daily-uncapped" ||
      (plan.access.model === "limited" && plan.access.includedCheckins > 0))
  );
}

function isValidGym(gym: GymSummary) {
  return (
    gym.fixture === true &&
    gym.id.length > 0 &&
    gym.name.length > 0 &&
    gym.area.length > 0 &&
    gym.activities.length > 0 &&
    gym.eligiblePlans.length > 0 &&
    hasKnownPlanIds(gym.eligiblePlans) &&
    gym.mapAnchor.label.length > 0 &&
    gym.mapAnchor.address.endsWith("Berlin") &&
    Number.isFinite(gym.mapAnchor.latitude) &&
    Number.isFinite(gym.mapAnchor.longitude)
  );
}

export function loadPreviewCatalogue(source: unknown): PublicCatalogueResult {
  if (!source || typeof source !== "object") {
    return {
      status: "error",
      message: "The preview catalogue is unavailable.",
    };
  }

  const candidate = source as Partial<PublicCatalogue>;
  if (!Array.isArray(candidate.plans) || !Array.isArray(candidate.gyms)) {
    return {
      status: "error",
      message: "The preview catalogue could not be read safely.",
    };
  }
  if (!candidate.plans.length || !candidate.gyms.length) {
    return { status: "empty" };
  }

  const valid =
    candidate.source === "preview-fixtures" &&
    typeof candidate.version === "string" &&
    candidate.version.length > 0 &&
    candidate.plans.every(isValidPlan) &&
    candidate.gyms.every(isValidGym) &&
    hasUniqueValues(candidate.plans.map((plan) => plan.id)) &&
    hasUniqueValues(candidate.gyms.map((gym) => gym.id));

  if (!valid) {
    return {
      status: "error",
      message: "The preview catalogue contains invalid data.",
    };
  }

  return { status: "ready", catalogue: candidate as PublicCatalogue };
}

export const previewCatalogue = loadPreviewCatalogue(fixtureCatalogue);

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
