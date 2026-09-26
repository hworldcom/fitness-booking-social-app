export type DemoState = {
  version: 3;
  following: string[];
};

export const INITIAL_STATE: DemoState = {
  version: 3,
  following: ["daniel"],
};

export type DemoAction = { type: "follow"; id: string } | { type: "reset" };

const toggle = (values: string[], id: string) =>
  values.includes(id) ? values.filter((x) => x !== id) : [...values, id];

export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "follow":
      return { ...state, following: toggle(state.following, action.id) };
    case "reset":
      return {
        version: 3,
        following: ["daniel"],
      };
  }
}

export function parseDemo(raw: string | null): DemoState {
  if (!raw) return INITIAL_STATE;
  try {
    const s = JSON.parse(raw);
    if (![1, 2, 3].includes(s?.version) || !Array.isArray(s.following))
      return INITIAL_STATE;
    const following: unknown[] = s.following;
    if (!following.every((x): x is string => typeof x === "string"))
      return INITIAL_STATE;
    // Keep supported follows and deliberately discard retired product fields
    // from earlier preview versions.
    return {
      version: 3,
      following: [...new Set(following)],
    };
  } catch {
    return INITIAL_STATE;
  }
}
