import { Explore } from "@/features/discovery/explore";
export const metadata = { title: "Explore" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string }>;
}) {
  const { q, view } = await searchParams;
  return (
    <Explore
      key={`${typeof q === "string" ? q : ""}-${view || "classes"}`}
      initialView={view === "events" || view === "studios" ? view : "classes"}
      initialQuery={typeof q === "string" ? q : ""}
    />
  );
}
