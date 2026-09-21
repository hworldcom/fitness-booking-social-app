import { notFound } from "next/navigation";
import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { Profile } from "@/features/profile/profile";
import { people } from "@/features/preview/catalogue";
import { protectedPageAccess } from "@/server/authorization/page-access";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!people.some((p) => p.id === id)) notFound();
  const access = await protectedPageAccess(`/users/${encodeURIComponent(id)}`);
  if (access.status === "unavailable") {
    return <ProtectedAccessUnavailable />;
  }
  return <Profile personId={id} />;
}
