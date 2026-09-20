import { notFound } from "next/navigation";
import { Profile } from "@/features/profile/profile";
import { people } from "@/features/preview/catalogue";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!people.some((p) => p.id === id)) notFound();
  return <Profile personId={id} />;
}
