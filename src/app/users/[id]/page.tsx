import { notFound } from "next/navigation";
import { Profile } from "@/components/profile";
import { people } from "@/lib/fixtures";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!people.some((p) => p.id === id)) notFound();
  return <Profile personId={id} />;
}
