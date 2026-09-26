import { Explore } from "@/features/discovery/explore";
export const metadata = { title: "Explore" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <Explore
      key={typeof q === "string" ? q : ""}
      initialQuery={typeof q === "string" ? q : ""}
    />
  );
}
