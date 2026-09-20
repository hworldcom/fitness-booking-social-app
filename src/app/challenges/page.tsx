import { ChallengeList } from "@/features/challenges/challenges";
export const metadata = { title: "Challenges" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 200) : "";
  const mode =
    params.mode === "community" || params.mode === "sponsored"
      ? params.mode
      : "all";
  return (
    <ChallengeList
      key={`${query}-${mode}`}
      initialQuery={query}
      initialMode={mode}
    />
  );
}
